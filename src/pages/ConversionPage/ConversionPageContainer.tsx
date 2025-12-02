import { useState } from "react";
import Step1FileUpload from "../conversion/Step1FileUpload";
import Step1_5Analysis from "../conversion/Step1_5Analysis";
import Step2SelectItems from "../conversion/Step2SelectItems";
import Step3Details from "../conversion/Step3Details";
import Step4Execute from "../conversion/Step4Execute";
import Step5Complete from "../conversion/Step5Complete";
import {
  AccountingStandard,
  ConversionInput,
  ConversionDetails,
  ConversionResult,
  ExtractedAccount,
} from "@/types/accounting";
import { DetectedItem } from "@/utils/itemDetector";
import ConversionPagePresenter from "./ConversionPagePresenter";

const steps = [
  "파일 업로드",
  "파일 분석",
  "전환 항목 선택",
  "세부 정보 입력",
  "전환 실행",
  "완료",
];

export default function ConversionPageContainer() {
  const [activeStep, setActiveStep] = useState(0);

  const [conversionInput, setConversionInput] = useState<ConversionInput | null>(null);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [extractedAccounts, setExtractedAccounts] = useState<ExtractedAccount[]>([]);

  const [selectedItems, setSelectedItems] = useState<string[]>([]);

  const [conversionDetails, setConversionDetails] = useState<ConversionDetails>({});

  const [conversionResult, setConversionResult] = useState<ConversionResult | null>(null);

  const handleStep1Next = (data: {
    file: File;
    sourceStandard: AccountingStandard;
    targetStandard: AccountingStandard;
    baseDate: string;
  }) => {
    setConversionInput({
      file: data.file,
      sourceStandard: data.sourceStandard,
      targetStandard: data.targetStandard,
      baseDate: data.baseDate,
    });
    setActiveStep(1);
  };

  const handleStep1_5Next = (data: {
    detectedItems: DetectedItem[];
    extractedAccounts: ExtractedAccount[];
  }) => {
    setDetectedItems(data.detectedItems);
    setExtractedAccounts(data.extractedAccounts);
    setActiveStep(2);
  };

  const handleStep2Next = (items: string[]) => {
    setSelectedItems(items);
    setActiveStep(3);
  };

  const handleStep3Next = (details: ConversionDetails) => {
    setConversionDetails(details);
    setActiveStep(4);
  };

  const handleStep4Complete = (result: ConversionResult) => {
    setConversionResult(result);
    setActiveStep(5);
  };

  const handleBack = () => {
    setActiveStep((prev) => prev - 1);
  };

  const renderStepContent = () => {
    switch (activeStep) {
      case 0:
        return <Step1FileUpload onNext={handleStep1Next} />;

      case 1:
        if (!conversionInput) {
          return <div>오류: 변환 입력 데이터가 없습니다.</div>;
        }
        return (
          <Step1_5Analysis
            file={conversionInput.file}
            sourceStandard={conversionInput.sourceStandard}
            targetStandard={conversionInput.targetStandard}
            onNext={handleStep1_5Next}
            onBack={handleBack}
          />
        );

      case 2:
        return (
          <Step2SelectItems
            detectedItems={detectedItems}
            onNext={handleStep2Next}
            onBack={handleBack}
          />
        );

      case 3:
        return (
          <Step3Details
            selectedItems={selectedItems}
            extractedAccounts={extractedAccounts}
            onNext={handleStep3Next}
            onBack={handleBack}
          />
        );

      case 4:
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

      case 5:
        if (!conversionResult) {
          return <div>오류: 변환 결과가 없습니다.</div>;
        }
        return <Step5Complete result={conversionResult} />;

      default:
        return null;
    }
  };

  return (
    <ConversionPagePresenter activeStep={activeStep} steps={steps}>
      {renderStepContent()}
    </ConversionPagePresenter>
  );
}
