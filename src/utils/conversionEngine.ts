import {
  AccountingStandard,
  ConversionInput,
  ConversionResult,
  ConvertedAccount,
  ExtractedAccount,
  AdjustmentItem,
  ConversionDetails,
} from '@/types/accounting';
import { findMappingByAccountName, findMappingByKGAAPCode } from './accountMapping';
import { parseExcelFile } from './excelParser';

/**
 * 회계기준 변환을 실행합니다.
 */
export async function executeConversion(
  input: ConversionInput,
  details?: ConversionDetails
): Promise<ConversionResult> {
  // 1. 엑셀 파일 파싱
  const extractedAccounts = await parseExcelFile(input.file);

  // 2. 계정 매핑 및 변환
  const convertedAccounts = await convertAccounts(
    extractedAccounts,
    input.sourceStandard,
    input.targetStandard
  );

  // 3. 조정 항목 생성
  const adjustments = await generateAdjustments(
    convertedAccounts,
    input.sourceStandard,
    input.targetStandard,
    details
  );

  // 4. 조정 항목을 계정에 반영
  const finalAccounts = applyAdjustments(convertedAccounts, adjustments);

  return {
    accounts: finalAccounts,
    adjustments,
    summary: {
      totalAccounts: finalAccounts.length,
      totalAdjustments: adjustments.length,
      conversionDate: new Date().toISOString(),
      sourceStandard: input.sourceStandard,
      targetStandard: input.targetStandard,
    },
  };
}

/**
 * 추출된 계정을 목표 기준으로 변환합니다.
 */
async function convertAccounts(
  accounts: ExtractedAccount[],
  _sourceStandard: AccountingStandard,
  targetStandard: AccountingStandard
): Promise<ConvertedAccount[]> {
  const converted: ConvertedAccount[] = [];

  for (const account of accounts) {
    // 계정 매핑 찾기
    let mapping = account.accountCode
      ? findMappingByKGAAPCode(account.accountCode)
      : findMappingByAccountName(account.accountName);

    if (!mapping) {
      // 매핑을 찾지 못한 경우, 유사 검색
      mapping = findMappingByAccountName(account.accountName);
    }

    if (mapping) {
      const targetCode =
        targetStandard === 'IFRS' ? mapping.ifrsCode : mapping.usgaapCode;

      converted.push({
        ...account,
        internalCode: mapping.internalCode,
        internalName: mapping.internalName,
        targetCode,
        mappingType: mapping.mappingType,
        adjustments: [],
      });
    } else {
      // 매핑을 찾지 못한 경우, 원본 데이터 유지
      converted.push({
        ...account,
        internalCode: 'UNMAPPED',
        internalName: account.accountName,
        targetCode: 'UNMAPPED',
        mappingType: '1:1',
        adjustments: [],
      });
    }
  }

  return converted;
}

/**
 * 조정 항목을 생성합니다.
 */
async function generateAdjustments(
  accounts: ConvertedAccount[],
  sourceStandard: AccountingStandard,
  targetStandard: AccountingStandard,
  details?: ConversionDetails
): Promise<AdjustmentItem[]> {
  const adjustments: AdjustmentItem[] = [];

  // IFRS → US-GAAP 전환 시 특별 조정
  if (sourceStandard === 'IFRS' && targetStandard === 'US-GAAP') {
    adjustments.push(...generateIFRStoUSGAAPAdjustments(accounts, details));
  }

  // K-GAAP → IFRS 전환 시 특별 조정
  if (sourceStandard === 'K-GAAP' && targetStandard === 'IFRS') {
    adjustments.push(...generateKGAAPtoIFRSAdjustments(accounts, details));
  }

  // K-GAAP → US-GAAP 전환 시 특별 조정
  if (sourceStandard === 'K-GAAP' && targetStandard === 'US-GAAP') {
    adjustments.push(...generateKGAAPtoUSGAAPAdjustments(accounts, details));
  }

  return adjustments;
}

/**
 * IFRS → US-GAAP 조정 항목 생성
 */
