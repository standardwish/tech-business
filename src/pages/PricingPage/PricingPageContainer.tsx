import { useNavigate } from "react-router";
import { BRAND } from "@/constants/brand";
import PricingPagePresenter from "./PricingPagePresenter";

export default function PricingPageContainer() {
  const navigate = useNavigate();

  const plans = [
    {
      name: "무료 체험",
      price: "₩0",
      period: "/ 월",
      description: `${BRAND.APP_NAME_KR}를 체험해보세요`,
      features: [
        "월 3회 전환 가능",
        "기본 전환 항목 지원",
        "표준 처리 속도",
        "이메일 지원",
        "PDF 다운로드",
      ],
      buttonText: "무료로 시작",
      buttonVariant: "outlined" as const,
      popular: false,
    },
    {
      name: "프로",
      price: "₩99,000",
      period: "/ 월",
      description: "중소기업을 위한 완벽한 솔루션",
      features: [
        "무제한 전환",
        "모든 전환 항목 지원",
        "우선 처리 속도",
        "전문가 이메일 지원",
        "PDF/Excel 다운로드",
        "상세 분석 리포트",
        "회계 정책 주석 자동 생성",
        "검증 체크리스트",
      ],
      buttonText: "프로 시작하기",
      buttonVariant: "contained" as const,
      popular: true,
    },
    {
      name: "엔터프라이즈",
      price: "맞춤형",
      period: "",
      description: "대기업과 회계법인을 위한 맞춤 솔루션",
      features: [
        "프로 플랜의 모든 기능",
        "전담 고객 지원",
        "API 접근 권한",
        "맞춤형 AI 모델 학습",
        "온프레미스 배포 옵션",
        "SLA 보장",
        "전문가 컨설팅",
        "보안 감사 지원",
      ],
      buttonText: "문의하기",
      buttonVariant: "outlined" as const,
      popular: false,
    },
  ];

  const handlePlanClick = (planName: string) => {
    if (planName === "엔터프라이즈") {
      alert("문의하기 기능은 준비 중입니다.");
    } else {
      navigate("/conversion");
    }
  };

  return <PricingPagePresenter plans={plans} onPlanClick={handlePlanClick} />;
}
