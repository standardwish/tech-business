import { useState } from "react";
import { useNavigate } from "react-router";
import { ConversionResult } from "@/types/accounting";
import { exportFinancialStatement } from "@/utils/pdfExporter";
import Step5CompletePresenter from "./Step5CompletePresenter";

interface Step5Props {
  result: ConversionResult;
}

export default function Step5CompleteContainer({ result }: Step5Props) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);

  const handleViewResults = () => {
    localStorage.setItem("latestConversionResult", JSON.stringify(result));
    navigate("/results/latest");
  };

  const handleDownloadReport = () => {
    alert("보고서 다운로드 기능은 곧 추가됩니다.");
  };

  const handlePDFMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePDFMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportPDF = (format: 'ifrs-income' | 'ifrs-balance' | 'usgaap-income' | 'business-plan') => {
    const companyName = prompt('회사명을 입력하세요:', '(주)회사명') || '회사명';
    const baseDate = new Date().toISOString().split('T')[0];

    try {
      exportFinancialStatement(result, format, companyName, baseDate);
      handlePDFMenuClose();
    } catch (error) {
      console.error('PDF 내보내기 오류:', error);
      alert(`PDF 내보내기 중 오류가 발생했습니다: ${error}`);
    }
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <Step5CompletePresenter
      result={result}
      pdfMenuAnchorEl={anchorEl}
      onViewResults={handleViewResults}
      onDownloadReport={handleDownloadReport}
      onPDFMenuOpen={handlePDFMenuOpen}
      onPDFMenuClose={handlePDFMenuClose}
      onExportPDF={handleExportPDF}
      onBackToDashboard={handleBackToDashboard}
    />
  );
}
