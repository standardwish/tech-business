import { AccountingStandard, ExtractedAccount } from "@/types/accounting";
import { parseExcelFile } from "@/utils/excelParser";
import { AnalysisResult, analyzeAccountsWithAI } from "@/utils/fileAnalyzer";
import { DetectedItem, detectItemsByRules } from "@/utils/itemDetector";
import { extractAccountsFromPDFText, parsePDFFile } from "@/utils/pdfParser";
import AddCircleOutlineIcon from "@mui/icons-material/AddCircleOutline";
import AutoAwesomeIcon from "@mui/icons-material/AutoAwesome";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Chip,
  CircularProgress,
  LinearProgress,
  Paper,
  Typography,
} from "@mui/material";
import { useCallback, useEffect, useState } from "react";

interface Step1_5AnalysisProps {
  file: File;
  sourceStandard: AccountingStandard;
  targetStandard: AccountingStandard;
  onNext: (data: {
    detectedItems: DetectedItem[];
    extractedAccounts: ExtractedAccount[];
  }) => void;
  onBack: () => void;
}

export default function Step1_5Analysis({
  file,
  sourceStandard,
  targetStandard,
  onNext,
  onBack,
}: Step1_5AnalysisProps) {
  const [parsing, setParsing] = useState(true);
  const [parsingProgress, setParsingProgress] = useState(0);
  const [parsingStatus, setParsingStatus] = useState<string>("");
  const [ruleBasedAccounts, setRuleBasedAccounts] = useState<
    ExtractedAccount[]
  >([]);
  const [extractedAccounts, setExtractedAccounts] = useState<
    ExtractedAccount[]
  >([]);
  const [detectedItems, setDetectedItems] = useState<DetectedItem[]>([]);
  const [aiAnalysis, setAiAnalysis] = useState<AnalysisResult | null>(null);
  const [analyzing, setAnalyzing] = useState(false);
  const [error, setError] = useState<string>("");

  const parseFile = useCallback(async () => {
    setParsing(true);
    setParsingProgress(0);
    try {
      let accounts: ExtractedAccount[] = [];

      if (file.name.endsWith(".pdf")) {
        // PDF 파싱
        setParsingStatus("PDF 텍스트 추출 중...");
        const pdfText = await parsePDFFile(file, (progress) => {
          setParsingProgress(progress * 0.8);
        });

        setParsingStatus("계정 데이터 파싱 중...");
        const ruleAccounts = extractAccountsFromPDFText(pdfText);
        setRuleBasedAccounts(ruleAccounts);
        accounts = ruleAccounts;

        // 규칙 기반 감지
        const detected = detectItemsByRules(ruleAccounts);
        setDetectedItems(detected);

        setParsingProgress(100);
        setParsingStatus("파싱 완료");
      } else {
        // 엑셀 파일 처리
        setParsingStatus("엑셀 파일 분석 중...");
        accounts = await parseExcelFile(file);
        setRuleBasedAccounts(accounts);

        // 규칙 기반 감지
        const detected = detectItemsByRules(accounts);
        setDetectedItems(detected);

        setParsingProgress(100);
        setParsingStatus("파싱 완료");
      }

      setExtractedAccounts(accounts);

      // 파싱 완료 - 규칙 기반 결과 먼저 표시
      setParsing(false);
      setParsingProgress(0);
      setParsingStatus("");

      // AI 분석 자동 시작
      if (accounts.length > 0) {
        setAnalyzing(true);
        try {
          const analysis = await analyzeAccountsWithAI(
            accounts,
            sourceStandard,
            targetStandard
          );
          setAiAnalysis(analysis);

          // AI 분석 결과를 기존 계정에 병합
          // (AI가 추가로 찾은 계정이 있다면 추가)
          // 현재는 AI가 계정을 추가로 추출하지 않지만, 향후 확장 가능
        } catch (err) {
          console.error("AI 분석 오류:", err);
          setError("AI 분석 중 오류가 발생했습니다. 기본 파싱 결과로 계속 진행합니다.");
        } finally {
          setAnalyzing(false);
        }
      }
    } catch (err) {
      console.error("파일 파싱 오류:", err);
      setError(`파일 파싱 중 오류가 발생했습니다: ${err}`);
      setParsing(false);
      setParsingProgress(0);
      setParsingStatus("");
    }
  }, [file, sourceStandard, targetStandard]);

  useEffect(() => {
    parseFile();
  }, [parseFile]);

  const handleNext = () => {
    onNext({
      detectedItems,
      extractedAccounts,
    });
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        파일 분석
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        업로드된 파일을 분석하여 계정 정보를 추출합니다.
      </Typography>

      {/* 파싱 진행 중 */}
      {parsing && (
        <Paper
          elevation={0}
          sx={{ p: 4, border: "1px solid", borderColor: "divider", mb: 3 }}
        >
          <Box sx={{ textAlign: "center" }}>
            <CircularProgress size={60} sx={{ mb: 2 }} />
            <Typography variant="h6" gutterBottom>
              {parsingStatus}
            </Typography>
            {parsingProgress < 100 && (
              <Box sx={{ mt: 3, width: "100%", maxWidth: "400px", mx: "auto" }}>
                <LinearProgress variant="determinate" value={parsingProgress} />
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 1 }}
                >
                  {parsingProgress}%
                </Typography>
              </Box>
            )}
          </Box>
        </Paper>
      )}

      {/* 파싱 완료 - 규칙 기반 결과 */}
      {!parsing && ruleBasedAccounts.length > 0 && (
        <Paper
          elevation={0}
          sx={{ p: 3, border: "1px solid", borderColor: "divider", mb: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
            <CheckCircleIcon color="success" />
            <Typography variant="h6" fontWeight="bold">
              파일 파싱 완료
            </Typography>
          </Box>

          <Alert severity="success" sx={{ mb: 2 }}>
            <Typography variant="body2">
              총 {ruleBasedAccounts.length}개의 계정 항목을 발견했습니다.
            </Typography>
          </Alert>

          {detectedItems.length > 0 && (
            <Alert severity="info" sx={{ mt: 2 }}>
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

          {/* 파싱된 계정 미리보기 (처음 10개) */}
          <Box sx={{ mt: 3 }}>
            <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
              발견된 계정 항목 (미리보기):
            </Typography>
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
              {ruleBasedAccounts.slice(0, 10).map((acc, idx) => (
                <Chip key={idx} label={acc.accountName} size="small" />
              ))}
              {ruleBasedAccounts.length > 10 && (
                <Chip
                  label={`외 ${ruleBasedAccounts.length - 10}개`}
                  size="small"
                  variant="outlined"
                />
              )}
            </Box>
          </Box>
        </Paper>
      )}

      {/* AI 분석 진행 중 */}
      {analyzing && (
        <Paper
          elevation={0}
          sx={{ p: 3, border: "1px solid", borderColor: "divider", mb: 3 }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
            <CircularProgress size={24} />
            <Box>
              <Typography variant="body1" fontWeight="medium">
                AI가 파일 내용을 추가 분석하고 있습니다...
              </Typography>
              <Typography variant="body2" color="text.secondary">
                전환이 필요한 항목과 추가 고려사항을 확인 중입니다.
              </Typography>
            </Box>
          </Box>
        </Paper>
      )}

      {/* AI 분석 결과 */}
      {aiAnalysis && !analyzing && (
        <Paper
          elevation={0}
          sx={{ p: 3, border: "1px solid", borderColor: "divider", mb: 3 }}
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
                <Accordion
                  key={index}
                  elevation={0}
                  sx={{ border: "1px solid", borderColor: "divider" }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="medium">{item.category}</Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
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
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <AddCircleOutlineIcon color="success" />
                <Typography variant="subtitle1" fontWeight="bold">
                  추가로 고려해야 할 항목
                </Typography>
              </Box>
              {aiAnalysis.suggestedItems.map((item, index) => (
                <Accordion
                  key={index}
                  elevation={0}
                  sx={{
                    border: "1px solid",
                    borderColor: "success.main",
                    bgcolor: "success.50",
                  }}
                >
                  <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                    <Typography fontWeight="medium" color="success.dark">
                      {item.category}
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails>
                    <Alert severity="info" sx={{ mb: 2 }}>
                      <Typography
                        variant="body2"
                        fontWeight="bold"
                        gutterBottom
                      >
                        추가 이유:
                      </Typography>
                      <Typography variant="body2">{item.reason}</Typography>
                    </Alert>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      gutterBottom
                    >
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

      {/* 버튼 */}
      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Button onClick={onBack}>이전</Button>
        <Button
          size="large"
          onClick={handleNext}
          disabled={parsing || extractedAccounts.length === 0}
        >
          다음
        </Button>
      </Box>
    </Box>
  );
}
