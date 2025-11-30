import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import StarIcon from "@mui/icons-material/Star";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import Layout from "@/components/Layout";
import { BRAND } from "@/constants/brand";
import AppTheme from "@/theme/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";

export default function PricingPage() {
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

  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Layout>
        <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h3"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            간단하고 투명한 가격
          </Typography>
          <Typography variant="h6" sx={{ opacity: 0.9 }}>
            귀사의 규모에 맞는 플랜을 선택하세요
          </Typography>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: { xs: "1fr", md: "1fr 1fr 1fr" },
            gap: 4,
          }}
        >
          {plans.map((plan, index) => (
            <Card
              key={index}
              elevation={plan.popular ? 8 : 2}
              sx={{
                position: "relative",
                height: "100%",
                display: "flex",
                flexDirection: "column",
                border: plan.popular ? 3 : 1,
                borderColor: plan.popular ? "primary.main" : "divider",
              }}
            >
              {plan.popular && (
                <Box
                  sx={{
                    position: "absolute",
                    top: 0,
                    left: "50%",
                    transform: "translateX(-50%)",
                  }}
                >
                  <Chip
                    icon={<StarIcon />}
                    label="인기"
                    color="primary"
                    sx={{ px: 2, fontWeight: "bold" }}
                  />
                </Box>
              )}

              <CardContent sx={{ flexGrow: 1, pt: plan.popular ? 4 : 2 }}>
                <Typography
                  variant="h5"
                  fontWeight="bold"
                  gutterBottom
                  align="center"
                >
                  {plan.name}
                </Typography>

                <Box sx={{ textAlign: "center", my: 3 }}>
                  <Typography variant="h3" fontWeight="bold" component="span">
                    {plan.price}
                  </Typography>
                  <Typography
                    variant="h6"
                    component="span"
                    color="text.secondary"
                  >
                    {plan.period}
                  </Typography>
                </Box>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  align="center"
                  sx={{ mb: 3, minHeight: 40 }}
                >
                  {plan.description}
                </Typography>

                <List dense>
                  {plan.features.map((feature, idx) => (
                    <ListItem key={idx} disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={feature}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>

              <Box sx={{ p: 2, pt: 0 }}>
                <Button
                  variant={plan.buttonVariant}
                  fullWidth
                  size="large"
                  onClick={() => {
                    if (plan.name === "엔터프라이즈") {
                      // Handle contact form
                      alert("문의하기 기능은 준비 중입니다.");
                    } else {
                      navigate("/conversion");
                    }
                  }}
                >
                  {plan.buttonText}
                </Button>
              </Box>
            </Card>
          ))}
        </Box>

        {/* FAQ or Additional Info */}
        <Box sx={{ mt: 8, textAlign: "center" }}>
          <Typography variant="h5" fontWeight="bold" gutterBottom>
            자주 묻는 질문
          </Typography>
          <Box
            sx={{
              mt: 4,
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  환불 정책은 어떻게 되나요?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  첫 달 이내에 만족하지 못하시면 전액 환불해드립니다. 질문이
                  없습니다.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  플랜을 변경할 수 있나요?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  언제든지 플랜을 업그레이드하거나 다운그레이드할 수 있습니다.
                  차액은 일할 계산됩니다.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  보안은 어떻게 보장되나요?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  모든 데이터는 암호화되어 전송 및 저장되며, ISO 27001 인증을
                  받은 서버에서 관리됩니다.
                </Typography>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  기술 지원은 어떻게 받나요?
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  모든 플랜에서 이메일 지원을 제공합니다. 프로 이상 플랜에서는
                  우선 지원을 받으실 수 있습니다.
                </Typography>
              </CardContent>
            </Card>
          </Box>
        </Box>
      </Container>
    </Layout>
    </AppTheme>
  );
}
