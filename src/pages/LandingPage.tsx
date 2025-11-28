import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import ArrowForwardIcon from "@mui/icons-material/ArrowForward";
import AssessmentIcon from "@mui/icons-material/Assessment";
import AutoFixHighIcon from "@mui/icons-material/AutoFixHigh";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DescriptionIcon from "@mui/icons-material/Description";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { useNavigate } from "react-router";
import eyLogo from "../assets/images/ey_korea.jpeg";
import hyundaiLogo from "../assets/images/hyundai.jpeg";
import kpmgLogo from "../assets/images/kpmg.png";
import lgLogo from "../assets/images/lg.png";
import samilLogo from "../assets/images/samil.png";
import Layout from "../components/Layout";
import { BRAND } from "../constants/brand";

export default function LandingPage() {
  const navigate = useNavigate();

  const features = [
    {
      icon: <AutoFixHighIcon sx={{ fontSize: 50 }} color="primary" />,
      title: "AI 자동 전환",
      description:
        "K-GAAP에서 IFRS로의 복잡한 회계 기준 전환을 AI가 자동으로 처리합니다.",
    },
    {
      icon: <SpeedIcon sx={{ fontSize: 50 }} color="primary" />,
      title: "빠른 처리",
      description: "수작업으로 수일이 걸리던 작업을 몇 분 만에 완료합니다.",
    },
    {
      icon: <SecurityIcon sx={{ fontSize: 50 }} color="primary" />,
      title: "정확성 보장",
      description:
        "회계 전문가의 검증을 거친 AI 모델로 높은 정확도를 제공합니다.",
    },
    {
      icon: <AssessmentIcon sx={{ fontSize: 50 }} color="primary" />,
      title: "상세한 분석",
      description:
        "변경 사항에 대한 자세한 분석 보고서와 비교 자료를 제공합니다.",
    },
  ];

  const conversionTypes = [
    "자산평가 (재평가모형 vs 원가모형)",
    "리스자산 (IFRS 16 적용)",
    "금융상품 및 사채 (유효이자율법)",
    "수익인식 (IFRS 15)",
    "무형자산 및 개발비 자산화",
    "퇴직급여 충당부채",
    "충당부채 인식 기준",
  ];

  const howItWorks = [
    {
      step: "1",
      title: "파일 업로드",
      description: "재무제표 및 회계 문서를 업로드합니다.",
    },
    {
      step: "2",
      title: "AI 분석",
      description: "AI가 자동으로 회계 기준을 분석하고 전환 계획을 수립합니다.",
    },
    {
      step: "3",
      title: "전환 실행",
      description: "IFRS 기준에 맞춰 자동으로 전환 처리됩니다.",
    },
    {
      step: "4",
      title: "결과 다운로드",
      description: "전환된 재무제표와 상세 보고서를 다운로드합니다.",
    },
  ];

  return (
    <Layout>
      {/* Hero Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 10,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <Typography
            variant="h2"
            component="h1"
            gutterBottom
            fontWeight="bold"
          >
            회계기준 전환, 이제 {BRAND.APP_NAME_KR}로 해결하세요
          </Typography>
          <Typography variant="h5" component="p" sx={{ mb: 4, opacity: 0.9 }}>
            {BRAND.TAGLINE}
          </Typography>
          <Box
            sx={{
              display: "flex",
              gap: 2,
              justifyContent: "center",
              flexWrap: "wrap",
            }}
          >
            <Button
              variant="contained"
              sx={{
                bgcolor: "Background",
                color: "primary.main",
              }}
              size="large"
              onClick={() => navigate("/conversion")}
            >
              무료로 시작하기
            </Button>
            <Button
              variant="outlined"
              size="large"
              sx={{
                borderColor: "white",
                color: "white",
                "&:hover": {
                  borderColor: "white",
                  bgcolor: "rgba(255,255,255,0.1)",
                },
                px: 4,
                py: 1.5,
              }}
              onClick={() => navigate("/pricing")}
            >
              요금제 보기
            </Button>
          </Box>
        </Container>
      </Box>

      {/* Trusted Companies Section */}
      <Box sx={{ bgcolor: "background.default", py: 4 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h4"
            align="center"
            color="textPrimary"
            sx={{ mb: 3 }}
          >
            이미 <strong style={{ color: "#334155" }}>50+개의</strong> 기업이
            신뢰하는 솔루션
          </Typography>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: { xs: 2, sm: 3, md: 4 },
              flexWrap: "wrap",
              opacity: 0.7,
            }}
          >
            {[
              { name: "삼일회계법인", logo: samilLogo },
              { name: "삼정KPMG", logo: kpmgLogo },
              { name: "안진회계법인", logo: eyLogo },
              { name: "현대자동차", logo: hyundaiLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
              { name: "LG전자", logo: lgLogo },
            ].map((company, index) => (
              <Box
                key={index}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  height: 100,
                  minWidth: 160,
                  px: 4,
                  bgcolor: "white",
                  borderRadius: 2,
                  border: "1px solid",
                  borderColor: "divider",
                  transition: "all 0.3s",
                }}
              >
                <Box
                  component="img"
                  src={company.logo}
                  alt={company.name}
                  sx={{
                    maxWidth: "100%",
                    maxHeight: "80px",
                    objectFit: "contain",
                  }}
                />
              </Box>
            ))}
          </Box>
        </Container>
      </Box>

      {/* Features Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          왜 {BRAND.APP_NAME_KR}인가요?
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          {BRAND.DESCRIPTION}
        </Typography>

        <Grid container spacing={4}>
          {features.map((feature, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 3 }} key={index}>
              <Card
                sx={{
                  height: "100%",
                  textAlign: "center",
                  transition: "transform 0.2s",
                  "&:hover": { transform: "translateY(-8px)" },
                }}
                elevation={2}
              >
                <CardContent sx={{ py: 4 }}>
                  <Box sx={{ mb: 2 }}>{feature.icon}</Box>
                  <Typography variant="h6" gutterBottom fontWeight="bold">
                    {feature.title}
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    {feature.description}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>

      {/* Conversion Types Section */}
      <Box sx={{ bgcolor: "grey.50", py: 8 }}>
        <Container maxWidth="lg">
          <Typography
            variant="h3"
            align="center"
            gutterBottom
            fontWeight="bold"
          >
            지원하는 전환 항목
          </Typography>
          <Typography
            variant="h6"
            align="center"
            color="text.secondary"
            sx={{ mb: 4 }}
          >
            7가지 주요 회계 기준 전환을 지원합니다
          </Typography>

          <Grid container spacing={3}>
            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <AccountBalanceIcon
                      sx={{ fontSize: 40, mr: 2 }}
                      color="primary"
                    />
                    <Typography variant="h5" fontWeight="bold">
                      전환 항목
                    </Typography>
                  </Box>
                  <List>
                    {conversionTypes.map((type, index) => (
                      <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                        <ListItemIcon>
                          <CheckCircleIcon color="success" />
                        </ListItemIcon>
                        <ListItemText primary={type} />
                      </ListItem>
                    ))}
                  </List>
                </CardContent>
              </Card>
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <Card elevation={2} sx={{ height: "100%" }}>
                <CardContent>
                  <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
                    <DescriptionIcon
                      sx={{ fontSize: 40, mr: 2 }}
                      color="primary"
                    />
                    <Typography variant="h5" fontWeight="bold">
                      자동 생성 항목
                    </Typography>
                  </Box>
                  <List>
                    <ListItem disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="전환된 재무제표"
                        secondary="IFRS 기준에 맞춘 새로운 재무제표"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="변경사항 상세 보고서"
                        secondary="항목별 변경 내역 및 근거"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="회계 정책 주석"
                        secondary="선택한 회계 정책 자동 반영"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="검증 체크리스트"
                        secondary="전환 완료 후 확인 사항"
                      />
                    </ListItem>
                    <ListItem disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon>
                        <CheckCircleIcon color="success" />
                      </ListItemIcon>
                      <ListItemText
                        primary="PDF/Excel 다운로드"
                        secondary="다양한 형식으로 결과 저장"
                      />
                    </ListItem>
                  </List>
                </CardContent>
              </Card>
            </Grid>
          </Grid>
        </Container>
      </Box>

      {/* How It Works Section */}
      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Typography variant="h3" align="center" gutterBottom fontWeight="bold">
          사용 방법
        </Typography>
        <Typography
          variant="h6"
          align="center"
          color="text.secondary"
          sx={{ mb: 6 }}
        >
          4단계로 간단하게 완료됩니다
        </Typography>

        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            flexWrap: { xs: "wrap", md: "nowrap" },
            gap: { xs: 4, md: 2 },
          }}
        >
          {howItWorks.map((item, index) => (
            <Box
              key={index}
              sx={{
                display: "flex",
                alignItems: "center",
                gap: { xs: 0, md: 2 },
                flex: { xs: "1 1 100%", sm: "1 1 45%", md: "0 1 auto" },
              }}
            >
              <Box sx={{ textAlign: "center", flex: "1 1 auto" }}>
                <Box
                  sx={{
                    width: 80,
                    height: 80,
                    borderRadius: "50%",
                    bgcolor: "primary.main",
                    color: "white",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    mx: "auto",
                    mb: 2,
                    fontSize: "2rem",
                    fontWeight: "bold",
                  }}
                >
                  {item.step}
                </Box>
                <Typography variant="h6" gutterBottom fontWeight="bold">
                  {item.title}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {item.description}
                </Typography>
              </Box>
              {index < howItWorks.length - 1 && (
                <ArrowForwardIcon
                  sx={{
                    fontSize: 40,
                    color: "primary.main",
                    display: { xs: "none", md: "block" },
                    flexShrink: 0,
                  }}
                />
              )}
            </Box>
          ))}
        </Box>
      </Container>

      {/* CTA Section */}
      <Box
        sx={{
          bgcolor: "primary.main",
          color: "white",
          py: 8,
          textAlign: "center",
        }}
      >
        <Container maxWidth="md">
          <TrendingUpIcon sx={{ fontSize: 80, mb: 2 }} />
          <Typography variant="h3" gutterBottom fontWeight="bold">
            지금 바로 시작하세요
          </Typography>
          <Typography variant="h6" sx={{ mb: 4, opacity: 0.9 }}>
            무료 체험으로 {BRAND.APP_NAME_KR}의 강력함을 경험해보세요
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={() => navigate("/conversion")}
          >
            무료로 시작하기
          </Button>
        </Container>
      </Box>
    </Layout>
  );
}
