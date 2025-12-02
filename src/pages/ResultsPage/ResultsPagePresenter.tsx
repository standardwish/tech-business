import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CompareArrowsIcon from "@mui/icons-material/CompareArrows";
import DescriptionIcon from "@mui/icons-material/Description";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Divider,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Paper,
  Tab,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Tabs,
  Typography,
} from "@mui/material";
import AccountingTermTooltip from "@/components/AccountingTermTooltip";
import Layout from "@/components/Layout";
import AppTheme from "@/theme/shared-theme/AppTheme";
import CssBaseline from "@mui/material/CssBaseline";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function TabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ py: 3 }}>{children}</Box>}
    </div>
  );
}

interface ComparisonRow {
  category: string;
  kgaap: string;
  ifrs: string;
  difference: string;
  note: string;
}

interface ChecklistItem {
  item: string;
  completed: boolean;
}

interface ResultsPagePresenterProps {
  projectId: string | undefined;
  tabValue: number;
  comparisonData: ComparisonRow[];
  changes: string[];
  checklist: ChecklistItem[];
  onTabChange: (event: React.SyntheticEvent, newValue: number) => void;
  onPdfDownload: () => void;
  onExcelDownload: () => void;
  onBackToDashboard: () => void;
}

export default function ResultsPagePresenter({
  projectId,
  tabValue,
  comparisonData,
  changes,
  checklist,
  onTabChange,
  onPdfDownload,
  onExcelDownload,
  onBackToDashboard,
}: ResultsPagePresenterProps) {
  return (
    <AppTheme>
      <CssBaseline enableColorScheme />
      <Layout>
        <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box sx={{ mb: 4 }}>
          <Typography variant="h4" fontWeight="bold" gutterBottom>
            전환 결과 - 프로젝트 #{projectId}
          </Typography>
          <Typography variant="body1" color="text.secondary">
            K-GAAP에서 IFRS로의 전환이 완료되었습니다
          </Typography>
        </Box>

        <Box sx={{ display: "flex", gap: 2, mb: 4 }}>
          <Button
            variant="contained"
            startIcon={<DownloadIcon />}
            onClick={onPdfDownload}
          >
            PDF 다운로드
          </Button>
          <Button
            variant="outlined"
            startIcon={<DownloadIcon />}
            onClick={onExcelDownload}
          >
            Excel 다운로드
          </Button>
          <Button variant="outlined" onClick={onBackToDashboard}>
            대시보드로 돌아가기
          </Button>
        </Box>

        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs value={tabValue} onChange={onTabChange}>
            <Tab label="요약" />
            <Tab label="비교 분석" />
            <Tab label="변경사항" />
            <Tab label="검증 체크리스트" />
          </Tabs>
        </Box>

        <TabPanel value={tabValue} index={0}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "1fr 1fr" },
              gap: 3,
            }}
          >
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  전환 개요
                </Typography>
                <Divider sx={{ my: 2 }} />
                <Box sx={{ display: "flex", flexDirection: "column", gap: 2 }}>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      전환 기준일
                    </Typography>
                    <Typography variant="body1">2024년 12월 31일</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      전환 항목
                    </Typography>
                    <Typography variant="body1">7개 항목</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      처리 시간
                    </Typography>
                    <Typography variant="body1">약 5분</Typography>
                  </Box>
                  <Box>
                    <Typography variant="body2" color="text.secondary">
                      상태
                    </Typography>
                    <Chip label="완료" color="success" size="small" />
                  </Box>
                </Box>
              </CardContent>
            </Card>

            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  주요 변경사항
                </Typography>
                <Divider sx={{ my: 2 }} />
                <List dense>
                  {changes.slice(0, 5).map((change, index) => (
                    <ListItem key={index} disablePadding sx={{ py: 0.5 }}>
                      <ListItemIcon sx={{ minWidth: 36 }}>
                        <CheckCircleIcon color="success" fontSize="small" />
                      </ListItemIcon>
                      <ListItemText
                        primary={change}
                        primaryTypographyProps={{ variant: "body2" }}
                      />
                    </ListItem>
                  ))}
                </List>
              </CardContent>
            </Card>
          </Box>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <CompareArrowsIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  K-GAAP vs IFRS 비교
                </Typography>
              </Box>
              <TableContainer component={Paper} elevation={0}>
                <Table>
                  <TableHead>
                    <TableRow>
                      <TableCell>항목</TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          K-GAAP
                          <AccountingTermTooltip term="K-GAAP" />
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        <Box
                          sx={{
                            display: "inline-flex",
                            alignItems: "center",
                            gap: 0.5,
                          }}
                        >
                          IFRS
                          <AccountingTermTooltip term="IFRS" />
                        </Box>
                      </TableCell>
                      <TableCell align="right">차이</TableCell>
                      <TableCell>비고</TableCell>
                    </TableRow>
                  </TableHead>
                  <TableBody>
                    {comparisonData.map((row, index) => (
                      <TableRow key={index} hover>
                        <TableCell>{row.category}</TableCell>
                        <TableCell align="right">{row.kgaap}</TableCell>
                        <TableCell align="right" sx={{ fontWeight: "bold" }}>
                          {row.ifrs}
                        </TableCell>
                        <TableCell
                          align="right"
                          sx={{
                            color: row.difference.startsWith("+")
                              ? "success.main"
                              : "error.main",
                            fontWeight: "bold",
                          }}
                        >
                          {row.difference}
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" color="text.secondary">
                            {row.note}
                          </Typography>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Card>
            <CardContent>
              <Box
                sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}
              >
                <DescriptionIcon color="primary" />
                <Typography variant="h6" fontWeight="bold">
                  상세 변경사항
                </Typography>
              </Box>
              <List>
                {changes.map((change, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      <CheckCircleIcon color="success" />
                    </ListItemIcon>
                    <ListItemText
                      primary={change}
                      primaryTypographyProps={{ variant: "body1" }}
                    />
                  </ListItem>
                ))}
              </List>

              <Divider sx={{ my: 3 }} />

              <Typography variant="h6" fontWeight="bold" gutterBottom>
                회계 정책 주석
              </Typography>
              <Typography variant="body1" paragraph>
                당사는 2024년 12월 31일부터{" "}
                <AccountingTermTooltip term="IFRS">
                  <strong>국제회계기준(IFRS)</strong>
                </AccountingTermTooltip>
                을 적용하였습니다.
              </Typography>
              <Typography variant="body1" paragraph>
                유형자산은{" "}
                <AccountingTermTooltip term="재평가모형">
                  <strong>재평가모형</strong>
                </AccountingTermTooltip>
                을 적용하여 공정가치로 측정하였으며, 재평가잉여금은{" "}
                <AccountingTermTooltip term="OCI">
                  <strong>기타포괄손익(OCI)</strong>
                </AccountingTermTooltip>
                에 인식하였습니다.
              </Typography>
              <Typography variant="body1" paragraph>
                리스는{" "}
                <AccountingTermTooltip term="IFRS 16">
                  <strong>IFRS 16</strong>
                </AccountingTermTooltip>
                에 따라{" "}
                <AccountingTermTooltip term="사용권자산">
                  <strong>사용권자산</strong>
                </AccountingTermTooltip>
                과{" "}
                <AccountingTermTooltip term="리스부채">
                  <strong>리스부채</strong>
                </AccountingTermTooltip>
                를 인식하였습니다.
              </Typography>
            </CardContent>
          </Card>
        </TabPanel>

        <TabPanel value={tabValue} index={3}>
          <Card>
            <CardContent>
              <Typography variant="h6" fontWeight="bold" gutterBottom>
                전환 후 검증 체크리스트
              </Typography>
              <Divider sx={{ my: 2 }} />
              <List>
                {checklist.map((item, index) => (
                  <ListItem key={index}>
                    <ListItemIcon>
                      {item.completed ? (
                        <CheckCircleIcon color="success" />
                      ) : (
                        <CheckCircleIcon color="disabled" />
                      )}
                    </ListItemIcon>
                    <ListItemText
                      primary={item.item}
                      primaryTypographyProps={{
                        variant: "body1",
                        sx: {
                          textDecoration: item.completed
                            ? "line-through"
                            : "none",
                          color: item.completed
                            ? "text.secondary"
                            : "text.primary",
                        },
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </CardContent>
          </Card>
        </TabPanel>
      </Container>
    </Layout>
    </AppTheme>
  );
}
