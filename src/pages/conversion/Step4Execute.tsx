import {
  Box,
  Button,
  LinearProgress,
  Typography,
  Alert,
} from "@mui/material";
import { useState } from "react";
import { ConversionInput, ConversionResult, ConversionDetails } from "@/types/accounting";
import { executeAIConversion } from "@/utils/aiConverter";

interface Step4Props {
  conversionInput: ConversionInput;
  conversionDetails: ConversionDetails;
  onComplete: (result: ConversionResult) => void;
  onBack: () => void;
}

export default function Step4Execute({
  conversionInput,
  conversionDetails,
  onComplete,
  onBack,
}: Step4Props) {
  const [converting, setConverting] = useState(false);
  const [progress, setProgress] = useState(0);
  const [currentStep, setCurrentStep] = useState("");
  const [error, setError] = useState<string>("");

  const steps = [
    conversionInput.file.name.endsWith('.pdf') ? "PDF 파일 파싱 중..." : "엑셀 파일 파싱 중...",
    "AI 기반 계정과목 매핑 중...",
    "회계기준 변환 중...",
    "AI 기반 조정 항목 생성 중...",
    "최종 검증 중...",
  ];

  const handleStartConversion = async () => {
    setConverting(true);
    setProgress(0);
    setError("");

    try {
      // 단계별 진행 상태 업데이트
      const updateProgress = (step: number) => {
        setCurrentStep(steps[step]);
        setProgress(((step + 1) / steps.length) * 90);
      };

      // Step 1: 파일 파싱
      updateProgress(0);
      await new Promise((resolve) => setTimeout(resolve, 500));

      // Step 2-5: AI 변환 실행 (내부적으로 모든 단계 수행)
      updateProgress(1);

      // 진행 상태 업데이트를 위한 프로미스
      const progressPromise = (async () => {
        for (let i = 2; i < steps.length; i++) {
          await new Promise((resolve) => setTimeout(resolve, 1000));
          updateProgress(i);
        }
      })();

      // 실제 AI 변환 실행
      const result = await executeAIConversion(conversionInput, conversionDetails);

      // 진행 상태 업데이트 완료 대기
      await progressPromise;

      setProgress(100);
      setCurrentStep("완료!");

      // 완료 후 잠시 대기
      await new Promise((resolve) => setTimeout(resolve, 500));

      onComplete(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "변환 중 오류가 발생했습니다."
      );
      setConverting(false);
    }
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        회계기준 변환 실행
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        모든 준비가 완료되었습니다. 변환을 시작하세요.
      </Typography>

      {/* 변환 요약 정보 */}
      <Box
        sx={{
          p: 3,
          bgcolor: "action.hover",
          borderRadius: 2,
          mb: 3,
        }}
      >
        <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
          변환 정보
        </Typography>
        <Box sx={{ display: "grid", gap: 1 }}>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              원본 기준:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {conversionInput.sourceStandard}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              목표 기준:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {conversionInput.targetStandard}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              기준일:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {conversionInput.baseDate}
            </Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between" }}>
            <Typography variant="body2" color="text.secondary">
              파일명:
            </Typography>
            <Typography variant="body2" fontWeight="bold">
              {conversionInput.file.name}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 변환 진행 상태 */}
      {converting ? (
        <Box sx={{ my: 4 }}>
          <Typography variant="body1" gutterBottom>
            {currentStep}
          </Typography>
          <LinearProgress
            variant="determinate"
            value={progress}
            sx={{ my: 2, height: 8, borderRadius: 4 }}
          />
          <Typography variant="body2" color="text.secondary" align="center">
            {progress.toFixed(0)}% 완료
          </Typography>
        </Box>
      ) : (
        <Box sx={{ textAlign: "center", my: 4 }}>
          <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
            AI가 회계 기준을 자동으로 변환합니다.
            <br />
            계정과목 매핑, 조정 항목 생성, 보고서 작성이 자동으로 수행됩니다.
          </Typography>
          <Button
            variant="contained"
            size="large"
            onClick={handleStartConversion}
            disabled={converting}
          >
            변환 시작
          </Button>
        </Box>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={onBack} disabled={converting}>
          이전
        </Button>
      </Box>
    </Box>
  );
}
