import { AccountingStandard, ExtractedAccount } from "@/types/accounting";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { parsePDFFile } from "@/utils/pdfParser";
import { parseExcelFile } from "@/utils/excelParser";
import { detectItemsByRules, DetectedItem } from "@/utils/itemDetector";
import { analyzeAccountsWithAI, AnalysisResult } from "@/utils/fileAnalyzer";
import { extractAccountsWithAI } from "@/utils/aiConverter";

interface Step1Props {
  onNext: (data: {
    file: File;
    sourceStandard: AccountingStandard;
    targetStandard: AccountingStandard;
    baseDate: string;
    detectedItems: DetectedItem[];
    extractedAccounts: ExtractedAccount[];
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
  const [parsing, setParsing] = useState(false);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [extractedAccounts, setExtractedAccounts] = useState<ExtractedAccount[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      // 파일 타입 검증
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

      // 파일 크기 검증 (20MB)
      if (file.size > 20 * 1024 * 1024) {
        setError("파일 크기는 20MB를 초과할 수 없습니다.");
        return;
      }

      setUploadedFile(file);
      setError("");

      // 파일 즉시 파싱 및 항목 감지
      setParsing(true);
      try {
        let accounts: ExtractedAccount[] = [];

        if (file.name.endsWith('.pdf')) {
          // PDF 파일 처리
          const pdfText = await parsePDFFile(file);
          // PDF에서는 AI를 통해 계정 추출
          accounts = await extractAccountsWithAI(pdfText, sourceStandard);
        } else {
          // 엑셀 파일 처리
          accounts = await parseExcelFile(file);
        }

        setExtractedAccounts(accounts);

        // 규칙 기반으로 항목 감지
        const detected = detectItemsByRules(accounts);
        setDetectedItems(detected);

        if (detected.length > 0) {
          setError("");
        }

        // AI 분석 실행 (PDF와 엑셀 모두)
        if (accounts.length > 0) {
          setAnalyzing(true);
          try {
            const analysis = await analyzeAccountsWithAI(
              accounts,
              sourceStandard,
              targetStandard
            );
            setAiAnalysis(analysis);
          } catch (err) {
            console.error('AI 분석 오류:', err);
            // AI 분석 실패는 경고만 하고 계속 진행
          } finally {
            setAnalyzing(false);
          }
        }
      } catch (err) {
        console.error('파일 파싱 오류:', err);
        setError(`파일 파싱 중 오류가 발생했습니다: ${err}`);
      } finally {
        setParsing(false);
      }
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
      detectedItems,
      extractedAccounts,
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
          {parsing && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <CircularProgress size={24} />
              <Typography>파일 분석 중...</Typography>
            </Box>
          )}
          {uploadedFile && !parsing && (
            <>
              <Alert severity="success" sx={{ mt: 2 }}>
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <CheckCircleIcon />
                  <Typography>{uploadedFile.name} 업로드 완료</Typography>
                </Box>
              </Alert>
              {detectedItems.length > 0 && (
                <Alert severity="info" sx={{ mt: 2, textAlign: "left" }}>
                  <Typography variant="body2" fontWeight="bold" gutterBottom>
                    감지된 전환 항목 ({detectedItems.length}개):
                  </Typography>
                  {detectedItems.map((item) => (
                    <Typography key={item.id} variant="body2" sx={{ ml: 2 }}>
                      • {item.reason}
                    </Typography>
                  ))}
                </Alert>
              )}
            </>
          )}
          {analyzing && (
            <Box sx={{ display: "flex", alignItems: "center", gap: 2, mt: 2 }}>
              <CircularProgress size={20} />
              <Typography variant="body2" color="text.secondary">
                AI가 파일 내용을 분석하고 있습니다...
              </Typography>
            </Box>
          )}
        </Box>
      </Paper>

      {/* AI 분석 결과 */}
      {aiAnalysis && !analyzing && (
        <Paper
          elevation={0}
          sx={{ p: 3, border: "1px solid", borderColor: "divider", mt: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 3 }}>
            <AutoAwesomeIcon color="primary" />
            <Typography variant="h6" fontWeight="bold">
              AI 분석 결과
            </Typography>
          </Box>

          {/* 요약 정보 */}
          <Box sx={{ display: "flex", gap: 1, flexWrap: "wrap", mb: 3 }}>
            <Chip
              label={`총 ${aiAnalysis.summary.totalAccounts}개 계정`}
              color="primary"
              variant="outlined"
              size="small"
            />
            {aiAnalysis.summary.hasRevaluation && (
              <Chip
                label="재평가 항목 포함"
                color="warning"
                variant="outlined"
                size="small"
              />
            )}
            {aiAnalysis.summary.hasLease && (
              <Chip
                label="리스 항목 포함"
                color="info"
                variant="outlined"
                size="small"
              />
            )}
            {aiAnalysis.summary.hasDevelopmentCosts && (
              <Chip
                label="개발비 포함"
                color="info"
                variant="outlined"
                size="small"
              />
            )}
            {aiAnalysis.summary.hasRetirementBenefits && (
              <Chip
                label="퇴직급여 포함"
                color="info"
                variant="outlined"
                size="small"
              />
            )}
          </Box>

          {/* 감지된 항목 */}
          {aiAnalysis.detectedItems.length > 0 && (
            <Box sx={{ mb: 3 }}>
              <Typography variant="subtitle1" fontWeight="bold" gutterBottom>
                파일에서 감지된 항목
              </Typography>
              {aiAnalysis.detectedItems.map((item, index) => (
                <Accordion key={index} elevation={0} sx={{ border: "1px solid", borderColor: "divider" }}>
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="medium">{item.category}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {item.items.map((accountName, idx) => (
                        <Chip
                          key={idx}
                          label={accountName}
                          size="small"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}

          {/* 추가 가능한 항목 */}
          {aiAnalysis.suggestedItems.length > 0 && (
            <Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
                <AddCircleOutlineIcon color="success" />
                <Typography variant="subtitle1" fontWeight="bold">
                  추가로 고려해야 할 항목
                </Typography>
              </Box>
              {aiAnalysis.suggestedItems.map((item, index) => (
                <Accordion
                  key={index}
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "success.main", bgcolor: "success.50" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="medium" color="success.dark">
                      {item.category}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography variant="body2" fontWeight="bold" gutterBottom>
                        추가 이유:
                      </Typography>
                      <Typography variant="body2">{item.reason}</Typography>
                    </Alert>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                      {item.description}
                    </Typography>
                    <Box sx={{ mt: 1 }}>
                      {item.items.map((accountName, idx) => (
                        <Chip
                          key={idx}
                          label={accountName}
                          size="small"
                          color="success"
                          variant="outlined"
                          sx={{ mr: 1, mb: 1 }}
                        />
                      ))}
                    </Box>
                  </AccordionDetails>
                </Accordion>
              ))}
            </Box>
          )}
        </Paper>
      )}

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
