import {
  AccountingStandard,
  AdjustmentItem,
  ConversionDetails,
  ConversionInput,
  ConversionResult,
  ConvertedAccount,
  ExtractedAccount,
} from "@/types/accounting";
import OpenAI from "openai";
import { ACCOUNT_MAPPINGS } from "./accountMapping";
import { parseExcelFile } from "./excelParser";
import { parsePDFFile } from "./pdfParser";

// OpenAI 클라이언트 초기화
const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error(
      "OPENAI_API_KEY가 설정되지 않았습니다. .env 파일에 VITE_OPENAI_API_KEY를 추가해주세요."
    );
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true, // 클라이언트 사이드에서 사용 (프로덕션에서는 백엔드 권장)
  });
};

/**
 * AI를 사용하여 회계기준을 변환합니다.
 */
export async function executeAIConversion(
  input: ConversionInput,
  details?: ConversionDetails
): Promise<ConversionResult> {
  // 1. 파일에서 데이터 추출
  let extractedText = "";
  let extractedAccounts: ExtractedAccount[] = [];

  if (input.file.name.endsWith(".pdf")) {
    // PDF 파일 처리
    extractedText = await parsePDFFile(input.file);
    extractedAccounts = await extractAccountsWithAI(
      extractedText,
      input.sourceStandard
    );
  } else {
    // 엑셀 파일 처리
    extractedAccounts = await parseExcelFile(input.file);
  }

  // 2. AI를 사용하여 계정 매핑 및 변환
  const convertedAccounts = await convertAccountsWithAI(
    extractedAccounts,
    input.sourceStandard,
    input.targetStandard
  );

  // 3. AI를 사용하여 조정 항목 생성
  const adjustments = await generateAdjustmentsWithAI(
    convertedAccounts,
    input.sourceStandard,
    input.targetStandard,
    details
  );

  // 4. 조정 항목 적용
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
 * AI를 사용하여 텍스트에서 계정 정보를 추출합니다.
 */
export async function extractAccountsWithAI(
  text: string,
  sourceStandard: AccountingStandard
): Promise<ExtractedAccount[]> {
  const openai = getOpenAIClient();

  const prompt = `다음은 ${sourceStandard} 기준의 재무제표 데이터입니다.
이 텍스트에서 계정과목과 금액을 추출하여 JSON 형식으로 반환해주세요.

각 항목은 다음 JSON 형식이어야 합니다:
{
  "accountCode": "계정코드 (있는 경우)",
  "accountName": "계정과목명",
  "amount": 금액 (숫자)
}

소계, 합계, 총계는 제외해주세요.

재무제표 데이터:
${text}

반드시 JSON 형식으로만 반환해주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "당신은 회계 전문가입니다. 재무제표에서 계정과목을 정확하게 추출할 수 있습니다.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0].message.content || "{}";
  const parsed = JSON.parse(responseText);

  // accounts 배열이 있으면 반환, 없으면 전체 객체를 배열로 감싸서 반환
  return parsed.accounts || [parsed];
}

/**
 * AI를 사용하여 계정을 목표 기준으로 변환합니다.
 */
async function convertAccountsWithAI(
  accounts: ExtractedAccount[],
  sourceStandard: AccountingStandard,
  targetStandard: AccountingStandard
): Promise<ConvertedAccount[]> {
  const openai = getOpenAIClient();

  // 계정 매핑 테이블을 컨텍스트로 제공
  const mappingContext = ACCOUNT_MAPPINGS.map((m) => ({
    internalCode: m.internalCode,
    internalName: m.internalName,
    kgaapCode: m.kgaapCode,
    ifrsCode: m.ifrsCode,
    usgaapCode: m.usgaapCode,
    mappingType: m.mappingType,
  }));

  const prompt = `다음 계정들을 ${sourceStandard}에서 ${targetStandard}로 변환해주세요.

제공된 계정 매핑 테이블을 참고하여 각 계정을 적절한 내부표준코드와 목표 기준 코드로 매핑해주세요.

계정 목록:
${JSON.stringify(accounts, null, 2)}

계정 매핑 테이블:
${JSON.stringify(mappingContext, null, 2)}

각 계정에 대해 다음 JSON 형식으로 반환해주세요:
{
  "accounts": [
    {
      "accountCode": "원본 계정코드",
      "accountName": "원본 계정명",
      "amount": 금액,
      "internalCode": "내부표준코드",
      "internalName": "내부표준계정명",
      "targetCode": "${targetStandard} 계정코드",
      "mappingType": "매핑유형 (1:1, 집계, 계산항목, 조정필요)"
    }
  ]
}

매핑 테이블에 없는 계정은 가장 유사한 계정으로 매핑하거나, UNMAPPED로 표시해주세요.
반드시 JSON 형식으로만 응답해주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `당신은 ${sourceStandard}, IFRS, US-GAAP에 정통한 회계 전문가입니다. 계정과목을 정확하게 매핑할 수 있습니다.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const responseText =
    completion.choices[0].message.content || '{"accounts":[]}';
  const parsed = JSON.parse(responseText) as { accounts?: ConvertedAccount[] };

  return (parsed.accounts || []).map((acc) => ({
    ...acc,
    adjustments: [],
  }));
}

/**
 * AI를 사용하여 조정 항목을 생성합니다.
 */
async function generateAdjustmentsWithAI(
  accounts: ConvertedAccount[],
  sourceStandard: AccountingStandard,
  targetStandard: AccountingStandard,
  details?: ConversionDetails
): Promise<AdjustmentItem[]> {
  const openai = getOpenAIClient();

  const prompt = `${sourceStandard}에서 ${targetStandard}로 회계기준을 변환할 때 필요한 조정 항목을 생성해주세요.

변환 대상 계정:
${JSON.stringify(accounts, null, 2)}

세부 정보:
${JSON.stringify(details, null, 2)}

다음 항목들을 고려하여 조정 항목을 생성해주세요:

1. ${
    targetStandard === "US-GAAP"
      ? "재평가잉여금 제거 (US-GAAP은 원가모형만 허용)"
      : ""
  }
2. 리스자산 및 리스부채 인식 (IFRS 16)
3. 개발비 자산화 조건 검토
4. 퇴직급여충당부채 보험수리적 재측정
5. 충당부채 인식
6. 수익인식 타이밍 차이
7. 전환사채의 부채-자본 분리

각 조정 항목은 다음 JSON 형식으로 반환해주세요:
{
  "adjustments": [
    {
      "reason": "조정 발생 원인",
      "beforeAmount": 조정 전 금액,
      "adjustmentName": "조정 항목명",
      "adjustmentAmount": 조정 금액,
      "afterAmount": 조정 후 금액,
      "note": "주석"
    }
  ]
}

조정이 필요한 경우에만 항목을 생성해주세요.
반드시 JSON 형식으로만 응답해주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: `당신은 ${sourceStandard}, IFRS, US-GAAP 간의 차이를 정확히 알고 있는 회계 전문가입니다. 회계기준 변환 시 필요한 조정 항목을 정확하게 식별할 수 있습니다.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const responseText =
    completion.choices[0].message.content || '{"adjustments":[]}';
  const parsed = JSON.parse(responseText);

  return parsed.adjustments || [];
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
      // 새로운 계정 생성
      const newAccount: ConvertedAccount = {
        accountCode: "",
        accountName: adjustment.adjustmentName,
        amount: adjustment.afterAmount,
        internalCode: "NEW",
        internalName: adjustment.adjustmentName,
        targetCode: "NEW",
        mappingType: "1:1",
        adjustments: [adjustment],
      };
      accountMap.set(adjustment.adjustmentName, newAccount);
    }
  }

  return Array.from(accountMap.values());
}

/**
 * AI를 사용하여 보고서 주석을 생성합니다.
 */
export async function generateReportNotes(
  result: ConversionResult,
  details?: ConversionDetails
): Promise<string> {
  const openai = getOpenAIClient();

  const prompt = `다음 회계기준 변환 결과에 대한 주석을 작성해주세요.

변환 요약:
- 원본 기준: ${result.summary.sourceStandard}
- 목표 기준: ${result.summary.targetStandard}
- 변환된 계정 수: ${result.summary.totalAccounts}
- 조정 항목 수: ${result.summary.totalAdjustments}

주요 조정 항목:
${JSON.stringify(result.adjustments.slice(0, 10), null, 2)}

세부 정보:
${JSON.stringify(details, null, 2)}

다음 내용을 포함한 전문적인 주석을 작성해주세요:
1. 적용된 회계정책 (재평가모형/원가모형 등)
2. 주요 조정 사항 설명
3. 보험수리적 가정의 변경 (해당시)
4. 리스 기준 적용 (해당시)
5. 수익인식 방법 (해당시)

한국어로 작성하고, 회계 보고서 형식을 따라주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content:
          "당신은 전문 회계사이며, 재무제표 주석을 작성하는 전문가입니다.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
  });

  return completion.choices[0].message.content || "";
}
