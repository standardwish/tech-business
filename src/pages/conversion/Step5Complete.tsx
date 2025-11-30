import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import DownloadIcon from "@mui/icons-material/Download";
import VisibilityIcon from "@mui/icons-material/Visibility";
import PictureAsPdfIcon from "@mui/icons-material/PictureAsPdf";
import {
  Box,
  Button,
  Card,
  CardContent,
  Typography,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Chip,
  Menu,
  MenuItem,
} from "@mui/material";
import { useNavigate } from "react-router";
import { ConversionResult } from "@/types/accounting";
import { exportFinancialStatement } from "@/utils/pdfExporter";
import { useState } from "react";

interface Step5Props {
  result: ConversionResult;
}

export default function Step5Complete({ result }: Step5Props) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const pdfMenuOpen = Boolean(anchorEl);

  const handleViewResults = () => {
    // 결과를 로컬 스토리지에 저장
    localStorage.setItem("latestConversionResult", JSON.stringify(result));
    navigate("/results/latest");
  };

  const handleDownloadReport = () => {
    // 보고서 다운로드 로직 (향후 구현)
    alert("보고서 다운로드 기능은 곧 추가됩니다.");
  };

  const handlePDFMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handlePDFMenuClose = () => {
    setAnchorEl(null);
  };

  const handleExportPDF = (format: 'ifrs-income' | 'ifrs-balance' | 'usgaap-income' | 'business-plan') => {
    const companyName = prompt('회사명을 입력하세요:', '(주)회사명') || '회사명';
    const baseDate = new Date().toISOString().split('T')[0];

    try {
      exportFinancialStatement(result, format, companyName, baseDate);
      handlePDFMenuClose();
    } catch (error) {
      console.error('PDF 내보내기 오류:', error);
      alert(`PDF 내보내기 중 오류가 발생했습니다: ${error}`);
    }
  };

  return (
    <Box>
      <Box sx={{ textAlign: "center", py: 4 }}>
        <CheckCircleIcon
          sx={{ fontSize: 100, color: "success.main", mb: 2 }}
        />
        <Typography variant="h4" gutterBottom fontWeight="bold">
          변환 완료!
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          회계 기준 변환이 성공적으로 완료되었습니다.
        </Typography>
      </Box>

      {/* 변환 요약 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            변환 요약
          </Typography>
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: 2 }}>
            <Box>
              <Typography variant="body2" color="text.secondary">
                변환된 계정
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {result.summary.totalAccounts}개
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                조정 항목
              </Typography>
              <Typography variant="h5" fontWeight="bold">
                {result.summary.totalAdjustments}개
              </Typography>
            </Box>
            <Box>
              <Typography variant="body2" color="text.secondary">
                변환 기준
              </Typography>
              <Typography variant="h6" fontWeight="bold">
                {result.summary.sourceStandard} → {result.summary.targetStandard}
              </Typography>
            </Box>
          </Box>
        </CardContent>
      </Card>

      {/* 주요 조정 항목 */}
      {result.adjustments.length > 0 && (
        <Card sx={{ mb: 3 }}>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              주요 조정 항목
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>조정 항목</TableCell>
                    <TableCell>발생 원인</TableCell>
                    <TableCell align="right">조정 금액</TableCell>
                    <TableCell>상태</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {result.adjustments.slice(0, 5).map((adjustment, index) => (
                    <TableRow key={index}>
                      <TableCell>{adjustment.adjustmentName}</TableCell>
                      <TableCell>{adjustment.reason}</TableCell>
                      <TableCell align="right">
                        {adjustment.adjustmentAmount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label="적용됨"
                          color="success"
                          size="small"
                        />
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
            {result.adjustments.length > 5 && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mt: 2, textAlign: "center" }}
              >
                그 외 {result.adjustments.length - 5}개 항목이 더 있습니다.
              </Typography>
            )}
          </CardContent>
        </Card>
      )}

      {/* 주요 변환 계정 미리보기 */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" fontWeight="bold" gutterBottom>
            변환된 계정 미리보기
          </Typography>
          <TableContainer component={Paper} elevation={0}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>계정명</TableCell>
                  <TableCell>내부코드</TableCell>
                  <TableCell>목표 기준 코드</TableCell>
                  <TableCell align="right">금액</TableCell>
                  <TableCell>매핑 유형</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {result.accounts
                  .filter(acc => acc.amount !== 0)
                  .slice(0, 5)
                  .map((account, index) => (
                    <TableRow key={index}>
                      <TableCell>{account.accountName}</TableCell>
                      <TableCell>{account.internalCode}</TableCell>
                      <TableCell>
                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 200,
                            overflow: "hidden",
                            textOverflow: "ellipsis",
                            whiteSpace: "nowrap",
                          }}
                        >
                          {account.targetCode}
                        </Typography>
                      </TableCell>
                      <TableCell align="right">
                        {account.amount.toLocaleString()}
                      </TableCell>
                      <TableCell>
                        <Chip
                          label={account.mappingType}
                          size="small"
                          color={
                            account.mappingType === "1:1"
                              ? "default"
                              : account.mappingType === "조정필요"
                              ? "warning"
                              : "info"
                          }
                        />
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* 액션 버튼 */}
      <Box
        sx={{
          display: "flex",
          gap: 2,
          justifyContent: "center",
          mt: 4,
        }}
      >
        <Button
          variant="contained"
          size="large"
          startIcon={<VisibilityIcon />}
          onClick={handleViewResults}
        >
          전체 결과 보기
        </Button>
        <Button
          variant="contained"
          size="large"
          color="success"
          startIcon={<PictureAsPdfIcon />}
          onClick={handlePDFMenuOpen}
        >
          PDF 내보내기
        </Button>
        <Menu
          anchorEl={anchorEl}
          open={pdfMenuOpen}
          onClose={handlePDFMenuClose}
        >
          <MenuItem onClick={() => handleExportPDF('ifrs-income')}>
            📊 IFRS 손익계산서
          </MenuItem>
          <MenuItem onClick={() => handleExportPDF('ifrs-balance')}>
            📈 IFRS 재무상태표 (대차대조표)
          </MenuItem>
          <MenuItem onClick={() => handleExportPDF('usgaap-income')}>
            🇺🇸 US-GAAP 손익계산서
          </MenuItem>
          <MenuItem onClick={() => handleExportPDF('business-plan')}>
            📋 사업계획 워크북
          </MenuItem>
        </Menu>
        <Button
          variant="outlined"
          size="large"
          startIcon={<DownloadIcon />}
          onClick={handleDownloadReport}
        >
          보고서 다운로드
        </Button>
      </Box>

      <Box sx={{ textAlign: "center", mt: 4 }}>
        <Button onClick={() => navigate("/dashboard")}>
          대시보드로 돌아가기
        </Button>
      </Box>
    </Box>
  );
}
