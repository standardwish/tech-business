import * as pdfjsLib from 'pdfjs-dist';
import { ExtractedAccount } from '@/types/accounting';

// PDF.js worker 설정 - 번들된 워커 파일 사용
pdfjsLib.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url
).toString();

/**
 * PDF 파일을 읽고 텍스트를 추출합니다.
 * @param file - 업로드된 PDF 파일
 * @returns 추출된 텍스트
 */
export async function parsePDFFile(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = async (e) => {
      try {
        const arrayBuffer = e.target?.result as ArrayBuffer;
        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;

        let fullText = '';

        // 모든 페이지에서 텍스트 추출
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item) => ('str' in item ? item.str : ''))
            .join(' ');
          fullText += pageText + '\n';
        }

        resolve(fullText);
      } catch (error) {
        reject(new Error(`PDF 파일 파싱 중 오류 발생: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
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
  const lines = text.split('\n').filter(line => line.trim());

  for (const line of lines) {
    // 기본적인 패턴 매칭
    // 예: "현금및현금성자산 1,000,000" 또는 "101 현금및현금성자산 1,000,000"
    const patterns = [
      // 패턴 1: 계정코드 계정명 금액
      /(\d+)\s+([가-힣a-zA-Z\s]+)\s+([\d,]+)/,
      // 패턴 2: 계정명 금액
      /([가-힣a-zA-Z\s]+)\s+([\d,]+)/,
    ];

    for (const pattern of patterns) {
      const match = line.match(pattern);
      if (match) {
        let accountCode = '';
        let accountName = '';
        let amountStr = '';

        if (match.length === 4) {
          // 패턴 1: 코드, 이름, 금액
          [, accountCode, accountName, amountStr] = match;
        } else if (match.length === 3) {
          // 패턴 2: 이름, 금액
          [, accountName, amountStr] = match;
        }

        accountName = accountName.trim();

        // 소계/합계 행 제외
        if (isSubtotalRow(accountName)) {
          continue;
        }

        const amount = parseFloat(amountStr.replace(/,/g, ''));

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
 * 소계/합계 행인지 확인합니다.
 */
function isSubtotalRow(accountName: string): boolean {
  const subtotalKeywords = [
    '소계', '합계', '총계', '계',
    'subtotal', 'total', 'sum',
    '자산총계', '부채총계', '자본총계'
  ];

  const lowerName = accountName.toLowerCase();
  return subtotalKeywords.some(keyword => lowerName.includes(keyword));
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
    errors.push('PDF에서 계정 데이터를 추출할 수 없습니다.');
  }

  // 계정명이 없는 항목 체크
  const emptyNames = accounts.filter(acc => !acc.accountName);
  if (emptyNames.length > 0) {
    errors.push(`계정명이 없는 항목이 ${emptyNames.length}개 있습니다.`);
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}
