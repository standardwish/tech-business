import { Box, Card, CardContent, Typography, Chip } from "@mui/material";
import { useState, useMemo } from "react";
import { DetectedItem } from "@/utils/itemDetector";

interface ConversionItem {
  id: string;
  name: string;
  description: string;
  required?: boolean;
}

const CONVERSION_ITEMS: ConversionItem[] = [
  {
    id: "asset-valuation",
    name: "자산평가",
    description: "재평가모형 vs 원가모형 선택 및 유형자산 평가",
  },
  {
    id: "lease",
    name: "리스자산",
    description: "IFRS 16 적용 - 사용권자산 및 리스부채 인식",
  },
  {
    id: "financial-instruments",
    name: "금융상품 및 사채",
    description: "유효이자율법 적용 및 전환사채 처리",
  },
  {
    id: "revenue",
    name: "수익인식",
    description: "IFRS 15 - 시점 인식 vs 기간 인식 구분",
  },
  {
    id: "intangible",
    name: "무형자산/개발비",
    description: "개발비 자산화 조건 검토 및 상각",
  },
  {
    id: "retirement",
    name: "퇴직급여 충당부채",
    description: "확정급여채무 보험수리적 평가",
  },
  {
    id: "provisions",
    name: "충당부채",
    description: "인식 조건 검토 및 현재가치 평가",
  },
];

interface Step2Props {
  detectedItems: DetectedItem[];
  onNext: (selectedItems: string[]) => void;
  onBack: () => void;
}

export default function Step2SelectItems({ detectedItems, onNext, onBack }: Step2Props) {
  // 자동으로 감지된 항목 ID들을 메모이제이션
  const autoDetectedIds = useMemo(
    () => detectedItems.map(item => item.id),
    [detectedItems]
  );

  // 감지된 항목을 자동으로 선택 (초기 상태로 설정)
  const [selectedItems, setSelectedItems] = useState<string[]>(autoDetectedIds);

  const toggleItem = (id: string) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleNext = () => {
    onNext(selectedItems);
  };

  // 항목이 자동 감지되었는지 확인
  const isAutoDetected = (itemId: string) => {
    return detectedItems.some(item => item.id === itemId);
  };

  // 감지 사유 가져오기
  const getDetectionReason = (itemId: string) => {
    const detected = detectedItems.find(item => item.id === itemId);
    return detected?.reason;
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        전환 항목 선택
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
        회계 기준 변환 시 필요한 항목을 선택해주세요. 여러 항목을 선택할 수
        있습니다.
      </Typography>
      {detectedItems.length > 0 && (
        <Box sx={{ mb: 3, p: 2, bgcolor: "info.lighter", borderRadius: 1 }}>
          <Typography variant="body2" color="info.dark" fontWeight="bold">
            ✨ AI가 {detectedItems.length}개 항목을 자동으로 감지하여 선택했습니다.
          </Typography>
        </Box>
      )}

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "1fr 1fr",
            md: "1fr 1fr 1fr",
          },
          gap: 2,
          mb: 4,
        }}
      >
        {CONVERSION_ITEMS.map((item) => (
          <Card
            key={item.id}
            sx={{
              cursor: "pointer",
              border: 2,
              borderColor: selectedItems.includes(item.id)
                ? "primary.main"
                : "transparent",
              transition: "all 0.2s",
              "&:hover": {
                borderColor: "primary.light",
                transform: "translateY(-4px)",
                boxShadow: 3,
              },
            }}
            onClick={() => toggleItem(item.id)}
          >
            <CardContent>
              <Box
                sx={{
                  display: "flex",
                  alignItems: "flex-start",
                  justifyContent: "space-between",
                  mb: 1,
                }}
              >
                <Box sx={{ flex: 1 }}>
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 0.5 }}>
                    <Typography variant="h6" fontWeight="bold">
                      {item.name}
                    </Typography>
                    {isAutoDetected(item.id) && (
                      <Chip
                        label="자동 감지"
                        size="small"
                        color="primary"
                        sx={{ height: 20, fontSize: 10 }}
                      />
                    )}
                  </Box>
                </Box>
                {selectedItems.includes(item.id) && (
                  <Box
                    sx={{
                      width: 24,
                      height: 24,
                      borderRadius: "50%",
                      bgcolor: "primary.main",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      color: "white",
                      fontSize: 16,
                      flexShrink: 0,
                    }}
                  >
                    ✓
                  </Box>
                )}
              </Box>
              <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                {item.description}
              </Typography>
              {isAutoDetected(item.id) && (
                <Typography variant="caption" color="info.main" sx={{ fontStyle: "italic" }}>
                  📋 {getDetectionReason(item.id)}
                </Typography>
              )}
            </CardContent>
          </Card>
        ))}
      </Box>

      <Box
        sx={{
          p: 2,
          bgcolor: "action.hover",
          borderRadius: 1,
          mb: 3,
        }}
      >
        <Typography variant="body2" fontWeight="bold">
          선택된 항목: {selectedItems.length}개
        </Typography>
        {selectedItems.length > 0 && (
          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
            {selectedItems
              .map(
                (id) => CONVERSION_ITEMS.find((item) => item.id === id)?.name
              )
              .join(", ")}
          </Typography>
        )}
      </Box>

      <Box sx={{ display: "flex", justifyContent: "space-between" }}>
        <Box
          component="button"
          onClick={onBack}
          sx={{
            px: 3,
            py: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 1,
            bgcolor: "transparent",
            cursor: "pointer",
            "&:hover": {
              bgcolor: "action.hover",
            },
          }}
        >
          이전
        </Box>
        <Box
          component="button"
          onClick={handleNext}
          disabled={selectedItems.length === 0}
          sx={{
            px: 3,
            py: 1,
            border: "none",
            borderRadius: 1,
            bgcolor: selectedItems.length === 0 ? "action.disabledBackground" : "primary.main",
            color: "white",
            cursor: selectedItems.length === 0 ? "not-allowed" : "pointer",
            "&:hover": {
              bgcolor: selectedItems.length === 0 ? "action.disabledBackground" : "primary.dark",
            },
          }}
        >
          다음
        </Box>
      </Box>
    </Box>
  );
}