function generateIFRStoUSGAAPAdjustments(
  accounts: ConvertedAccount[],
  details?: ConversionDetails
): AdjustmentItem[] {
  const adjustments: AdjustmentItem[] = [];

  // 1. 재평가잉여금 제거 (US-GAAP은 원가모형만 허용)
  if (details?.assetValuation?.model === 'revaluation') {
    const ppe = accounts.find(acc => acc.internalCode === '2001');
    const oci = accounts.find(acc => acc.internalCode === '4301');

    if (ppe && details.assetValuation.fairValue) {
      const revaluationAmount = details.assetValuation.fairValue - ppe.amount;

      adjustments.push({
        reason: '재평가잉여금 제거',
        beforeAmount: ppe.amount,
        adjustmentName: '유형자산(재평가)',
        adjustmentAmount: -revaluationAmount,
        afterAmount: ppe.amount - revaluationAmount,
        note: 'IFRS 재평가모형에서 US GAAP 원가모형으로 환산 시 제거 필요',
      });

      if (oci) {
        adjustments.push({
          reason: '재평가잉여금 제거',
          beforeAmount: oci.amount,
          adjustmentName: '기타포괄손익누계액',
          adjustmentAmount: -revaluationAmount,
          afterAmount: oci.amount - revaluationAmount,
          note: '재평가잉여금을 이익잉여금으로 재분류',
        });
      }
    }
  }

  // 2. 수익인식 타이밍 차이
  if (details?.revenue) {
    const revenue = accounts.find(acc => acc.internalCode === '5001');

    if (
      revenue &&
      details.revenue.recognitionMethod === 'over-time'
    ) {
      // US-GAAP에서 일부 기간 인식을 시점 인식으로 변경해야 할 수 있음
      const adjustmentRatio = 0.2; // 예시: 20% 조정
      const adjustmentAmount = revenue.amount * adjustmentRatio;

      adjustments.push({
        reason: '수익인식타이밍차이',
        beforeAmount: revenue.amount,
        adjustmentName: '매출액',
        adjustmentAmount: -adjustmentAmount,
        afterAmount: revenue.amount - adjustmentAmount,
        note: 'US GAAP 적용 시 일부 매출을 이연 처리',
      });
    }
  }

  return adjustments;
}

/**
 * K-GAAP → IFRS 조정 항목 생성
 */
