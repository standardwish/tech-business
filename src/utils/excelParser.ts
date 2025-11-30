import * as XLSX from 'xlsx';
import { ExtractedAccount } from '@/types/accounting';

/**
 * 엑셀 파일을 읽고 계정 데이터를 추출합니다.
 * @param file - 업로드된 엑셀 파일
 * @returns 추출된 계정 항목 배열
 */
export async function parseExcelFile(file: File): Promise<ExtractedAccount[]> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const data = e.target?.result;
        const workbook = XLSX.read(data, { type: 'binary' });

        // 첫 번째 시트 읽기
        const firstSheetName = workbook.SheetNames[0];
        const worksheet = workbook.Sheets[firstSheetName];

        // JSON으로 변환
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }) as unknown[][];

        // 계정 데이터 추출
        const accounts = extractAccountsFromSheet(jsonData);
        resolve(accounts);
      } catch (error) {
        reject(new Error(`엑셀 파일 파싱 중 오류 발생: ${error}`));
      }
    };

    reader.onerror = () => {
      reject(new Error('파일 읽기 실패'));
    };

    reader.readAsBinaryString(file);
  });
}

/**
 * 엑셀 시트 데이터에서 계정 정보를 추출합니다.
 * 여러 가지 엑셀 형식을 지원합니다.
 */
function extractAccountsFromSheet(data: unknown[][]): ExtractedAccount[] {
  if (data.length === 0) {
    return [];
  }

  // 헤더 행 찾기
  const headerRowIndex = findHeaderRow(data);
  if (headerRowIndex === -1) {
    throw new Error('계정과목 헤더를 찾을 수 없습니다.');
  }

  const headers = (data[headerRowIndex] as string[]).map(h =>
    String(h || '').trim().toLowerCase()
  );

  // 컬럼 인덱스 찾기
  const codeIndex = findColumnIndex(headers, ['계정코드', '코드', 'code', 'account code']);
  const nameIndex = findColumnIndex(headers, ['계정과목', '계정명', 'account', 'account name', '과목']);
  const amountIndex = findColumnIndex(headers, ['금액', 'amount', '잔액', 'balance']);
  const debitIndex = findColumnIndex(headers, ['차변', 'debit', 'dr']);
  const creditIndex = findColumnIndex(headers, ['대변', 'credit', 'cr']);

  if (nameIndex === -1) {
    throw new Error('계정과목 컬럼을 찾을 수 없습니다.');
  }

  const accounts: ExtractedAccount[] = [];

  // 데이터 행 처리
  for (let i = headerRowIndex + 1; i < data.length; i++) {
    const row = data[i];
    if (!row || row.length === 0) continue;

    const accountName = String(row[nameIndex] || '').trim();
    if (!accountName || accountName === '') continue;

    // 소계, 합계 등 제외
    if (isSubtotalRow(accountName)) continue;

    const account: ExtractedAccount = {
      accountCode: codeIndex !== -1 ? String(row[codeIndex] || '').trim() : '',
      accountName,
      amount: 0,
    };

    // 금액 추출
    if (amountIndex !== -1) {
      account.amount = parseAmount(row[amountIndex]);
    } else {
      // 차변/대변이 있는 경우
      if (debitIndex !== -1 && creditIndex !== -1) {
        account.debit = parseAmount(row[debitIndex]);
        account.credit = parseAmount(row[creditIndex]);
        account.amount = account.debit - account.credit;
      }
    }

    accounts.push(account);
  }

  return accounts;
}

/**
 * 헤더 행을 찾습니다.
 */
function findHeaderRow(data: unknown[][]): number {
  const headerKeywords = ['계정', 'account', '과목', '코드', 'code'];

  for (let i = 0; i < Math.min(10, data.length); i++) {
    const row = data[i];
    if (!row) continue;

    const rowStr = row.map(cell => String(cell || '').toLowerCase()).join(' ');
    const matchCount = headerKeywords.filter(keyword => rowStr.includes(keyword)).length;

    if (matchCount >= 2) {
      return i;
    }
  }

  return -1;
}

/**
 * 특정 컬럼의 인덱스를 찾습니다.
 */
function findColumnIndex(headers: string[], keywords: string[]): number {
  for (let i = 0; i < headers.length; i++) {
    const header = headers[i];
    for (const keyword of keywords) {
      if (header.includes(keyword) || keyword.includes(header)) {
        return i;
      }
    }
  }
  return -1;
}

/**
 * 금액을 파싱합니다.
 */
function parseAmount(value: unknown): number {
  if (value === null || value === undefined || value === '') {
    return 0;
  }

  if (typeof value === 'number') {
    return value;
  }

  const strValue = String(value);
  // 쉼표, 괄호 등 제거
  const cleaned = strValue.replace(/[,()]/g, '').trim();

  // 음수 처리 (괄호로 표시된 경우)
  const isNegative = strValue.includes('(') && strValue.includes(')');

  const num = parseFloat(cleaned);
  return isNaN(num) ? 0 : (isNegative ? -Math.abs(num) : num);
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
 * 엑셀 데이터를 검증합니다.
 */
export function validateExcelData(accounts: ExtractedAccount[]): {
  isValid: boolean;
  errors: string[];
} {
  const errors: string[] = [];

  if (accounts.length === 0) {
    errors.push('계정 데이터가 없습니다.');
  }

  // 계정명이 없는 항목 체크
  const emptyNames = accounts.filter(acc => !acc.accountName);
  if (emptyNames.length > 0) {
    errors.push(`계정명이 없는 항목이 ${emptyNames.length}개 있습니다.`);
  }

  // 금액이 모두 0인지 체크
  const hasNonZeroAmount = accounts.some(acc =>
    acc.amount !== 0 || (acc.debit && acc.debit !== 0) || (acc.credit && acc.credit !== 0)
  );

  if (!hasNonZeroAmount) {
    errors.push('모든 계정의 금액이 0입니다. 데이터를 확인해주세요.');
  }

  return {
    isValid: errors.length === 0,
    errors
  };
}

/**
 * 엑셀 파일의 미리보기 데이터를 생성합니다.
 */
export function generatePreview(accounts: ExtractedAccount[], limit: number = 10): ExtractedAccount[] {
  return accounts.slice(0, limit);
}
