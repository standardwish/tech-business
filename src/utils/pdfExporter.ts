import { ConversionResult, ConvertedAccount } from "@/types/accounting";
import jsPDF from "jspdf";
import autoTable, { RowInput } from "jspdf-autotable";

// --- 스타일 상수 (Vertex42 PDF 스타일 참조) ---
const COLORS = {
  HEADER_BG: [44, 62, 80] as [number, number, number], // 짙은 남색 (메인 헤더)
  SUB_HEADER_BG: [240, 240, 240] as [number, number, number], // 연한 회색 (섹션 구분)
  HIGHLIGHT_BG: [230, 240, 255] as [number, number, number], // 강조 (최종 합계)
  TEXT_MAIN: [0, 0, 0] as [number, number, number],
  TEXT_WHITE: [255, 255, 255] as [number, number, number],
};

// --- 헬퍼 함수 ---

const formatCurrency = (num: number | undefined) => {
  if (num === undefined || num === 0) return "-";
  return Math.floor(num).toLocaleString();
};

/**
 * jsPDF에 한글 폰트를 적용하기 위한 헬퍼
 * 주의: 실제 프로덕션에서는 .ttf 파일을 base64로 변환하여 addFileToVFS에 주입해야 합니다.
 */
function setupKoreanFont(doc: jsPDF) {
  // 1. 여기에 폰트 Base64 문자열이 필요합니다. (용량 문제로 코드는 생략)
  // 2. doc.addFileToVFS('Malgun.ttf', myFontBase64);
  // 3. doc.addFont('Malgun.ttf', 'Malgun', 'normal');
  // 4. doc.setFont('Malgun');

  // 현재는 기본 폰트(영문)로 설정되어 있으며, 한글은 깨질 수 있습니다.
  doc.setFont("helvetica");
}

/**
 * 계정 코드 기반 필터링 헬퍼 (IFRS 코드 체계 가정)
 * 실제 프로젝트의 코드 체계에 맞춰 수정이 필요할 수 있습니다.
 */
const AccountFilters = {
  // 손익계산서 (4: 수익, 5: 비용 - 그 중 5000번대: 매출원가, 6000~8000: 판관비 가정)
  Revenue: (code: string) => code.startsWith("4"),
  CostOfGoodsSold: (code: string) => code.startsWith("50"),
  OperatingExpenses: (code: string) =>
    !code.startsWith("50") &&
    (code.startsWith("5") ||
      code.startsWith("6") ||
      code.startsWith("7") ||
      code.startsWith("8")),

  // 재무상태표 (1: 자산, 2: 부채, 3: 자본)
  CurrentAssets: (code: string) =>
    code.startsWith("11") || code.startsWith("10"), // 10xx, 11xx 유동
  NonCurrentAssets: (code: string) => code.startsWith("12"), // 12xx 비유동
  CurrentLiabilities: (code: string) => code.startsWith("21"), // 21xx 유동
  NonCurrentLiabilities: (code: string) =>
    code.startsWith("22") || code.startsWith("23"), // 22xx 비유동
  Equity: (code: string) => code.startsWith("3"),
};

/**
 * 계정 그룹의 합계 계산
 */
const sumAccounts = (accounts: ConvertedAccount[]) => {
  return accounts.reduce((sum, acc) => sum + acc.amount, 0);
};

// --- PDF 생성 메인 로직 ---

/**
 * 공통 헤더 그리기
 */
const drawHeader = (
  doc: jsPDF,
  title: string,
  companyName: string,
  baseDate: string,
  unit: string = "KRW"
) => {
  doc.setTextColor(
    COLORS.HEADER_BG[0],
    COLORS.HEADER_BG[1],
    COLORS.HEADER_BG[2]
  );
  doc.setFontSize(22);
  doc.text(companyName, 14, 20);

  doc.setFontSize(16);
  doc.text(title, 14, 30);

  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`For the year ended ${baseDate}`, 14, 38);
  doc.text(`(Unit: ${unit})`, 195, 38, { align: "right" });
};

