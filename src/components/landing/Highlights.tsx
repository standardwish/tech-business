import AssessmentIcon from "@mui/icons-material/Assessment";
import AutoFixHighRoundedIcon from "@mui/icons-material/AutoFixHighRounded";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import SecurityIcon from "@mui/icons-material/Security";
import SpeedIcon from "@mui/icons-material/Speed";
import SupportAgentRoundedIcon from "@mui/icons-material/SupportAgentRounded";
import Box from "@mui/material/Box";
import Card from "@mui/material/Card";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

const items = [
  {
    icon: <AutoFixHighRoundedIcon />,
    title: "AI 자동 전환",
    description:
      "K-GAAP에서 IFRS로의 복잡한 회계 기준 전환을 AI가 자동으로 처리합니다.",
  },
  {
    icon: <SpeedIcon />,
    title: "빠른 처리",
    description: "수작업으로 수일이 걸리던 작업을 몇 분 만에 완료합니다.",
  },
  {
    icon: <SecurityIcon />,
    title: "정확성 보장",
    description:
      "회계 전문가의 검증을 거친 AI 모델로 높은 정확도를 제공합니다.",
  },
  {
    icon: <AssessmentIcon />,
    title: "상세한 분석",
    description:
      "변경 사항에 대한 자세한 분석 보고서와 비교 자료를 제공합니다.",
  },
  {
    icon: <SupportAgentRoundedIcon />,
    title: "전문가 지원",
    description:
      "회계 전문가의 검토와 지원을 통해 전환 과정을 안전하게 진행합니다.",
  },
  {
    icon: <CheckCircleIcon />,
    title: "검증된 솔루션",
    description:
      "다수의 기업과 회계법인에서 검증된 신뢰할 수 있는 솔루션입니다.",
  },
];

export default function Highlights() {
  return (
    <Box
      id="highlights"
      sx={{
        pt: { xs: 4, sm: 12 },
        pb: { xs: 8, sm: 16 },
        color: "white",
        bgcolor: "grey.900",
      }}
    >
      <Container
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: { xs: 3, sm: 6 },
        }}
      >
        <Box
          sx={{
            width: { sm: "100%", md: "60%" },
            textAlign: { sm: "left", md: "center" },
          }}
        >
          <Typography component="h2" variant="h4" gutterBottom>
            Highlights
          </Typography>
          <Typography variant="body1" sx={{ color: "grey.400" }}>
            AI 기반 자동화, 빠른 처리 속도, 높은 정확성, 상세한 분석 리포트를
            제공하며, 전문가의 검증된 솔루션으로 안전한 회계 기준 전환을
            지원합니다.
          </Typography>
        </Box>
        <Grid container spacing={2}>
          {items.map((item, index) => (
            <Grid size={{ xs: 12, sm: 6, md: 4 }} key={index}>
              <Stack
                direction="column"
                component={Card}
                spacing={1}
                useFlexGap
                sx={{
                  color: "inherit",
                  p: 3,
                  height: "100%",
                  borderColor: "hsla(220, 25%, 25%, 0.3)",
                  backgroundColor: "grey.800",
                }}
              >
                <Box sx={{ opacity: "50%" }}>{item.icon}</Box>
                <div>
                  <Typography gutterBottom sx={{ fontWeight: "medium" }}>
                    {item.title}
                  </Typography>
                  <Typography variant="body2" sx={{ color: "grey.400" }}>
                    {item.description}
                  </Typography>
                </div>
              </Stack>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
}
