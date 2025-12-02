import Layout from "@/components/Layout";
import AppTheme from "@/theme/shared-theme/AppTheme";
import {
  Container,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import CssBaseline from "@mui/material/CssBaseline";

interface ConversionPagePresenterProps {
  activeStep: number;
  steps: string[];
  children: React.ReactNode;
}

export default function ConversionPagePresenter({
  activeStep,
  steps,
  children,
}: ConversionPagePresenterProps) {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            회계 기준 전환
          </Typography>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
            K-GAAP, IFRS, US-GAAP 간의 회계 기준 전환을 AI가 자동으로
            처리해드립니다.
          </Typography>

          <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
            {steps.map((label) => (
              <Step key={label}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>

          <Paper elevation={2} sx={{ p: 4 }}>
            {children}
          </Paper>
        </Container>
      </Layout>
    </AppTheme>
  );
}