/**
 * IFRS 손익계산서 PDF 생성
 */
export function generateIFRSIncomeStatement(
  result: ConversionResult,
  companyName: string,
  baseDate: string
): jsPDF {
  const doc = new jsPDF();
  setupKoreanFont(doc);
  drawHeader(doc, "Statement of Comprehensive Income", companyName, baseDate);

  // 1. 데이터 분류
  const revenues = result.accounts.filter((acc) =>
    AccountFilters.Revenue(acc.targetCode)
  );
  const cogs = result.accounts.filter((acc) =>
    AccountFilters.CostOfGoodsSold(acc.targetCode)
  );
  const expenses = result.accounts.filter((acc) =>
    AccountFilters.OperatingExpenses(acc.targetCode)
  );

  // 2. 합계 계산
  const totalRevenue = sumAccounts(revenues);
  const totalCogs = sumAccounts(cogs);
  const grossProfit = totalRevenue - totalCogs; // 매출총이익
  const totalExpenses = sumAccounts(expenses);
  const netIncome = grossProfit - totalExpenses; // 당기순이익

  // 3. 테이블 데이터 구성 (Vertex42 스타일: 섹션 헤더 -> 항목 -> 합계 라인)
  const tableBody = [
    // Revenue Section
    [
      {
        content: "Revenue",
        colSpan: 3,
        styles: {
          fillColor: COLORS.SUB_HEADER_BG,
          fontStyle: "bold",
          textColor: COLORS.TEXT_MAIN,
        },
      },
    ],
    ...revenues.map((acc) => [acc.accountName, formatCurrency(acc.amount), ""]),
    [
      { content: "Total Revenue", styles: { fontStyle: "bold" } },
      { content: formatCurrency(totalRevenue), styles: { fontStyle: "bold" } },
      "",
    ],

    // COGS Section
    [
      {
        content: "Cost of Goods Sold",
        colSpan: 3,
        styles: {
          fillColor: COLORS.SUB_HEADER_BG,
          fontStyle: "bold",
          textColor: COLORS.TEXT_MAIN,
        },
      },
    ],
    ...cogs.map((acc) => [acc.accountName, formatCurrency(acc.amount), ""]),
    [
      { content: "Total Cost of Goods Sold", styles: { fontStyle: "bold" } },
      { content: formatCurrency(totalCogs), styles: { fontStyle: "bold" } },
      "",
    ],

    // Gross Profit Line (강조)
    [
      {
        content: "Gross Profit",
        styles: { fontStyle: "bold", fillColor: [240, 245, 250] },
      },
      {
        content: formatCurrency(grossProfit),
        styles: { fontStyle: "bold", fillColor: [240, 245, 250] },
      },
      "",
    ],

    // Expenses Section
    [
      {
        content: "Operating Expenses",
        colSpan: 3,
        styles: {
          fillColor: COLORS.SUB_HEADER_BG,
          fontStyle: "bold",
          textColor: COLORS.TEXT_MAIN,
        },
      },
    ],
    ...expenses.map((acc) => [acc.accountName, formatCurrency(acc.amount), ""]),
    [
      { content: "Total Expenses", styles: { fontStyle: "bold" } },
      { content: formatCurrency(totalExpenses), styles: { fontStyle: "bold" } },
      "",
    ],

    // Net Income (최종 강조)
    [
      {
        content: "Net Income",
        styles: {
          fontStyle: "bold",
          fillColor: COLORS.HIGHLIGHT_BG,
          fontSize: 11,
        },
      },
      {
        content: formatCurrency(netIncome),
        styles: {
          fontStyle: "bold",
          fillColor: COLORS.HIGHLIGHT_BG,
          fontSize: 11,
        },
      },
      "",
    ],
  ];

  autoTable(doc, {
    startY: 45,
    head: [["Description", "Current Year", "Note"]],
    body: tableBody as RowInput[],
    theme: "grid",
    headStyles: {
      fillColor: COLORS.HEADER_BG,
      textColor: COLORS.TEXT_WHITE,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 10,
      cellPadding: 5,
      lineColor: [200, 200, 200],
      lineWidth: 0.1,
    },
    columnStyles: {
      0: { cellWidth: "auto" }, // Description
      1: { cellWidth: 40, halign: "right" }, // Amount
      2: { cellWidth: 30, halign: "center" }, // Note
    },
  });

  return doc;
}

