import { AccountMapping } from '@/types/accounting';

/**
 * 계정과목 매핑 테이블
 * K-GAAP, IFRS, US-GAAP 간의 계정과목 매핑 정보
 */
export const ACCOUNT_MAPPINGS: AccountMapping[] = [
  // 자산 - 유동자산
  {
    internalCode: '1001',
    internalName: '현금및현금성자산',
    kgaapCode: '101',
    kgaapName: '현금및현금성자산',
    ifrsCode: 'CashAndCashEquivalentsAtCarryingValue',
    usgaapCode: 'CashAndCashEquivalentsAtCarryingValue',
    mappingType: '1:1',
  },
  {
    internalCode: '1101',
    internalName: '매출채권(순액)',
    kgaapCode: '112',
    kgaapName: '매출채권',
    ifrsCode: 'TradeAndOtherReceivablesCurrent',
    usgaapCode: 'AccountsReceivableNetCurrent',
    mappingType: '1:1',
  },
  {
    internalCode: '1201',
    internalName: '재고자산',
    kgaapCode: '115',
    kgaapName: '재고자산',
    ifrsCode: 'Inventories',
    usgaapCode: 'InventoryNet',
    mappingType: '1:1',
  },
  {
    internalCode: '1301',
    internalName: '단기금융상품',
    kgaapCode: '110',
    kgaapName: '단기금융상품',
    ifrsCode: 'ShortTermInvestments',
    usgaapCode: 'ShortTermInvestments',
    mappingType: '1:1',
  },
  {
    internalCode: '1401',
    internalName: '기타유동자산',
    kgaapCode: '120',
    kgaapName: '기타유동자산',
    ifrsCode: 'OtherCurrentAssets',
    usgaapCode: 'OtherAssetsCurrent',
    mappingType: '1:1',
  },

  // 자산 - 비유동자산
  {
    internalCode: '2001',
    internalName: '유형자산(장부가)',
    kgaapCode: '201',
    kgaapName: '유형자산',
    ifrsCode: 'PropertyPlantAndEquipmentNet',
    usgaapCode: 'PropertyPlantAndEquipmentNet',
    mappingType: '조정필요',
    note: 'IFRS→ 재평가모형 관련 질문 필요, US-GAAP→ 원가모형만 허용',
  },
  {
    internalCode: '2101',
    internalName: '무형자산',
    kgaapCode: '220',
    kgaapName: '무형자산',
    ifrsCode: 'IntangibleAssetsNetExcludingGoodwill',
    usgaapCode: 'IntangibleAssetsNetExcludingGoodwill',
    mappingType: '1:1',
  },
  {
    internalCode: '2201',
    internalName: '영업권',
    kgaapCode: '221',
    kgaapName: '영업권',
    ifrsCode: 'Goodwill',
    usgaapCode: 'Goodwill',
    mappingType: '1:1',
  },
  {
    internalCode: '2301',
    internalName: '투자부동산',
    kgaapCode: '210',
    kgaapName: '투자부동산',
    ifrsCode: 'InvestmentProperty',
    usgaapCode: 'RealEstateInvestmentPropertyNet',
    mappingType: '1:1',
  },
  {
    internalCode: '2401',
    internalName: '장기금융상품',
    kgaapCode: '230',
    kgaapName: '장기금융상품',
    ifrsCode: 'NoncurrentInvestments',
    usgaapCode: 'InvestmentsNoncurrent',
    mappingType: '1:1',
  },
  {
    internalCode: '2501',
    internalName: '사용권자산',
    kgaapCode: '215',
    kgaapName: '사용권자산',
    ifrsCode: 'RightOfUseAssets',
    usgaapCode: 'OperatingLeaseRightOfUseAsset',
    mappingType: '조정필요',
    note: 'IFRS 16 리스 기준 적용',
  },

  // 부채 - 유동부채
  {
    internalCode: '3001',
    internalName: '유동부채 총계',
    kgaapCode: '301',
    kgaapName: '유동부채',
    ifrsCode: 'LiabilitiesCurrent',
    usgaapCode: 'LiabilitiesCurrent',
    mappingType: '집계',
  },
  {
    internalCode: '3011',
    internalName: '매입채무',
    kgaapCode: '311',
    kgaapName: '매입채무',
    ifrsCode: 'TradeAndOtherPayablesCurrent',
    usgaapCode: 'AccountsPayableCurrent',
    mappingType: '1:1',
  },
  {
    internalCode: '3021',
    internalName: '단기차입금',
    kgaapCode: '312',
    kgaapName: '단기차입금',
    ifrsCode: 'ShortTermBorrowings',
    usgaapCode: 'ShortTermBorrowings',
    mappingType: '1:1',
  },
  {
    internalCode: '3031',
    internalName: '유동성장기부채',
    kgaapCode: '313',
    kgaapName: '유동성장기부채',
    ifrsCode: 'CurrentPortionOfLongTermDebt',
    usgaapCode: 'LongTermDebtCurrent',
    mappingType: '1:1',
  },
  {
    internalCode: '3041',
    internalName: '리스부채(유동)',
    kgaapCode: '314',
    kgaapName: '유동리스부채',
    ifrsCode: 'LeaseLiabilitiesCurrent',
    usgaapCode: 'OperatingLeaseLiabilityCurrent',
    mappingType: '조정필요',
    note: 'IFRS 16 리스 기준 적용',
  },

  // 부채 - 비유동부채
  {
    internalCode: '3101',
    internalName: '장기차입금',
    kgaapCode: '305',
    kgaapName: '장기차입금',
    ifrsCode: 'LongTermDebtNoncurrent',
    usgaapCode: 'LongTermDebtNoncurrent',
    mappingType: '1:1',
  },
  {
    internalCode: '3201',
    internalName: '사채',
    kgaapCode: '320',
    kgaapName: '사채',
    ifrsCode: 'BondsPayableNoncurrent',
    usgaapCode: 'LongTermDebtNoncurrent',
    mappingType: '조정필요',
    note: '유효이자율법 적용 필요',
  },
  {
    internalCode: '3301',
    internalName: '전환사채',
    kgaapCode: '321',
    kgaapName: '전환사채',
    ifrsCode: 'ConvertibleBondsPayable',
    usgaapCode: 'ConvertibleDebt',
    mappingType: '조정필요',
    note: '부채-자본 분리 인식 (IFRS)',
  },
  {
    internalCode: '3401',
    internalName: '퇴직급여충당부채',
    kgaapCode: '330',
    kgaapName: '퇴직급여충당부채',
    ifrsCode: 'DefinedBenefitPensionPlansNoncurrent',
    usgaapCode: 'PensionAndOtherPostretirementDefinedBenefitPlansLiabilitiesNoncurrent',
    mappingType: '조정필요',
    note: '보험수리적 평가 필요',
  },
  {
    internalCode: '3501',
    internalName: '충당부채',
    kgaapCode: '340',
    kgaapName: '충당부채',
    ifrsCode: 'ProvisionsNoncurrent',
    usgaapCode: 'LiabilityForUncertaintyInIncomeTaxesNoncurrent',
    mappingType: '조정필요',
    note: '인식 조건 검토 필요',
  },
  {
    internalCode: '3601',
    internalName: '리스부채(비유동)',
    kgaapCode: '315',
    kgaapName: '장기리스부채',
    ifrsCode: 'LeaseLiabilitiesNoncurrent',
    usgaapCode: 'OperatingLeaseLiabilityNoncurrent',
    mappingType: '조정필요',
    note: 'IFRS 16 리스 기준 적용',
  },

  // 자본
  {
    internalCode: '4001',
    internalName: '자본금',
    kgaapCode: '401',
    kgaapName: '자본금',
    ifrsCode: 'ShareCapital',
    usgaapCode: 'CommonStockValue',
    mappingType: '1:1',
  },
  {
    internalCode: '4101',
    internalName: '자본잉여금',
    kgaapCode: '410',
    kgaapName: '자본잉여금',
    ifrsCode: 'SharePremium',
    usgaapCode: 'AdditionalPaidInCapital',
    mappingType: '1:1',
  },
  {
    internalCode: '4201',
    internalName: '이익잉여금',
    kgaapCode: '420',
    kgaapName: '이익잉여금',
    ifrsCode: 'RetainedEarnings',
    usgaapCode: 'RetainedEarningsAccumulatedDeficit',
    mappingType: '1:1',
  },
  {
    internalCode: '4301',
    internalName: '기타포괄손익누계액',
    kgaapCode: '430',
    kgaapName: '기타포괄손익누계액',
    ifrsCode: 'ReserveOfOtherComprehensiveIncome',
    usgaapCode: 'AccumulatedOtherComprehensiveIncomeLossNetOfTax',
    mappingType: '조정필요',
    note: '재평가잉여금, 보험수리적손익 등 포함',
  },

  // 손익계산서 - 수익
  {
    internalCode: '5001',
    internalName: '매출액',
    kgaapCode: '401',
    kgaapName: '매출액',
    ifrsCode: 'RevenueFromContractWithCustomerExcludingAssessedTax',
    usgaapCode: 'Revenues',
    mappingType: '조정필요',
    note: '수익인식 기준 차이 검토 (시점/기간 체크리스트 필요)',
  },

  // 손익계산서 - 비용
  {
    internalCode: '5101',
    internalName: '매출원가',
    kgaapCode: '402',
    kgaapName: '매출원가',
    ifrsCode: 'CostOfSales',
    usgaapCode: 'CostOfGoodsSold',
    mappingType: '1:1',
  },
  {
    internalCode: '5201',
    internalName: '판매비와관리비',
    kgaapCode: '410',
    kgaapName: '판매비와관리비',
    ifrsCode: 'SellingGeneralAndAdministrativeExpenses',
    usgaapCode: 'SellingGeneralAndAdministrativeExpense',
    mappingType: '1:1',
  },
  {
    internalCode: '5301',
    internalName: '급여',
    kgaapCode: '411',
    kgaapName: '급여',
    ifrsCode: 'EmployeeBenefitsExpense',
    usgaapCode: 'LaborAndRelatedExpense',
    mappingType: '1:1',
  },
  {
    internalCode: '5401',
    internalName: '감가상각비',
    kgaapCode: '412',
    kgaapName: '감가상각비',
    ifrsCode: 'DepreciationAndAmortisationExpense',
    usgaapCode: 'DepreciationDepletionAndAmortization',
    mappingType: '1:1',
  },
  {
    internalCode: '5501',
    internalName: '연구개발비',
    kgaapCode: '413',
    kgaapName: '연구개발비',
    ifrsCode: 'ResearchAndDevelopmentExpense',
    usgaapCode: 'ResearchAndDevelopmentExpense',
    mappingType: '조정필요',
    note: '개발비 자산화 조건 검토',
  },

  // 손익계산서 - 영업손익
  {
    internalCode: '6001',
    internalName: '영업이익(손실)',
    kgaapCode: '450',
    kgaapName: '영업이익',
    ifrsCode: 'OperatingProfitLoss',
    usgaapCode: 'OperatingIncomeLoss',
    mappingType: '계산항목',
    note: '자동계산 필요',
  },

  // 손익계산서 - 영업외손익
  {
    internalCode: '6101',
    internalName: '이자수익',
    kgaapCode: '460',
    kgaapName: '이자수익',
    ifrsCode: 'InterestIncome',
    usgaapCode: 'InterestIncomeOther',
    mappingType: '1:1',
  },
  {
    internalCode: '6201',
    internalName: '이자비용',
    kgaapCode: '470',
    kgaapName: '이자비용',
    ifrsCode: 'InterestExpense',
    usgaapCode: 'InterestExpense',
    mappingType: '1:1',
  },
  {
    internalCode: '6301',
    internalName: '외환손익',
    kgaapCode: '480',
    kgaapName: '외환손익',
    ifrsCode: 'ForeignExchangeGainLoss',
    usgaapCode: 'ForeignCurrencyTransactionGainLossBeforeTax',
    mappingType: '1:1',
  },

  // 손익계산서 - 법인세 및 당기순손익
  {
    internalCode: '7001',
    internalName: '법인세비용차감전순이익',
    kgaapCode: '490',
    kgaapName: '법인세비용차감전순이익',
    ifrsCode: 'ProfitLossBeforeTax',
    usgaapCode: 'IncomeLossFromContinuingOperationsBeforeIncomeTaxesExtraordinaryItemsNoncontrollingInterest',
    mappingType: '계산항목',
  },
  {
    internalCode: '7101',
    internalName: '법인세비용',
    kgaapCode: '491',
    kgaapName: '법인세비용',
    ifrsCode: 'IncomeTaxExpenseContinuingOperations',
    usgaapCode: 'IncomeTaxExpenseBenefit',
    mappingType: '1:1',
  },
  {
    internalCode: '7201',
    internalName: '당기순이익',
    kgaapCode: '500',
    kgaapName: '당기순이익',
    ifrsCode: 'ProfitLoss',
    usgaapCode: 'NetIncomeLoss',
    mappingType: '계산항목',
  },
];

