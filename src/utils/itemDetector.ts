import { ExtractedAccount } from "@/types/accounting";
import OpenAI from "openai";

/**
 * PDF/Excel에서 추출한 계정 데이터를 분석하여
 * 어떤 전환 항목이 필요한지 자동으로 감지합니다.
 */

export interface DetectedItem {
  id: string;
  confidence: number; // 0-1
  reason: string;
}

const getOpenAIClient = () => {
  const apiKey = import.meta.env.VITE_OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY가 설정되지 않았습니다.");
  }
  return new OpenAI({
    apiKey,
    dangerouslyAllowBrowser: true,
  });
};

/**
 * AI를 사용하여 필요한 전환 항목을 감지합니다.
 */
export async function detectConversionItems(
  accounts: ExtractedAccount[],
  extractedText?: string
): Promise<DetectedItem[]> {
  const openai = getOpenAIClient();

  const prompt = `다음 재무제표 데이터를 분석하여, 회계기준 전환 시 필요한 항목들을 식별해주세요.

계정 데이터:
${JSON.stringify(accounts.slice(0, 50), null, 2)}

${extractedText ? `원본 텍스트:\n${extractedText.slice(0, 2000)}` : ""}

다음 항목들 중에서 데이터에 해당하는 항목을 찾아주세요:

1. asset-valuation: 유형자산, 투자부동산, 재평가잉여금 등이 있는 경우
2. lease: 리스, 임차, 사용권자산 등이 있는 경우
3. financial-instruments: 사채, 전환사채, 금융자산, 금융부채 등이 있는 경우
4. revenue: 매출, 수익인식, 계약자산, 계약부채 등이 있는 경우
5. intangible: 개발비, 무형자산, 특허권, 소프트웨어 등이 있는 경우
6. retirement: 퇴직급여충당부채, 확정급여채무, 사외적립자산 등이 있는 경우
7. provisions: 충당부채, 우발부채, 소송충당부채 등이 있는 경우

각 항목에 대해 다음 JSON 형식으로 반환해주세요:
{
  "items": [
    {
      "id": "항목 ID",
      "confidence": 0.0-1.0 (확신도),
      "reason": "해당 항목이 필요한 이유"
    }
  ]
}

confidence가 0.5 이상인 항목만 반환해주세요.
반드시 JSON 형식으로만 응답해주세요.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content:
          "당신은 회계 전문가입니다. 재무제표를 분석하여 필요한 회계처리 항목을 정확히 식별할 수 있습니다.",
      },
      {
        role: "user",
        content: prompt,
      },
    ],
    temperature: 0.2,
    response_format: { type: "json_object" },
  });

  const responseText = completion.choices[0].message.content || '{"items":[]}';
  const parsed = JSON.parse(responseText);

  return parsed.items || [];
}

/**
 * 규칙 기반으로 빠르게 항목을 감지합니다 (AI 없이)
 */
export function detectItemsByRules(
  accounts: ExtractedAccount[]
): DetectedItem[] {
  const detected: DetectedItem[] = [];
  const accountNames = accounts.map((acc) => acc.accountName.toLowerCase());

  // 자산평가 감지
  const assetKeywords = [
    "유형자산",
    "투자부동산",
    "재평가",
    "건물",
    "토지",
    "기계장치",
  ];
  if (
    accountNames.some((name) => assetKeywords.some((kw) => name.includes(kw)))
  ) {
    detected.push({
      id: "asset-valuation",
      confidence: 0.8,
      reason: "유형자산 또는 투자부동산 계정이 발견되었습니다.",
    });
  }

  // 리스 감지
  const leaseKeywords = ["리스", "임차", "사용권자산", "리스부채"];
  if (
    accountNames.some((name) => leaseKeywords.some((kw) => name.includes(kw)))
  ) {
    detected.push({
      id: "lease",
      confidence: 0.9,
      reason: "리스 관련 계정이 발견되었습니다.",
    });
  }

  // 금융상품 감지
  const financialKeywords = [
    "사채",
    "전환사채",
    "금융자산",
    "금융부채",
    "채권",
    "파생상품",
  ];
  if (
    accountNames.some((name) =>
      financialKeywords.some((kw) => name.includes(kw))
    )
  ) {
    detected.push({
      id: "financial-instruments",
      confidence: 0.85,
      reason: "금융상품 계정이 발견되었습니다.",
    });
  }

  // 수익인식 감지
  const revenueKeywords = ["매출", "수익", "계약자산", "계약부채", "선수수익"];
  if (
    accountNames.some((name) => revenueKeywords.some((kw) => name.includes(kw)))
  ) {
    detected.push({
      id: "revenue",
      confidence: 0.7,
      reason: "수익 관련 계정이 발견되었습니다.",
    });
  }

  // 무형자산 감지
  const intangibleKeywords = [
    "개발비",
    "무형자산",
    "특허권",
    "소프트웨어",
    "영업권",
  ];
  if (
    accountNames.some((name) =>
      intangibleKeywords.some((kw) => name.includes(kw))
    )
  ) {
    detected.push({
      id: "intangible",
      confidence: 0.8,
      reason: "무형자산 계정이 발견되었습니다.",
    });
  }

  // 퇴직급여 감지
  const retirementKeywords = ["퇴직급여", "퇴직연금", "확정급여", "사외적립"];
  if (
    accountNames.some((name) =>
      retirementKeywords.some((kw) => name.includes(kw))
    )
  ) {
    detected.push({
      id: "retirement",
      confidence: 0.9,
      reason: "퇴직급여 관련 계정이 발견되었습니다.",
    });
  }

  // 충당부채 감지
  const provisionKeywords = ["충당부채", "우발부채", "소송", "제품보증"];
  if (
    accountNames.some((name) =>
      provisionKeywords.some((kw) => name.includes(kw))
    )
  ) {
    detected.push({
      id: "provisions",
      confidence: 0.85,
      reason: "충당부채 관련 계정이 발견되었습니다.",
    });
  }

  return detected;
}