/**
 * IFRS 재무상태표 PDF 생성
 */
export function generateIFRSBalanceSheet(
  result: ConversionResult,
  companyName: string,
  baseDate: string
): jsPDF {
  const doc = new jsPDF();
  setupKoreanFont(doc);
  drawHeader(doc, "Statement of Financial Position", companyName, baseDate);

  // 1. 데이터 분류
  const currentAssets = result.accounts.filter((acc) =>
    AccountFilters.CurrentAssets(acc.targetCode)
  );
  const nonCurrentAssets = result.accounts.filter((acc) =>
    AccountFilters.NonCurrentAssets(acc.targetCode)
  );
  const currentLiabilities = result.accounts.filter((acc) =>
    AccountFilters.CurrentLiabilities(acc.targetCode)
  );
  const nonCurrentLiabilities = result.accounts.filter((acc) =>
    AccountFilters.NonCurrentLiabilities(acc.targetCode)
  );
  const equity = result.accounts.filter((acc) =>
    AccountFilters.Equity(acc.targetCode)
  );

  // 2. 합계 계산
  const totalCurrentAssets = sumAccounts(currentAssets);
  const totalNonCurrentAssets = sumAccounts(nonCurrentAssets);
  const totalAssets = totalCurrentAssets + totalNonCurrentAssets;

  const totalCurrentLiabilities = sumAccounts(currentLiabilities);
  const totalNonCurrentLiabilities = sumAccounts(nonCurrentLiabilities);
  const totalLiabilities = totalCurrentLiabilities + totalNonCurrentLiabilities;

  const totalEquity = sumAccounts(equity);

  // 3. 테이블 데이터 구성
  const tableBody = [
    // --- ASSETS ---
    [
      {
        content: "ASSETS",
        colSpan: 3,
        styles: {
          fillColor: COLORS.HEADER_BG,
          textColor: COLORS.TEXT_WHITE,
          fontStyle: "bold",
          halign: "center",
        },
      },
    ],

    // Current Assets
    [
      {
        content: "Current Assets",
        colSpan: 3,
        styles: { fillColor: COLORS.SUB_HEADER_BG, fontStyle: "bold" },
      },
    ],
    ...currentAssets.map((acc) => [
      acc.accountName,
      formatCurrency(acc.amount),
      "",
    ]),
    [
      {
        content: "Total Current Assets",
        styles: { fontStyle: "bold", fillColor: [250, 250, 250] },
      },
      {
        content: formatCurrency(totalCurrentAssets),
        styles: { fontStyle: "bold", fillColor: [250, 250, 250] },
      },
      "",
    ],

    // Non-Current Assets
    [
      {
        content: "Non-Current Assets",
        colSpan: 3,
        styles: { fillColor: COLORS.SUB_HEADER_BG, fontStyle: "bold" },
      },
    ],
    ...nonCurrentAssets.map((acc) => [
      acc.accountName,
      formatCurrency(acc.amount),
      "",
    ]),
    [
      {
        content: "Total Non-Current Assets",
        styles: { fontStyle: "bold", fillColor: [250, 250, 250] },
      },
      {
        content: formatCurrency(totalNonCurrentAssets),
        styles: { fontStyle: "bold", fillColor: [250, 250, 250] },
      },
      "",
    ],

    // Total Assets
    [
      {
        content: "Total Assets",
        styles: { fontStyle: "bold", fillColor: COLORS.HIGHLIGHT_BG },
      },
      {
        content: formatCurrency(totalAssets),
        styles: { fontStyle: "bold", fillColor: COLORS.HIGHLIGHT_BG },
      },
      "",
    ],

    // Spacing Row
    [
      {
        content: "",
        colSpan: 3,
        styles: { minCellHeight: 5, fillColor: [255, 255, 255], lineWidth: 0 },
      },
    ],

    // --- LIABILITIES & EQUITY ---
    [
      {
        content: "LIABILITIES & EQUITY",
        colSpan: 3,
        styles: {
          fillColor: COLORS.HEADER_BG,
          textColor: COLORS.TEXT_WHITE,
          fontStyle: "bold",
          halign: "center",
        },
      },
    ],

    // Liabilities
    [
      {
        content: "Current Liabilities",
        colSpan: 3,
        styles: { fillColor: COLORS.SUB_HEADER_BG, fontStyle: "bold" },
      },
    ],
    ...currentLiabilities.map((acc) => [
      acc.accountName,
      formatCurrency(acc.amount),
      "",
    ]),
    [
      { content: "Total Current Liabilities", styles: { fontStyle: "bold" } },
      {
        content: formatCurrency(totalCurrentLiabilities),
        styles: { fontStyle: "bold" },
      },
      "",
    ],

    [
      {
        content: "Non-Current Liabilities",
        colSpan: 3,
        styles: { fillColor: COLORS.SUB_HEADER_BG, fontStyle: "bold" },
      },
    ],
    ...nonCurrentLiabilities.map((acc) => [
      acc.accountName,
      formatCurrency(acc.amount),
      "",
    ]),
    [
      {
        content: "Total Liabilities",
        styles: { fontStyle: "bold", fillColor: [250, 250, 250] },
      },
      {
        content: formatCurrency(totalLiabilities),
        styles: { fontStyle: "bold", fillColor: [250, 250, 250] },
      },
      "",
    ],

    // Equity
    [
      {
        content: "Owner's Equity",
        colSpan: 3,
        styles: { fillColor: COLORS.SUB_HEADER_BG, fontStyle: "bold" },
      },
    ],
    ...equity.map((acc) => [acc.accountName, formatCurrency(acc.amount), ""]),
    [
      { content: "Total Equity", styles: { fontStyle: "bold" } },
      { content: formatCurrency(totalEquity), styles: { fontStyle: "bold" } },
      "",
    ],

    // Grand Total
    [
      {
        content: "Total Liabilities & Equity",
        styles: { fontStyle: "bold", fillColor: COLORS.HIGHLIGHT_BG },
      },
      {
        content: formatCurrency(totalLiabilities + totalEquity),
        styles: { fontStyle: "bold", fillColor: COLORS.HIGHLIGHT_BG },
      },
      "",
    ],
  ];

  autoTable(doc, {
    startY: 45,
    head: [["Description", "Amount", "Note"]],
    body: tableBody as RowInput[],
    theme: "grid",
    headStyles: {
      fillColor: COLORS.HEADER_BG,
      textColor: COLORS.TEXT_WHITE,
      fontStyle: "bold",
      halign: "center",
    },
    styles: {
      fontSize: 10,
      cellPadding: 4,
    },
    columnStyles: {
      0: { cellWidth: "auto" },
      1: { cellWidth: 40, halign: "right" },
      2: { cellWidth: 30, halign: "center" },
    },
  });

  return doc;
}

