import { ExtractedAccount } from "@/types/accounting";
import * as pdfjsLib from "pdfjs-dist";

// PDF.js worker 설정 - 번들된 워커 파일 사용
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.mjs",
  import.meta.url
).toString();

/**
 * PDF 파일을 읽고 텍스트를 추출합니다.
 * @param file - 업로드된 PDF 파일
 * @param onProgress - 진행 상황 콜백 (0-100)
 * @returns 추출된 텍스트
 */
export async function parsePDFFile(
  file: File,
  onProgress?: (progress: number) => void
): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = "";
        const totalPages = pdf.numPages;

        // 모든 페이지에서 텍스트 추출
        for (let i = 1; i <= totalPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();

          // Y 좌표를 기준으로 줄바꿈 감지
          let lastY = -1;
          let pageText = "";

          for (const item of textContent.items) {
            if (!("str" in item)) continue;

            const currentY = item.transform[5]; // Y 좌표

            // Y 좌표가 변경되면 새로운 줄로 간주
            if (lastY !== -1 && Math.abs(currentY - lastY) > 5) {
              pageText += "\n";
            } else if (
              pageText &&
              !pageText.endsWith(" ") &&
              !item.str.startsWith(" ")
            ) {
              // 같은 줄에서는 공백으로 구분 (단, 이미 공백이 있으면 추가하지 않음)
              pageText += " ";
            }

            pageText += item.str;
            lastY = currentY;
          }

          fullText += pageText + "\n";

          // 진행률 업데이트
          if (onProgress) {
            const progress = Math.round((i / totalPages) * 100);
            onProgress(progress);
          }
        }

        resolve(fullText);
      } catch (error) {
        reject(new Error(`PDF 파일 파싱 중 오류 발생: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error("파일 읽기 실패"));
    };

    reader.readAsArrayBuffer(file);
  });
}

/**
 * PDF에서 추출한 텍스트를 구조화된 데이터로 변환합니다.
 * 이 함수는 기본적인 패턴 매칭을 수행하며,
 * OpenAI API를 사용한 고급 파싱은 aiConverter.ts에서 처리됩니다.
 */
export function extractAccountsFromPDFText(text: string): ExtractedAccount[] {
  const accounts: ExtractedAccount[] = [];
  const lines = text.split("\n").filter((line) => line.trim());

  for (const line of lines) {
    // 헤더나 제목 행 건너뛰기
    if (isHeaderRow(line)) {
      continue;
    }

    // 재무제표 형식 패턴 매칭
    // 예: "1. 현금및현금성자산(주3)   37,397,412,736   139,122,428,501"
    const patterns = [
      // 패턴 1: 항목번호(로마숫자/숫자/괄호). 계정명(괄호포함) 금액1 금액2
      /^([IVX]+|[(]\d+[)]|\d+)[.)]\s*([가-힣a-zA-Z0-9()]+(?:\s+[가-힣a-zA-Z0-9()]+)*)\s+([\d,]+)(?:\s+([\d,]+))?/,

      // 패턴 2: 계정코드(숫자) 계정명 금액1 금액2
      /^(\d{3,})\s+([가-힣a-zA-Z0-9()]+(?:\s+[가-힣a-zA-Z0-9()]+)*)\s+([\d,]+)(?:\s+([\d,]+))?/,

      // 패턴 3: 계정명 금액1 금액2 (항목번호 없음)
      /^([가-힣a-zA-Z0-9()]+(?:\s+[가-힣a-zA-Z0-9()]+)*)\s+([\d,]+)(?:\s+([\d,]+))?$/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        let accountCode = "";
        let accountName = "";
        let currentAmount = "";

        if (pattern === patterns[0]) {
          // 패턴 1: 항목번호, 계정명, 당기금액, 전기금액
          const [, , name, current] = match;
          accountName = name;
          currentAmount = current;
        } else if (pattern === patterns[1]) {
          // 패턴 2: 계정코드, 계정명, 당기금액, 전기금액
          const [, code, name, current] = match;
          accountCode = code;
          accountName = name;
          currentAmount = current;
        } else if (pattern === patterns[2]) {
          // 패턴 3: 계정명, 당기금액, 전기금액
          const [, name, current] = match;
          accountName = name;
          currentAmount = current;
        }

        accountName = cleanAccountName(accountName);

        // 소계/합계 행 또는 제목 행 제외
        if (isSubtotalRow(accountName) || !accountName) {
          continue;
        }

        // 당기 금액 처리 (주로 사용)
        const amount = parseFloat(currentAmount.replace(/,/g, ""));

        if (!isNaN(amount) && accountName) {
          accounts.push({
            accountCode,
            accountName,
            amount,
          });
          break; // 매칭되면 다음 라인으로
        }
      }
    }
  }

  return accounts;
}

/**
 * 계정명을 정리합니다 (괄호 주석 제거 등)
 */
function cleanAccountName(name: string): string {
  return (
    name
      .trim()
      // 앞에 오는 괄호 번호 제거 (예: "(2) 재고자산" -> "재고자산")
      .replace(/^\([IVX\d]+\)\s*/g, "")
      // 괄호 안의 주석 제거 (예: (주3), (주4))
      .replace(/\(주\d+\)/g, "")
      // 여러 공백을 하나로
      .replace(/\s+/g, " ")
      .trim()
  );
}

/**
 * 헤더나 제목 행인지 확인합니다.
 */
function isHeaderRow(line: string): boolean {
  const headerKeywords = [
    "재무상태표",
    "손익계산서",
    "현금흐름표",
    "과   목",
    "과목",
    "제 \\d+\\(당\\) 기",
    "제 \\d+\\(전\\) 기",
    "당기",
    "전기",
    "금액",
    "원",
    "balance sheet",
    "income statement",
    "cash flow",
  ];

  const trimmedLine = line.trim();

  // 너무 짧은 라인은 헤더일 가능성 높음
  if (trimmedLine.length < 3) {
    return true;
  }

  // 헤더 키워드 포함 확인
  for (const keyword of headerKeywords) {
    const regex = new RegExp(keyword, "i");
    if (regex.test(trimmedLine)) {
      return true;
    }
  }

  // 날짜 형식 (예: "2024년 12월 31일")
  if (/\d{4}년\s*\d{1,2}월\s*\d{1,2}일/.test(trimmedLine)) {
    return true;
  }

  // 회사명 패턴 (예: "주식회사 버킷플레이스")
  if (
    /^주식회사|^유한회사|^합자회사|Corporation|Inc\.|Ltd\./i.test(trimmedLine)
  ) {
    return true;
  }

  return false;
}

/**
 * 소계/합계 행인지 확인합니다.
 */
function isSubtotalRow(accountName: string): boolean {
  if (!accountName) {
    return false;
  }

  const subtotalKeywords = [
    "소계",
    "합계",
    "총계",
    "계",
    "subtotal",
    "total",
    "sum",
    "자산총계",
    "부채총계",
    "자본총계",
  ];

  const lowerName = accountName.toLowerCase();
  return subtotalKeywords.some((keyword) => lowerName.includes(keyword));
}

/**
 * PDF 데이터를 검증합니다.
 */
export function validatePDFData(accounts: ExtractedAccount[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (accounts.length === 0) {
    errors.push("PDF에서 계정 데이터를 추출할 수 없습니다.");
  }

  // 계정명이 없는 항목 체크
  const emptyNames = accounts.filter((acc) => !acc.accountName);
  if (emptyNames.length > 0) {
    errors.push(`계정명이 없는 항목이 ${emptyNames.length}개 있습니다.`);
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
}
