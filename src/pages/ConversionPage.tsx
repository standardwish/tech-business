import { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Stepper,
  Step,
  StepLabel,
  Button,
  Paper,
  Card,
  CardContent,
  LinearProgress,
  Alert,
  Stack,
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useNavigate } from 'react-router';
import Layout from '../components/Layout';

const steps = ['파일 업로드', '전환 항목 선택', '세부 정보 입력', '전환 실행', '완료'];

export default function ConversionPage() {
  const navigate = useNavigate();
  const [activeStep, setActiveStep] = useState(0);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [selectedConversions, setSelectedConversions] = useState<string[]>([]);
  const [converting, setConverting] = useState(false);
  const [conversionProgress, setConversionProgress] = useState(0);

  const conversions = [
    { id: 'asset-valuation', name: '자산평가', description: '재평가모형 vs 원가모형' },
    { id: 'lease', name: '리스자산', description: 'IFRS 16 적용' },
    { id: 'financial-instruments', name: '금융상품 및 사채', description: '유효이자율법' },
    { id: 'revenue', name: '수익인식', description: 'IFRS 15' },
    { id: 'intangible', name: '무형자산/개발비', description: '자산화 조건 확인' },
    { id: 'retirement', name: '퇴직급여 충당부채', description: '확정급여평가' },
    { id: 'provisions', name: '충당부채', description: '인식 기준' },
  ];

  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1);
  };

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1);
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setUploadedFile(file);
    }
  };

  const toggleConversion = (id: string) => {
    setSelectedConversions((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleStartConversion = () => {
    setConverting(true);
    // Simulate conversion progress
    let progress = 0;
    const interval = setInterval(() => {
      progress += 10;
      setConversionProgress(progress);
      if (progress >= 100) {
        clearInterval(interval);
        setConverting(false);
        handleNext();
      }
    }, 500);
  };

  const renderStepContent = (step: number) => {
    switch (step) {
      case 0:
        return (
          <Paper elevation={0} sx={{ p: 4, border: '2px dashed', borderColor: 'divider' }}>
            <Box sx={{ textAlign: 'center' }}>
              <CloudUploadIcon sx={{ fontSize: 80, color: 'primary.main', mb: 2 }} />
              <Typography variant="h6" gutterBottom>
                재무제표 파일 업로드
              </Typography>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
                Excel(.xlsx, .xls) 또는 PDF 파일을 업로드하세요
              </Typography>
              <Button variant="contained" component="label">
                파일 선택
                <input type="file" hidden accept=".xlsx,.xls,.pdf" onChange={handleFileUpload} />
              </Button>
              {uploadedFile && (
                <Alert severity="success" sx={{ mt: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                    <CheckCircleIcon />
                    <Typography>{uploadedFile.name} 업로드 완료</Typography>
                  </Box>
                </Alert>
              )}
            </Box>
          </Paper>
        );

      case 1:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              전환할 항목을 선택하세요
            </Typography>
            <Typography variant="body2" color="text.secondary" sx={{ mb: 3 }}>
              여러 항목을 선택할 수 있습니다
            </Typography>
            <Box sx={{ display: 'grid', gridTemplateColumns: { xs: '1fr', sm: '1fr 1fr', md: '1fr 1fr 1fr' }, gap: 2 }}>
              {conversions.map((conversion) => (
                <Card
                  key={conversion.id}
                  sx={{
                    cursor: 'pointer',
                    border: 2,
                    borderColor: selectedConversions.includes(conversion.id)
                      ? 'primary.main'
                      : 'transparent',
                    transition: 'all 0.2s',
                    '&:hover': {
                      borderColor: 'primary.light',
                      transform: 'translateY(-4px)',
                    },
                  }}
                  onClick={() => toggleConversion(conversion.id)}
                >
                  <CardContent>
                    <Typography variant="h6" gutterBottom>
                      {conversion.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {conversion.description}
                    </Typography>
                  </CardContent>
                </Card>
              ))}
            </Box>
          </Box>
        );

      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              선택한 항목: {selectedConversions.length}개
            </Typography>
            <Alert severity="info" sx={{ mb: 3 }}>
              선택한 각 항목에 대해 세부 정보를 입력해야 합니다. 다음 단계에서 각 항목별 입력 폼이
              제공됩니다.
            </Alert>
            <Typography variant="body1">
              선택한 전환 항목:
            </Typography>
            <Box component="ul">
              {selectedConversions.map((id) => {
                const conversion = conversions.find((c) => c.id === id);
                return (
                  <li key={id}>
                    <Typography variant="body1">
                      {conversion?.name} - {conversion?.description}
                    </Typography>
                  </li>
                );
              })}
            </Box>
          </Box>
        );

      case 3:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              전환을 시작할 준비가 되었습니다
            </Typography>
            {converting ? (
              <Box sx={{ my: 4 }}>
                <Typography variant="body1" gutterBottom>
                  AI가 회계 기준을 전환하고 있습니다...
                </Typography>
                <LinearProgress variant="determinate" value={conversionProgress} sx={{ my: 2 }} />
                <Typography variant="body2" color="text.secondary" align="center">
                  {conversionProgress}% 완료
                </Typography>
              </Box>
            ) : (
              <Box>
                <Typography variant="body1" color="text.secondary" sx={{ mb: 3 }}>
                  업로드한 파일을 분석하고 선택한 항목에 대해 IFRS 기준으로 전환합니다.
                </Typography>
                <Button
                  variant="contained"
                  size="large"
                  onClick={handleStartConversion}
                  disabled={converting}
                >
                  전환 시작
                </Button>
              </Box>
            )}
          </Box>
        );

      case 4:
        return (
          <Box sx={{ textAlign: 'center', py: 4 }}>
            <CheckCircleIcon sx={{ fontSize: 100, color: 'success.main', mb: 2 }} />
            <Typography variant="h4" gutterBottom fontWeight="bold">
              전환 완료!
            </Typography>
            <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
              회계 기준 전환이 성공적으로 완료되었습니다.
            </Typography>
            <Button
              variant="contained"
              size="large"
              onClick={() => navigate('/results/1')}
            >
              결과 보기
            </Button>
          </Box>
        );

      default:
        return null;
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Typography variant="h4" fontWeight="bold" gutterBottom>
          회계 기준 전환
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          K-GAAP에서 IFRS로 전환하는 과정을 안내합니다
        </Typography>

        <Stepper activeStep={activeStep} sx={{ mb: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <Paper elevation={2} sx={{ p: 4, mb: 4 }}>
          {renderStepContent(activeStep)}
        </Paper>

        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          <Button
            disabled={activeStep === 0 || activeStep === steps.length - 1}
            onClick={handleBack}
          >
            이전
          </Button>
          <Button
            variant="contained"
            onClick={handleNext}
            disabled={
              (activeStep === 0 && !uploadedFile) ||
              (activeStep === 1 && selectedConversions.length === 0) ||
              activeStep === steps.length - 1 ||
              converting
            }
          >
            {activeStep === steps.length - 2 ? '완료' : '다음'}
          </Button>
        </Box>
      </Container>
    </Layout>
  );
}