/**
 * US-GAAP 손익계산서 (단순 매핑 변경 버전)
 */
export function generateUSGAAPIncomeStatement(
  result: ConversionResult,
  companyName: string,
  baseDate: string
): jsPDF {
  // 실제로는 US-GAAP은 계정 배치 순서가 IFRS와 다르지만,
  // 여기서는 IFRS 로직을 재사용하되 타이틀과 통화 표시만 변경합니다.
  const doc = generateIFRSIncomeStatement(result, companyName, baseDate);

  // 기존 타이틀 덮어쓰기 (약간의 트릭)
  doc.setFillColor(255, 255, 255);
  doc.rect(14, 25, 100, 10, "F"); // 기존 제목 지우기
  doc.setFontSize(16);
  doc.setTextColor(
    COLORS.HEADER_BG[0],
    COLORS.HEADER_BG[1],
    COLORS.HEADER_BG[2]
  );
  doc.text("Income Statement (US-GAAP)", 14, 30);

  return doc;
}

/**
 * 사업계획 워크북 (가로 모드)
 */
export function generateBusinessPlanWorkbook(
  result: ConversionResult,
  companyName: string,
  baseDate: string,
  projectionYears: number = 3
): jsPDF {
  const doc = new jsPDF("landscape");
  setupKoreanFont(doc);

  // 헤더
  doc.setFontSize(22);
  doc.setTextColor(
    COLORS.HEADER_BG[0],
    COLORS.HEADER_BG[1],
    COLORS.HEADER_BG[2]
  );
  doc.text("Business Plan Financial Projection", 14, 20);
  doc.setFontSize(12);
  doc.text(companyName, 14, 28);
  doc.setFontSize(10);
  doc.setTextColor(100, 100, 100);
  doc.text(`Base Date: ${baseDate}`, 14, 34);

  // 주요 매출 계정만 추출
  const revenues = result.accounts.filter(
    (acc) =>
      AccountFilters.Revenue(acc.targetCode) ||
      acc.internalName.includes("매출")
  );

  const headers = [
    "Account Item",
    "Current Year",
    ...Array.from(
      { length: projectionYears },
      (_, i) => `Year +${i + 1} (Est.)`
    ),
  ];

  const growthRates = [1.1, 1.25, 1.45]; // 예시 성장률 (10%, 25%, 45%)

  const bodyData = revenues.map((acc) => {
    return [
      acc.accountName,
      formatCurrency(acc.amount),
      formatCurrency(acc.amount * growthRates[0]),
      formatCurrency(acc.amount * growthRates[1]),
      formatCurrency(acc.amount * growthRates[2]),
    ];
  });

  autoTable(doc, {
    startY: 40,
    head: [headers],
    body: bodyData,
    theme: "grid",
    headStyles: {
      fillColor: COLORS.HEADER_BG,
      textColor: COLORS.TEXT_WHITE,
      halign: "center",
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { halign: "right", fontStyle: "bold" },
      2: { halign: "right" },
      3: { halign: "right" },
      4: { halign: "right" },
    },
  });

  // 하단 안내 문구
  const finalY =
    (doc as jsPDF & { lastAutoTable: { finalY: number } }).lastAutoTable
      .finalY || 100;
  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(
    "* Projections are based on automatic AI growth assumptions.",
    14,
    finalY + 10
  );

  return doc;
}