/**
 * 계정코드로 매핑 정보 찾기 (K-GAAP 코드 기준)
 */
export function findMappingByKGAAPCode(code: string): AccountMapping | undefined {
  return ACCOUNT_MAPPINGS.find(mapping => mapping.kgaapCode === code);
}

/**
 * 계정명으로 매핑 정보 찾기 (유사 검색 포함)
 */
export function findMappingByAccountName(name: string): AccountMapping | undefined {
  // 정확한 일치 우선
  const exactMatch = ACCOUNT_MAPPINGS.find(
    mapping => mapping.kgaapName === name || mapping.internalName === name
  );

  if (exactMatch) return exactMatch;

  // 부분 일치 검색 (공백 제거 후)
  const normalizedName = name.replace(/\s/g, '').toLowerCase();
  return ACCOUNT_MAPPINGS.find(mapping => {
    const normalizedKGAAP = mapping.kgaapName?.replace(/\s/g, '').toLowerCase();
    const normalizedInternal = mapping.internalName.replace(/\s/g, '').toLowerCase();
    return normalizedKGAAP?.includes(normalizedName) ||
           normalizedInternal.includes(normalizedName) ||
           normalizedName.includes(normalizedInternal);
  });
}

/**
 * 내부표준코드로 매핑 정보 찾기
 */
export function findMappingByInternalCode(code: string): AccountMapping | undefined {
  return ACCOUNT_MAPPINGS.find(mapping => mapping.internalCode === code);
}

/**
 * 특정 매핑 타입의 모든 계정 가져오기
 */
export function getMappingsByType(type: string): AccountMapping[] {
  return ACCOUNT_MAPPINGS.filter(mapping => mapping.mappingType === type);
}