function generateKGAAPtoIFRSAdjustments(
  accounts: ConvertedAccount[],
  details?: ConversionDetails
): AdjustmentItem[] {
  const adjustments: AdjustmentItem[] = [];

  // 1. 리스자산 및 리스부채 인식 (IFRS 16)
  if (details?.lease) {
    const { leaseTerm, discountRate, leasePayment, paymentFrequency } =
      details.lease;

    // 리스부채 현재가치 계산
    const paymentsPerYear =
      paymentFrequency === 'monthly'
        ? 12
        : paymentFrequency === 'quarterly'
        ? 4
        : 1;
    const totalPayments = (leaseTerm / 12) * paymentsPerYear;
    const periodRate = discountRate / paymentsPerYear;

    // 현재가치 계산 (연금 현가)
    const presentValue =
      leasePayment *
      ((1 - Math.pow(1 + periodRate, -totalPayments)) / periodRate);

    adjustments.push({
      reason: 'IFRS 16 리스 기준 적용',
      beforeAmount: 0,
      adjustmentName: '사용권자산',
      adjustmentAmount: presentValue,
      afterAmount: presentValue,
      note: '운용리스를 사용권자산으로 인식',
    });

    adjustments.push({
      reason: 'IFRS 16 리스 기준 적용',
      beforeAmount: 0,
      adjustmentName: '리스부채',
      adjustmentAmount: presentValue,
      afterAmount: presentValue,
      note: '리스부채 인식',
    });
  }

  // 2. 개발비 자산화
  if (details?.intangibleAsset && details.intangibleAsset.assetType === 'development') {
    const checklist = details.intangibleAsset.capitalizationChecklist;
    const allConditionsMet = Object.values(checklist).every(v => v === true);

    if (allConditionsMet) {
      adjustments.push({
        reason: '개발비 자산화 조건 충족',
        beforeAmount: 0,
        adjustmentName: '무형자산(개발비)',
        adjustmentAmount: details.intangibleAsset.expenditures,
        afterAmount: details.intangibleAsset.expenditures,
        note: '개발비를 비용에서 자산으로 재분류',
      });

      adjustments.push({
        reason: '개발비 자산화 조건 충족',
        beforeAmount: details.intangibleAsset.expenditures,
        adjustmentName: '연구개발비(비용)',
        adjustmentAmount: -details.intangibleAsset.expenditures,
        afterAmount: 0,
        note: '비용 처리된 개발비를 자산으로 이전',
      });
    }
  }

  // 3. 퇴직급여충당부채 재측정
  if (details?.retirementBenefit) {
    const { currentObligation, planAssets } = details.retirementBenefit;
    const netLiability = currentObligation - planAssets;

    const currentAccount = accounts.find(acc => acc.internalCode === '3401');
    if (currentAccount) {
      const adjustmentAmount = netLiability - currentAccount.amount;

      if (Math.abs(adjustmentAmount) > 0) {
        adjustments.push({
          reason: '확정급여부채 보험수리적 재측정',
          beforeAmount: currentAccount.amount,
          adjustmentName: '퇴직급여충당부채',
          adjustmentAmount,
          afterAmount: netLiability,
          note: '보험수리적 가정 변경에 따른 조정',
        });
      }
    }
  }

  // 4. 충당부채 인식
  if (details?.provision) {
    const checklist = details.provision.recognitionChecklist;
    const canRecognize = Object.values(checklist).every(v => v === true);

    if (canRecognize && details.provision.scenarios.length > 0) {
      // 가중평균 금액 계산
      let expectedValue = 0;
      for (const scenario of details.provision.scenarios) {
        expectedValue += scenario.estimatedAmount * scenario.probability;
      }

      // 현재가치 할인 (1년 이상인 경우)
      if (
        details.provision.settlementPeriod > 1 &&
        details.provision.discountRate
      ) {
        expectedValue =
          expectedValue /
          Math.pow(1 + details.provision.discountRate, details.provision.settlementPeriod);
      }

      adjustments.push({
        reason: '충당부채 인식',
        beforeAmount: 0,
        adjustmentName: '충당부채',
        adjustmentAmount: expectedValue,
        afterAmount: expectedValue,
        note: '의무 이행을 위한 충당부채 인식',
      });
    }
  }

  return adjustments;
}

/**
 * K-GAAP → US-GAAP 조정 항목 생성
 */
function generateKGAAPtoUSGAAPAdjustments(
  accounts: ConvertedAccount[],
  details?: ConversionDetails
): AdjustmentItem[] {
  // K-GAAP → IFRS 조정 후 IFRS → US-GAAP 조정 적용
  const kgaapToIfrs = generateKGAAPtoIFRSAdjustments(accounts, details);
  const ifrsToUsgaap = generateIFRStoUSGAAPAdjustments(accounts, details);

  return [...kgaapToIfrs, ...ifrsToUsgaap];
}

/**
 * 조정 항목을 계정에 반영합니다.
 */
function applyAdjustments(
  accounts: ConvertedAccount[],
  adjustments: AdjustmentItem[]
): ConvertedAccount[] {
  const accountMap = new Map<string, ConvertedAccount>();

  // 계정 맵 생성
  for (const account of accounts) {
    accountMap.set(account.internalName, { ...account, adjustments: [] });
  }

  // 조정 항목 적용
  for (const adjustment of adjustments) {
    const account = accountMap.get(adjustment.adjustmentName);

    if (account) {
      account.amount = adjustment.afterAmount;
      if (!account.adjustments) {
        account.adjustments = [];
      }
      account.adjustments.push(adjustment);
    } else {
      // 새로운 계정 생성 (예: 사용권자산, 리스부채)
      const newAccount: ConvertedAccount = {
        accountCode: '',
        accountName: adjustment.adjustmentName,
        amount: adjustment.afterAmount,
        internalCode: 'NEW',
        internalName: adjustment.adjustmentName,
        targetCode: 'NEW',
        mappingType: '1:1',
        adjustments: [adjustment],
      };
      accountMap.set(adjustment.adjustmentName, newAccount);
    }
  }

  return Array.from(accountMap.values());
}