/**
 * [Main Export Function]
 * 외부에서 호출하는 단일 진입점
 */
export function exportFinancialStatement(
  result: ConversionResult,
  format: "ifrs-income" | "ifrs-balance" | "usgaap-income" | "business-plan",
  companyName: string = "Company Name",
  baseDate: string
): void {
  let doc: jsPDF;
  let filename: string;

  try {
    switch (format) {
      case "ifrs-income":
        doc = generateIFRSIncomeStatement(result, companyName, baseDate);
        filename = `IFRS_Income_Statement_${baseDate}.pdf`;
        break;
      case "ifrs-balance":
        doc = generateIFRSBalanceSheet(result, companyName, baseDate);
        filename = `IFRS_Balance_Sheet_${baseDate}.pdf`;
        break;
      case "usgaap-income":
        doc = generateUSGAAPIncomeStatement(result, companyName, baseDate);
        filename = `USGAAP_Income_Statement_${baseDate}.pdf`;
        break;
      case "business-plan":
        doc = generateBusinessPlanWorkbook(result, companyName, baseDate);
        filename = `Business_Plan_${baseDate}.pdf`;
        break;
      default:
        throw new Error("Invalid format requested");
    }

    doc.save(filename);
  } catch (error) {
    console.error("PDF Export Failed:", error);
    alert("PDF 생성 중 오류가 발생했습니다. 콘솔을 확인해주세요.");
  }
}
