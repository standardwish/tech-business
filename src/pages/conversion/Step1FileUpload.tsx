import { AccountingStandard } from "@/types/accounting";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import {
  Alert,
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useState } from "react";

interface Step1Props {
  onNext: (data: {
    file: File;
    sourceStandard: AccountingStandard;
    targetStandard: AccountingStandard;
    baseDate: string;
  }) => void;
}

export default function Step1FileUpload({ onNext }: Step1Props) {
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [sourceStandard, setSourceStandard] =
    useState<AccountingStandard>("K-GAAP");
  const [targetStandard, setTargetStandard] =
    useState<AccountingStandard>("IFRS");
  const [baseDate, setBaseDate] = useState<string>(
    new Date().toISOString().split("T")[0]
  );
  const [error, setError] = useState<string>("");

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const validTypes = [
        "application/vnd.ms-excel",
        "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        "application/pdf",
      ];

      const isValidExtension = file.name.match(/\.(xlsx?|xls|pdf)$/);

      if (!validTypes.includes(file.type) && !isValidExtension) {
        setError("엑셀(.xlsx, .xls) 또는 PDF 파일만 업로드 가능합니다.");
        return;
      }

      if (file.size > 20 * 1024 * 1024) {
        setError("파일 크기는 20MB를 초과할 수 없습니다.");
        return;
      }

      setUploadedFile(file);
      setError("");
    }
  };

  const handleNext = () => {
    if (!uploadedFile) {
      setError("파일을 업로드해주세요.");
      return;
    }

    if (sourceStandard === targetStandard) {
      setError("원본 기준과 목표 기준이 같을 수 없습니다.");
      return;
    }

    if (!baseDate) {
      setError("기준일을 입력해주세요.");
      return;
    }

    onNext({
      file: uploadedFile,
      sourceStandard,
      targetStandard,
      baseDate,
    });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        기본 정보 입력
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        회계 기준 변환에 필요한 기본 정보를 입력해주세요.
      </Typography>

      <Box
        sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 3 }}
      >
        <FormControl fullWidth>
          <InputLabel>원본 회계기준</InputLabel>
          <Select
            value={sourceStandard}
            sx={{
              bgcolor: "Background",
              ":hover": { bgcolor: "Background" },
            }}
            label="원본 회계기준"
            onChange={(e) =>
              setSourceStandard(e.target.value as AccountingStandard)
            }
          >
            <MenuItem value="K-GAAP">K-GAAP (한국채택국제회계기준)</MenuItem>
            <MenuItem value="IFRS">IFRS (국제회계기준)</MenuItem>
            <MenuItem value="US-GAAP">US-GAAP (미국회계기준)</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth>
          <InputLabel>목표 회계기준</InputLabel>
          <Select
            value={targetStandard}
            sx={{
              bgcolor: "Background",
              ":hover": { bgcolor: "Background" },
            }}
            label="목표 회계기준"
            onChange={(e) =>
              setTargetStandard(e.target.value as AccountingStandard)
            }
          >
            <MenuItem value="K-GAAP">K-GAAP (한국채택국제회계기준)</MenuItem>
            <MenuItem value="IFRS">IFRS (국제회계기준)</MenuItem>
            <MenuItem value="US-GAAP">US-GAAP (미국회계기준)</MenuItem>
          </Select>
        </FormControl>
      </Box>

      <TextField
        fullWidth
        label="기준일"
        type="date"
        value={baseDate}
        onChange={(e) => setBaseDate(e.target.value)}
        InputLabelProps={{ shrink: true }}
        sx={{ mb: 3 }}
        helperText="환율은 기준일 기준으로 자동 조회됩니다."
      />

      {/* 파일 업로드 */}
      <Paper
        elevation={0}
        sx={{ p: 4, border: "2px dashed", borderColor: "divider", mb: 3 }}
      >
        <Box sx={{ textAlign: "center" }}>
          <CloudUploadIcon
            sx={{ fontSize: 80, color: "primary.main", mb: 2 }}
          />
          <Typography variant="h6" gutterBottom>
            재무제표 파일 업로드
          </Typography>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
            Excel(.xlsx, .xls) 또는 PDF 파일을 업로드하세요
          </Typography>
          <Button variant="contained" component="label">
            파일 선택
            <input
              type="file"
              hidden
              accept=".xlsx,.xls,.pdf"
              onChange={handleFileUpload}
            />
          </Button>
          {uploadedFile && (
            <Alert severity="success" sx={{ mt: 2 }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Typography>{uploadedFile.name} 업로드 완료</Typography>
              </Box>
            </Alert>
          )}
        </Box>
      </Paper>

      {/* 에러 메시지 */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* 다음 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
        <Button size="large" onClick={handleNext} disabled={!uploadedFile}>
          다음
        </Button>
      </Box>
    </Box>
  );
}
