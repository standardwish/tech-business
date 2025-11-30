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
import { useState } from "react";
import Step1FileUpload from "./conversion/Step1FileUpload";
import Step2SelectItems from "./conversion/Step2SelectItems";
import Step3Details from "./conversion/Step3Details";
import Step4Execute from "./conversion/Step4Execute";
import Step5Complete from "./conversion/Step5Complete";
import {
  AccountingStandard,
  ConversionInput,
  ConversionDetails,
  ConversionResult,
  ExtractedAccount,
} from "@/types/accounting";
import { DetectedItem } from "@/utils/itemDetector";

const steps = [
  "파일 업로드",
  "전환 항목 선택",
  "세부 정보 입력",
  "전환 실행",
  "완료",
];

export default function ConversionPage() {
  const [activeStep, setActiveStep] = useState(0);

  // Step 1 데이터
  const [conversionInput, setConversionInput] = useState<ConversionInput | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);

  // Step 2 데이터
  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  // Step 3 데이터
  const [conversionDetails, setConversionDetails] = useState<ConversionDetails>({});

  // Step 4 결과
  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  const handleStep1Next = (data: {
    file: File;
    sourceStandard: AccountingStandard;
    targetStandard: AccountingStandard;
    baseDate: string;
    detectedItems: DetectedItem[];
    extractedAccounts: ExtractedAccount[];
  }) => {
    setConversionInput({
      file: data.file,
      sourceStandard: data.sourceStandard,
      targetStandard: data.targetStandard,
      baseDate: data.baseDate,
    });
    setDetectedItems(data.detectedItems);
    // extractedAccounts는 Step4Execute에서 conversionInput.file을 통해 다시 파싱됨
    setActiveStep(1);
  };

  const handleStep2Next = (items: string[]) => {
    setSelectedItems(items);
    setActiveStep(2);
  };

  const handleStep3Next = (details: ConversionDetails) => {
    setConversionDetails(details);
    setActiveStep(3);
  };

  const handleStep4Complete = (result: ConversionResult) => {
    setConversionResult(result);
    setActiveStep(4);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1FileUpload onNext={handleStep1Next} />;

      case 1:
        return (
          <Step2SelectItems
            detectedItems={detectedItems}
            onNext={handleStep2Next}
            onBack={handleBack}
          />
        );

      case 2:
        return (
          <Step3Details
            selectedItems={selectedItems}
            onNext={handleStep3Next}
            onBack={handleBack}
          />
        );

      case 3:
        if (!conversionInput) {
          return <div>오류: 변환 입력 데이터가 없습니다.</div>;
        }
        return (
          <Step4Execute
            conversionInput={conversionInput}
            conversionDetails={conversionDetails}
            onComplete={handleStep4Complete}
            onBack={handleBack}
          />
        );

      case 4:
        if (!conversionResult) {
          return <div>오류: 변환 결과가 없습니다.</div>;
        }
        return <Step5Complete result={conversionResult} />;

      default:
        return null;
    }
  };

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
            {renderStepContent()}
          </Paper>
        </Container>
      </Layout>
    </AppTheme>
  );
}
