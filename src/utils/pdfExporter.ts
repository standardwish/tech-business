import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { ConversionResult } from '@/types/accounting';

// jsPDF에 autoTable 플러그인 타입 확장
declare module 'jspdf' {
  interface jsPDF {
    autoTable: typeof autoTable;
    lastAutoTable?: {
      finalY: number;
    };
  }
}

/**
 * 한글 폰트 설정을 위한 헬퍼
 * 실제 프로덕션에서는 한글 폰트 파일을 추가해야 합니다
 */
function setupKoreanFont(doc: jsPDF) {
  // 기본 폰트 사용 (한글 지원 제한적)
  // 프로덕션에서는 Nanum Gothic 등 한글 폰트를 base64로 임베드
  doc.setFont('helvetica');
}

/**
 * IFRS 형식 손익계산서 PDF 생성
 */
export function generateIFRSIncomeStatement(
  result: ConversionResult,
  companyName: string = '회사명',
  baseDate: string
): jsPDF {
  const doc = new jsPDF();
  setupKoreanFont(doc);

  // 제목
  doc.setFontSize(16);
  doc.text('Statement of Comprehensive Income (IFRS)', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(companyName, 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`For the year ended ${baseDate}`, 105, 37, { align: 'center' });
  doc.text('(Unit: KRW)', 105, 44, { align: 'center' });

  // 손익계산서 계정 필터링
  const incomeAccounts = result.accounts.filter(acc =>
    isIncomeStatementAccount(acc.internalCode)
  );

  // 테이블 데이터 준비
  const tableData = incomeAccounts.map(acc => [
    acc.targetCode,
    acc.internalName,
    formatNumber(acc.amount),
  ]);

  // 테이블 생성
  autoTable(doc, {
    startY: 50,
    head: [['Account Code', 'Account Name', 'Amount']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 100 },
      2: { cellWidth: 40, halign: 'right' },
    },
  });

  return doc;
}

/**
 * IFRS 형식 재무상태표 (대차대조표) PDF 생성
 */
export function generateIFRSBalanceSheet(
  result: ConversionResult,
  companyName: string = '회사명',
  baseDate: string
): jsPDF {
  const doc = new jsPDF();
  setupKoreanFont(doc);

  // 제목
  doc.setFontSize(16);
  doc.text('Statement of Financial Position (IFRS)', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(companyName, 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`As of ${baseDate}`, 105, 37, { align: 'center' });
  doc.text('(Unit: KRW)', 105, 44, { align: 'center' });

  // 재무상태표 계정 필터링
  const balanceSheetAccounts = result.accounts.filter(acc =>
    isBalanceSheetAccount(acc.internalCode)
  );

  // 자산, 부채, 자본 분류
  const assets = balanceSheetAccounts.filter(acc => isAsset(acc.internalCode));
  const liabilities = balanceSheetAccounts.filter(acc => isLiability(acc.internalCode));
  const equity = balanceSheetAccounts.filter(acc => isEquity(acc.internalCode));

  let currentY = 50;

  // 자산 섹션
  doc.setFontSize(12);
  doc.text('ASSETS', 14, currentY);
  currentY += 7;

  const assetData = assets.map(acc => [
    acc.targetCode,
    acc.internalName,
    formatNumber(acc.amount),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Code', 'Account Name', 'Amount']],
    body: assetData,
    theme: 'plain',
    headStyles: { fillColor: [52, 152, 219], textColor: 255, fontSize: 9 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 90 },
      2: { cellWidth: 40, halign: 'right' },
    },
  });

  currentY = (doc.lastAutoTable?.finalY || currentY) + 10;

  // 부채 섹션
  doc.setFontSize(12);
  doc.text('LIABILITIES', 14, currentY);
  currentY += 7;

  const liabilityData = liabilities.map(acc => [
    acc.targetCode,
    acc.internalName,
    formatNumber(acc.amount),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Code', 'Account Name', 'Amount']],
    body: liabilityData,
    theme: 'plain',
    headStyles: { fillColor: [231, 76, 60], textColor: 255, fontSize: 9 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 90 },
      2: { cellWidth: 40, halign: 'right' },
    },
  });

  currentY = (doc.lastAutoTable?.finalY || currentY) + 10;

  // 자본 섹션
  doc.setFontSize(12);
  doc.text('EQUITY', 14, currentY);
  currentY += 7;

  const equityData = equity.map(acc => [
    acc.targetCode,
    acc.internalName,
    formatNumber(acc.amount),
  ]);

  autoTable(doc, {
    startY: currentY,
    head: [['Code', 'Account Name', 'Amount']],
    body: equityData,
    theme: 'plain',
    headStyles: { fillColor: [46, 204, 113], textColor: 255, fontSize: 9 },
    styles: { fontSize: 8, cellPadding: 2 },
    columnStyles: {
      0: { cellWidth: 25 },
      1: { cellWidth: 90 },
      2: { cellWidth: 40, halign: 'right' },
    },
  });

  return doc;
}

/**
 * US-GAAP 형식 손익계산서 PDF 생성
 */
