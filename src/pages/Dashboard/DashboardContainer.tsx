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
import { useNavigate } from "react-router";
import DashboardPresenter from "./DashboardPresenter";

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

export default function DashboardContainer() {
  const navigate = useNavigate();

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

  const handleNewConversion = () => {
    navigate("/conversion");
  };

  const handleProjectClick = (project: Project) => {
    navigate(
      project.status === "completed"
        ? `/results/${project.id}`
        : `/conversion/${project.id}`
    );
  };

  return (
    <DashboardPresenter
      projects={projects}
      stats={stats}
      conversionTypeData={conversionTypeData}
      monthlyData={monthlyData}
      onNewConversion={handleNewConversion}
      onProjectClick={handleProjectClick}
    />
  );
}
