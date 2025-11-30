import OpenAI from "openai";
import { AccountingStandard, ExtractedAccount } from "@/types/accounting";

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
    dangerouslyAllowBrowser: true,
  });
};

export interface AnalysisResult {
  detectedItems: {
    category: string;
    items: string[];
    description: string;
  }[];
  suggestedItems: {
    category: string;
    items: string[];
    description: string;
    reason: string;
  }[];
  summary: {
    totalAccounts: number;
    hasRevaluation: boolean;
    hasLease: boolean;
    hasDevelopmentCosts: boolean;
    hasRetirementBenefits: boolean;
  };
}

/**
 * AI를 사용하여 추출된 계정 정보를 분석합니다.
 */
export async function analyzeAccountsWithAI(
  accounts: ExtractedAccount[],
  sourceStandard: AccountingStandard,
  targetStandard: AccountingStandard
): Promise<AnalysisResult> {
  const openai = getOpenAIClient();

  const prompt = `다음은 ${sourceStandard}에서 ${targetStandard}로 변환하려는 재무제표의 계정과목 목록입니다.

계정과목 목록:
${JSON.stringify(accounts, null, 2)}

다음 분석을 수행해주세요:

1. **감지된 항목 (detectedItems)**: 현재 재무제표에서 발견된 주요 항목들을 카테고리별로 분류
   - category: 항목 카테고리 (예: "유형자산", "무형자산", "리스", "충당부채" 등)
   - items: 해당 카테고리의 구체적인 계정과목명들
   - description: 해당 항목들에 대한 간단한 설명

2. **추가 가능한 항목 (suggestedItems)**: ${sourceStandard}에서 ${targetStandard}로 변환 시 추가로 고려해야 할 항목들
   - category: 항목 카테고리
   - items: 추가해야 할 항목명들
   - description: 항목 설명
   - reason: 왜 이 항목을 추가해야 하는지 이유

3. **요약 정보 (summary)**:
   - totalAccounts: 전체 계정 수
   - hasRevaluation: 재평가 관련 항목이 있는지
   - hasLease: 리스 관련 항목이 있는지
   - hasDevelopmentCosts: 개발비 관련 항목이 있는지
   - hasRetirementBenefits: 퇴직급여 관련 항목이 있는지

다음 JSON 형식으로 반환해주세요:
{
  "detectedItems": [
    {
      "category": "카테고리명",
      "items": ["항목1", "항목2"],
      "description": "설명"
    }
  ],
  "suggestedItems": [
    {
      "category": "카테고리명",
      "items": ["추가 항목1", "추가 항목2"],
      "description": "설명",
      "reason": "추가 이유"
    }
  ],
  "summary": {
    "totalAccounts": 숫자,
    "hasRevaluation": boolean,
    "hasLease": boolean,
    "hasDevelopmentCosts": boolean,
    "hasRetirementBenefits": boolean
  }
}

${targetStandard === "US-GAAP" ? "US-GAAP은 재평가모형을 허용하지 않으므로 재평가 관련 항목이 있다면 반드시 suggestedItems에 '재평가잉여금 제거'를 포함해주세요." : ""}
${targetStandard === "IFRS" || targetStandard === "US-GAAP" ? "IFRS 16 리스 기준을 고려하여 사용권자산과 리스부채가 필요한지 확인해주세요." : ""}

반드시 JSON 형식으로만 응답해주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-4o",
    messages: [
      {
        role: "system",
        content: `당신은 ${sourceStandard}, IFRS, US-GAAP에 정통한 회계 전문가입니다. 재무제표를 분석하고 회계기준 변환 시 필요한 항목들을 정확하게 식별할 수 있습니다.`,
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0].message.content || "{}";
  const result = JSON.parse(responseText) as AnalysisResult;

  return result;
}
