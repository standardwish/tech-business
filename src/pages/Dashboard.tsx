import AddIcon from "@mui/icons-material/Add";
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import PendingActionsIcon from "@mui/icons-material/PendingActions";
import TrendingUpIcon from "@mui/icons-material/TrendingUp";
import {
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Container,
  Grid,
  LinearProgress,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import {
  ArcElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { useState } from "react";
import { Doughnut, Line } from "react-chartjs-2";
import { useNavigate } from "react-router";
import Layout from "../components/Layout";

ChartJS.register(
  ArcElement,
  Tooltip,
  Legend,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title
);

interface Project {
  id: number;
  name: string;
  date: string;
  status: "completed" | "in_progress" | "pending";
  type: string;
  progress: number;
}

export default function Dashboard() {
  const navigate = useNavigate();

  // Mock data
  const [projects] = useState<Project[]>([
    {
      id: 1,
      name: "2024년 재무제표 전환",
      date: "2025-11-20",
      status: "completed",
      type: "전체 전환",
      progress: 100,
    },
    {
      id: 2,
      name: "리스자산 IFRS 16 적용",
      date: "2025-11-25",
      status: "in_progress",
      type: "리스자산",
      progress: 65,
    },
    {
      id: 3,
      name: "수익인식 기준 전환",
      date: "2025-11-28",
      status: "pending",
      type: "수익인식",
      progress: 0,
    },
  ]);

  const stats = {
    total: 15,
    completed: 12,
    inProgress: 2,
    pending: 1,
  };

  const conversionTypeData = {
    labels: [
      "자산평가",
      "리스자산",
      "금융상품",
      "수익인식",
      "무형자산",
      "퇴직급여",
      "충당부채",
    ],
    datasets: [
      {
        label: "전환 건수",
        data: [5, 3, 2, 2, 1, 1, 1],
        backgroundColor: [
          "rgba(54, 162, 235, 0.8)",
          "rgba(255, 99, 132, 0.8)",
          "rgba(255, 206, 86, 0.8)",
          "rgba(75, 192, 192, 0.8)",
          "rgba(153, 102, 255, 0.8)",
          "rgba(255, 159, 64, 0.8)",
          "rgba(199, 199, 199, 0.8)",
        ],
      },
    ],
  };

  const monthlyData = {
    labels: ["7월", "8월", "9월", "10월", "11월"],
    datasets: [
      {
        label: "월별 전환 건수",
        data: [2, 3, 2, 4, 4],
        borderColor: "rgb(75, 192, 192)",
        backgroundColor: "rgba(75, 192, 192, 0.2)",
        tension: 0.3,
      },
    ],
  };

  const getStatusChip = (status: Project["status"]) => {
    switch (status) {
      case "completed":
        return <Chip label="완료" color="success" size="small" />;
      case "in_progress":
        return <Chip label="진행중" color="primary" size="small" />;
      case "pending":
        return <Chip label="대기중" color="default" size="small" />;
    }
  };

  return (
    <Layout>
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 4,
          }}
        >
          <Typography variant="h4" fontWeight="bold">
            대시보드
          </Typography>
          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={() => navigate("/conversion")}
            size="large"
          >
            새 전환 시작
          </Button>
        </Box>

        {/* Statistics Cards */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      gutterBottom
                    >
                      전체 프로젝트
                    </Typography>
                    <Typography variant="h4" fontWeight="bold">
                      {stats.total}
                    </Typography>
                  </Box>
                  <TrendingUpIcon
                    sx={{ fontSize: 50, color: "primary.main", opacity: 0.3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      gutterBottom
                    >
                      완료됨
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="success.main"
                    >
                      {stats.completed}
                    </Typography>
                  </Box>
                  <AssignmentTurnedInIcon
                    sx={{ fontSize: 50, color: "success.main", opacity: 0.3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      gutterBottom
                    >
                      진행중
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="primary.main"
                    >
                      {stats.inProgress}
                    </Typography>
                  </Box>
                  <PendingActionsIcon
                    sx={{ fontSize: 50, color: "primary.main", opacity: 0.3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, sm: 6, md: 3 }}>
            <Card>
              <CardContent>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                  }}
                >
                  <Box>
                    <Typography
                      color="text.secondary"
                      variant="body2"
                      gutterBottom
                    >
                      대기중
                    </Typography>
                    <Typography
                      variant="h4"
                      fontWeight="bold"
                      color="text.secondary"
                    >
                      {stats.pending}
                    </Typography>
                  </Box>
                  <PendingActionsIcon
                    sx={{ fontSize: 50, color: "text.secondary", opacity: 0.3 }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Charts */}
        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  전환 유형별 분포
                </Typography>
                <Box
                  sx={{
                    height: 300,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Doughnut
                    data={conversionTypeData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          position: "bottom",
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <Card>
              <CardContent>
                <Typography variant="h6" fontWeight="bold" gutterBottom>
                  월별 전환 추이
                </Typography>
                <Box sx={{ height: 300 }}>
                  <Line
                    data={monthlyData}
                    options={{
                      responsive: true,
                      maintainAspectRatio: false,
                      plugins: {
                        legend: {
                          display: false,
                        },
                      },
                      scales: {
                        y: {
                          beginAtZero: true,
                          ticks: {
                            stepSize: 1,
                          },
                        },
                      },
                    }}
                  />
                </Box>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        {/* Recent Projects Table */}
        <Card>
          <CardContent>
            <Typography variant="h6" fontWeight="bold" gutterBottom>
              최근 프로젝트
            </Typography>
            <TableContainer component={Paper} elevation={0}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>프로젝트명</TableCell>
                    <TableCell>유형</TableCell>
                    <TableCell>날짜</TableCell>
                    <TableCell>진행률</TableCell>
                    <TableCell>상태</TableCell>
                    <TableCell align="right">작업</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {projects.map((project) => (
                    <TableRow key={project.id} hover>
                      <TableCell>
                        <Typography fontWeight="medium">
                          {project.name}
                        </Typography>
                      </TableCell>
                      <TableCell>{project.type}</TableCell>
                      <TableCell>{project.date}</TableCell>
                      <TableCell>
                        <Box
                          sx={{ display: "flex", alignItems: "center", gap: 1 }}
                        >
                          <LinearProgress
                            variant="determinate"
                            value={project.progress}
                            sx={{ flexGrow: 1, height: 8, borderRadius: 1 }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            {project.progress}%
                          </Typography>
                        </Box>
                      </TableCell>
                      <TableCell>{getStatusChip(project.status)}</TableCell>
                      <TableCell align="right">
                        <Button
                          size="small"
                          variant="outlined"
                          onClick={() =>
                            navigate(
                              project.status === "completed"
                                ? `/results/${project.id}`
                                : `/conversion/${project.id}`
                            )
                          }
                        >
                          {project.status === "completed"
                            ? "결과 보기"
                            : "계속하기"}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </CardContent>
        </Card>
      </Container>
    </Layout>
  );
}