export function generateUSGAAPIncomeStatement(
  result: ConversionResult,
  companyName: string = '회사명',
  baseDate: string
): jsPDF {
  const doc = new jsPDF();
  setupKoreanFont(doc);

  // 제목
  doc.setFontSize(16);
  doc.text('Income Statement (US-GAAP)', 105, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(companyName, 105, 30, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`For the year ended ${baseDate}`, 105, 37, { align: 'center' });
  doc.text('(Currency: USD)', 105, 44, { align: 'center' });

  const incomeAccounts = result.accounts.filter(acc =>
    isIncomeStatementAccount(acc.internalCode)
  );

  const tableData = incomeAccounts.map(acc => [
    acc.targetCode,
    acc.internalName,
    formatNumber(acc.amount),
  ]);

  autoTable(doc, {
    startY: 50,
    head: [['Account Code', 'Description', 'Amount']],
    body: tableData,
    theme: 'grid',
    headStyles: { fillColor: [44, 62, 80], textColor: 255 },
    styles: { fontSize: 9, cellPadding: 3 },
    columnStyles: {
      0: { cellWidth: 30 },
      1: { cellWidth: 100 },
      2: { cellWidth: 40, halign: 'right' },
    },
  });

  return doc;
}

/**
 * 사업계획 워크북 PDF 생성
 */
export function generateBusinessPlanWorkbook(
  result: ConversionResult,
  companyName: string = '회사명',
  baseDate: string,
  projectionYears: number = 3
): jsPDF {
  const doc = new jsPDF('landscape');
  setupKoreanFont(doc);

  // 제목
  doc.setFontSize(16);
  doc.text('Business Plan Workbook', 148, 20, { align: 'center' });
  doc.setFontSize(12);
  doc.text(companyName, 148, 28, { align: 'center' });
  doc.setFontSize(10);
  doc.text(`${projectionYears}-Year Financial Projection`, 148, 35, { align: 'center' });

  // 수익 예측 섹션
  const revenues = result.accounts.filter(acc =>
    acc.internalName.includes('매출') || acc.internalName.includes('수익')
  );

  const headers = ['Account', baseDate, ...Array.from(
    { length: projectionYears },
    (_, i) => `Year ${i + 1}`
  )];

  const revenueData = revenues.map(acc => {
    const projections = Array.from({ length: projectionYears }, (_, i) =>
      formatNumber(acc.amount * (1 + 0.1 * (i + 1))) // 10% 성장 가정
    );
    return [acc.internalName, formatNumber(acc.amount), ...projections];
  });

  autoTable(doc, {
    startY: 45,
    head: [headers],
    body: revenueData,
    theme: 'striped',
    headStyles: { fillColor: [41, 128, 185], textColor: 255 },
    styles: { fontSize: 8, cellPadding: 2 },
  });

  return doc;
}

/**
 * 통합 내보내기 함수
 */
export function exportFinancialStatement(
  result: ConversionResult,
  format: 'ifrs-income' | 'ifrs-balance' | 'usgaap-income' | 'business-plan',
  companyName: string = '회사명',
  baseDate: string
): void {
  let doc: jsPDF;
  let filename: string;

  switch (format) {
    case 'ifrs-income':
      doc = generateIFRSIncomeStatement(result, companyName, baseDate);
      filename = `IFRS_Income_Statement_${baseDate}.pdf`;
      break;
    case 'ifrs-balance':
      doc = generateIFRSBalanceSheet(result, companyName, baseDate);
      filename = `IFRS_Balance_Sheet_${baseDate}.pdf`;
      break;
    case 'usgaap-income':
      doc = generateUSGAAPIncomeStatement(result, companyName, baseDate);
      filename = `USGAAP_Income_Statement_${baseDate}.pdf`;
      break;
    case 'business-plan':
      doc = generateBusinessPlanWorkbook(result, companyName, baseDate);
      filename = `Business_Plan_${baseDate}.pdf`;
      break;
    default:
      throw new Error('Invalid format');
  }

  doc.save(filename);
}

/**
 * 헬퍼 함수들
 */
function formatNumber(num: number): string {
  return num.toLocaleString('en-US', {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  });
}

function isIncomeStatementAccount(code: string): boolean {
  // 4000-5999: 수익 및 비용 계정
  const numCode = parseInt(code);
  return numCode >= 4000 && numCode < 6000;
}

function isBalanceSheetAccount(code: string): boolean {
  // 1000-3999: 자산, 부채, 자본 계정
  const numCode = parseInt(code);
  return numCode >= 1000 && numCode < 4000;
}

function isAsset(code: string): boolean {
  // 1000-1999: 자산
  const numCode = parseInt(code);
  return numCode >= 1000 && numCode < 2000;
}

function isLiability(code: string): boolean {
  // 2000-2999: 부채
  const numCode = parseInt(code);
  return numCode >= 2000 && numCode < 3000;
}

function isEquity(code: string): boolean {
  // 3000-3999: 자본
  const numCode = parseInt(code);
  return numCode >= 3000 && numCode < 4000;
}
