import { useState } from "react";
import { useNavigate, useParams } from "react-router";
import ResultsPagePresenter from "./ResultsPagePresenter";

export default function ResultsPageContainer() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);

  const handleTabChange = (_event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue);
  };

  const comparisonData = [
    {
      category: "유형자산",
      kgaap: "₩1,000,000,000",
      ifrs: "₩1,050,000,000",
      difference: "+₩50,000,000",
      note: "재평가모형 적용",
    },
    {
      category: "리스자산",
      kgaap: "₩0",
      ifrs: "₩300,000,000",
      difference: "+₩300,000,000",
      note: "IFRS 16 적용 - 사용권자산 인식",
    },
    {
      category: "리스부채",
      kgaap: "₩0",
      ifrs: "₩280,000,000",
      difference: "+₩280,000,000",
      note: "IFRS 16 적용 - 리스부채 인식",
    },
    {
      category: "무형자산 (개발비)",
      kgaap: "₩0",
      ifrs: "₩120,000,000",
      difference: "+₩120,000,000",
      note: "자산화 요건 충족",
    },
  ];

  const changes = [
    "자산평가: 재평가모형 적용으로 유형자산 공정가치 반영",
    "리스자산: IFRS 16에 따라 사용권자산과 리스부채 인식",
    "금융상품: 유효이자율법 적용",
    "수익인식: IFRS 15 기준에 따른 수익 인식 시점 조정",
    "무형자산: 개발비 자산화 요건 충족으로 무형자산 인식",
    "퇴직급여: 확정급여채무 보험수리적 평가",
    "충당부채: IFRS 기준에 따른 충당부채 재평가",
  ];

  const checklist = [
    { item: "재무제표 검토 및 승인", completed: true },
    { item: "주석 사항 확인", completed: true },
    { item: "회계정책 문서화", completed: true },
    { item: "외부감사 준비", completed: false },
    { item: "이사회 보고", completed: false },
  ];

  const handlePdfDownload = () => {
    alert("PDF 다운로드 기능 준비 중");
  };

  const handleExcelDownload = () => {
    alert("Excel 다운로드 기능 준비 중");
  };

  const handleBackToDashboard = () => {
    navigate("/dashboard");
  };

  return (
    <ResultsPagePresenter
      projectId={id}
      tabValue={tabValue}
      comparisonData={comparisonData}
      changes={changes}
      checklist={checklist}
      onTabChange={handleTabChange}
      onPdfDownload={handlePdfDownload}
      onExcelDownload={handleExcelDownload}
      onBackToDashboard={handleBackToDashboard}
    />
  );
}
