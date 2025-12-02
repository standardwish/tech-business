import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Alert,
  Box,
  Button,
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { useState } from "react";
import { ConversionDetails, ExtractedAccount } from "@/types/accounting";

interface Step3Props {
  selectedItems: string[];
  extractedAccounts: ExtractedAccount[];
  onNext: (details: ConversionDetails) => void;
  onBack: () => void;
}

export default function Step3Details({
  selectedItems,
  extractedAccounts,
  onNext,
  onBack,
}: Step3Props) {
  const [details, setDetails] = useState<ConversionDetails>({});
  const [expanded, setExpanded] = useState<string | false>(selectedItems[0] || false);

  const handleChange =
    (panel: string) => (_event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
    };

  const handleNext = () => {
    onNext(details);
  };

  // 계정 데이터를 포맷팅
  const formatAmount = (amount: number) => {
    return new Intl.NumberFormat("ko-KR").format(amount);
  };

  return (
    <Box>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        세부 정보 확인
      </Typography>
      <Typography variant="body2" color="text.secondary" sx={{ mb: 4 }}>
        추출된 계정 정보를 확인하고, 필요시 추가 정보를 입력해주세요.
      </Typography>

      {/* 추출된 계정 목록 표시 */}
      <Paper
        elevation={0}
        sx={{ p: 3, border: "1px solid", borderColor: "divider", mb: 3 }}
      >
        <Box sx={{ display: "flex", alignItems: "center", gap: 1, mb: 2 }}>
          <CheckCircleIcon color="success" />
          <Typography variant="h6" fontWeight="bold">
            추출된 계정 정보 ({extractedAccounts.length}개)
          </Typography>
        </Box>

        <TableContainer>
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>계정코드</TableCell>
                <TableCell>계정명</TableCell>
                <TableCell align="right">금액</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {extractedAccounts.slice(0, 20).map((account, index) => (
                <TableRow key={index}>
                  <TableCell>{account.accountCode || "-"}</TableCell>
                  <TableCell>{account.accountName}</TableCell>
                  <TableCell align="right">{formatAmount(account.amount)}</TableCell>
                </TableRow>
              ))}
              {extractedAccounts.length > 20 && (
                <TableRow>
                  <TableCell colSpan={3} align="center" sx={{ color: "text.secondary" }}>
                    외 {extractedAccounts.length - 20}개 항목
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      {/* 추가 정보 입력 (필요시) */}
      <Alert severity="info" sx={{ mb: 3 }}>
        변환에 필요한 추가 정보가 있다면 아래 항목을 클릭하여 입력하세요.
      </Alert>

      {/* 자산평가 */}
      {selectedItems.includes("asset-valuation") && (
        <Accordion
          expanded={expanded === "asset-valuation"}
          onChange={handleChange("asset-valuation")}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">자산평가</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>평가 모형</InputLabel>
              <Select
                value={details.assetValuation?.model || ""}
                label="평가 모형"
                onChange={(e) =>
                  setDetails({
                    ...details,
                    assetValuation: {
                      ...details.assetValuation,
                      model: e.target.value as "revaluation" | "cost",
                    },
                  })
                }
              >
                <MenuItem value="cost">원가모형</MenuItem>
                <MenuItem value="revaluation">재평가모형</MenuItem>
              </Select>
            </FormControl>

            {details.assetValuation?.model === "revaluation" && (
              <>
                <TextField
                  fullWidth
                  label="공정가치"
                  type="number"
                  sx={{ mb: 2 }}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      assetValuation: {
                        ...details.assetValuation!,
                        fairValue: parseFloat(e.target.value),
                      },
                    })
                  }
                />
                <TextField
                  fullWidth
                  label="감가상각 방법"
                  sx={{ mb: 2 }}
                  onChange={(e) =>
                    setDetails({
                      ...details,
                      assetValuation: {
                        ...details.assetValuation!,
                        depreciationMethod: e.target.value,
                      },
                    })
                  }
                />
              </>
            )}

            <TextField
              fullWidth
              label="내용연수 (년)"
              type="number"
              onChange={(e) =>
                setDetails({
                  ...details,
                  assetValuation: {
                    ...details.assetValuation!,
                    usefulLife: parseInt(e.target.value),
                  },
                })
              }
            />
          </AccordionDetails>
        </Accordion>
      )}

      {/* 리스자산 */}
      {selectedItems.includes("lease") && (
        <Accordion
          expanded={expanded === "lease"}
          onChange={handleChange("lease")}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">리스자산</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              label="리스자산 종류"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  lease: {
                    ...details.lease!,
                    assetType: e.target.value,
                    leaseTerm: details.lease?.leaseTerm || 0,
                    discountRate: details.lease?.discountRate || 0,
                    leasePayment: details.lease?.leasePayment || 0,
                    paymentFrequency: details.lease?.paymentFrequency || "monthly",
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="리스기간 (개월)"
              type="number"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  lease: {
                    ...details.lease!,
                    leaseTerm: parseInt(e.target.value),
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="할인율 (리스 이자율, %)"
              type="number"
              inputProps={{ step: 0.01 }}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  lease: {
                    ...details.lease!,
                    discountRate: parseFloat(e.target.value) / 100,
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="리스료"
              type="number"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  lease: {
                    ...details.lease!,
                    leasePayment: parseFloat(e.target.value),
                  },
                })
              }
            />
            <FormControl fullWidth>
              <InputLabel>지불 주기</InputLabel>
              <Select
                value={details.lease?.paymentFrequency || "monthly"}
                label="지불 주기"
                onChange={(e) =>
                  setDetails({
                    ...details,
                    lease: {
                      ...details.lease!,
                      paymentFrequency: e.target.value as
                        | "monthly"
                        | "quarterly"
                        | "yearly",
                    },
                  })
                }
              >
                <MenuItem value="monthly">월별</MenuItem>
                <MenuItem value="quarterly">분기별</MenuItem>
                <MenuItem value="yearly">연별</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      )}

      {/* 금융상품 및 사채 */}
      {selectedItems.includes("financial-instruments") && (
        <Accordion
          expanded={expanded === "financial-instruments"}
          onChange={handleChange("financial-instruments")}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">금융상품 및 사채</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>금융상품 종류</InputLabel>
              <Select
                value={details.financialInstruments?.instrumentType || ""}
                label="금융상품 종류"
                onChange={(e) =>
                  setDetails({
                    ...details,
                    financialInstruments: {
                      ...details.financialInstruments!,
                      instrumentType: e.target.value as
                        | "convertible-bond"
                        | "bond"
                        | "other",
                      issueDate: details.financialInstruments?.issueDate || "",
                      maturityDate: details.financialInstruments?.maturityDate || "",
                      faceValue: details.financialInstruments?.faceValue || 0,
                      couponRate: details.financialInstruments?.couponRate || 0,
                      effectiveRate: details.financialInstruments?.effectiveRate || 0,
                    },
                  })
                }
              >
                <MenuItem value="bond">사채</MenuItem>
                <MenuItem value="convertible-bond">전환사채</MenuItem>
                <MenuItem value="other">기타</MenuItem>
              </Select>
            </FormControl>
            <TextField
              fullWidth
              label="발행일"
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  financialInstruments: {
                    ...details.financialInstruments!,
                    issueDate: e.target.value,
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="만기일"
              type="date"
              InputLabelProps={{ shrink: true }}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  financialInstruments: {
                    ...details.financialInstruments!,
                    maturityDate: e.target.value,
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="액면가"
              type="number"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  financialInstruments: {
                    ...details.financialInstruments!,
                    faceValue: parseFloat(e.target.value),
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="표면이자율 (%)"
              type="number"
              inputProps={{ step: 0.01 }}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  financialInstruments: {
                    ...details.financialInstruments!,
                    couponRate: parseFloat(e.target.value) / 100,
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="유효이자율 (%)"
              type="number"
              inputProps={{ step: 0.01 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  financialInstruments: {
                    ...details.financialInstruments!,
                    effectiveRate: parseFloat(e.target.value) / 100,
                  },
                })
              }
            />
          </AccordionDetails>
        </Accordion>
      )}

      {/* 수익인식 */}
      {selectedItems.includes("revenue") && (
        <Accordion
          expanded={expanded === "revenue"}
          onChange={handleChange("revenue")}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">수익인식</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              label="계약 ID"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  revenue: {
                    ...details.revenue!,
                    contractId: e.target.value,
                    contractPeriod: details.revenue?.contractPeriod || {
                      startDate: "",
                      endDate: "",
                    },
                    deliveryTerms: details.revenue?.deliveryTerms || "",
                    recognitionMethod: details.revenue?.recognitionMethod || "point-in-time",
                  },
                })
              }
            />
            <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 2, mb: 2 }}>
              <TextField
                label="계약 시작일"
                type="date"
                InputLabelProps={{ shrink: true }}
                onChange={(e) =>
                  setDetails({
                    ...details,
                    revenue: {
                      ...details.revenue!,
                      contractPeriod: {
                        startDate: e.target.value,
                        endDate: details.revenue?.contractPeriod?.endDate || "",
                      },
                    },
                  })
                }
              />
              <TextField
                label="계약 종료일"
                type="date"
                InputLabelProps={{ shrink: true }}
                onChange={(e) =>
                  setDetails({
                    ...details,
                    revenue: {
                      ...details.revenue!,
                      contractPeriod: {
                        startDate: details.revenue?.contractPeriod?.startDate || "",
                        endDate: e.target.value,
                      },
                    },
                  })
                }
              />
            </Box>
            <TextField
              fullWidth
              label="인도 조건"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  revenue: {
                    ...details.revenue!,
                    deliveryTerms: e.target.value,
                  },
                })
              }
            />
            <FormControl fullWidth>
              <InputLabel>수익인식 방식</InputLabel>
              <Select
                value={details.revenue?.recognitionMethod || "point-in-time"}
                label="수익인식 방식"
                onChange={(e) =>
                  setDetails({
                    ...details,
                    revenue: {
                      ...details.revenue!,
                      recognitionMethod: e.target.value as
                        | "point-in-time"
                        | "over-time",
                    },
                  })
                }
              >
                <MenuItem value="point-in-time">시점 인식</MenuItem>
                <MenuItem value="over-time">기간 인식</MenuItem>
              </Select>
            </FormControl>
          </AccordionDetails>
        </Accordion>
      )}

      {/* 무형자산/개발비 */}
      {selectedItems.includes("intangible") && (
        <Accordion
          expanded={expanded === "intangible"}
          onChange={handleChange("intangible")}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">무형자산/개발비</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <FormControl fullWidth sx={{ mb: 2 }}>
              <InputLabel>자산 종류</InputLabel>
              <Select
                value={details.intangibleAsset?.assetType || ""}
                label="자산 종류"
                onChange={(e) =>
                  setDetails({
                    ...details,
                    intangibleAsset: {
                      ...details.intangibleAsset!,
                      assetType: e.target.value as "development" | "patent" | "software" | "other",
                      expenditures: details.intangibleAsset?.expenditures || 0,
                      capitalizationChecklist:
                        details.intangibleAsset?.capitalizationChecklist || {
                          technicallyFeasible: false,
                          intentionToComplete: false,
                          abilityToUse: false,
                          resourcesAvailable: false,
                          reliableMeasurement: false,
                        },
                    },
                  })
                }
              >
                <MenuItem value="development">개발비</MenuItem>
                <MenuItem value="patent">특허권</MenuItem>
                <MenuItem value="software">소프트웨어</MenuItem>
                <MenuItem value="other">기타</MenuItem>
              </Select>
            </FormControl>

            <TextField
              fullWidth
              label="지출 금액"
              type="number"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  intangibleAsset: {
                    ...details.intangibleAsset!,
                    expenditures: parseFloat(e.target.value),
                  },
                })
              }
            />

            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              자산화 조건 체크리스트
            </Typography>
            <FormGroup sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      details.intangibleAsset?.capitalizationChecklist
                        ?.technicallyFeasible || false
                    }
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        intangibleAsset: {
                          ...details.intangibleAsset!,
                          capitalizationChecklist: {
                            ...details.intangibleAsset!.capitalizationChecklist!,
                            technicallyFeasible: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
                label="기술적으로 완성 가능하다"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      details.intangibleAsset?.capitalizationChecklist
                        ?.intentionToComplete || false
                    }
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        intangibleAsset: {
                          ...details.intangibleAsset!,
                          capitalizationChecklist: {
                            ...details.intangibleAsset!.capitalizationChecklist!,
                            intentionToComplete: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
                label="회사가 사용/판매할 계획이 있다"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      details.intangibleAsset?.capitalizationChecklist
                        ?.abilityToUse || false
                    }
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        intangibleAsset: {
                          ...details.intangibleAsset!,
                          capitalizationChecklist: {
                            ...details.intangibleAsset!.capitalizationChecklist!,
                            abilityToUse: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
                label="시장에서 경제적 효익이 기대된다"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      details.intangibleAsset?.capitalizationChecklist
                        ?.resourcesAvailable || false
                    }
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        intangibleAsset: {
                          ...details.intangibleAsset!,
                          capitalizationChecklist: {
                            ...details.intangibleAsset!.capitalizationChecklist!,
                            resourcesAvailable: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
                label="개발 완성에 필요한 자원이 확보되었다"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      details.intangibleAsset?.capitalizationChecklist
                        ?.reliableMeasurement || false
                    }
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        intangibleAsset: {
                          ...details.intangibleAsset!,
                          capitalizationChecklist: {
                            ...details.intangibleAsset!.capitalizationChecklist!,
                            reliableMeasurement: e.target.checked,
                          },
                        },
                      })
                    }
                  />
                }
                label="개발비를 신뢰성 있게 측정할 수 있다"
              />
            </FormGroup>

            <TextField
              fullWidth
              label="내용연수 (년)"
              type="number"
              onChange={(e) =>
                setDetails({
                  ...details,
                  intangibleAsset: {
                    ...details.intangibleAsset!,
                    usefulLife: parseInt(e.target.value),
                  },
                })
              }
            />
          </AccordionDetails>
        </Accordion>
      )}

      {/* 퇴직급여 충당부채 */}
      {selectedItems.includes("retirement") && (
        <Accordion
          expanded={expanded === "retirement"}
          onChange={handleChange("retirement")}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">퇴직급여 충당부채</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <TextField
              fullWidth
              label="할인율 (%)"
              type="number"
              inputProps={{ step: 0.01 }}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  retirementBenefit: {
                    ...details.retirementBenefit!,
                    discountRate: parseFloat(e.target.value) / 100,
                    salaryIncreaseRate: details.retirementBenefit?.salaryIncreaseRate || 0,
                    expectedServiceYears: details.retirementBenefit?.expectedServiceYears || 0,
                    currentObligation: details.retirementBenefit?.currentObligation || 0,
                    planAssets: details.retirementBenefit?.planAssets || 0,
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="평균 임금상승률 (%)"
              type="number"
              inputProps={{ step: 0.01 }}
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  retirementBenefit: {
                    ...details.retirementBenefit!,
                    salaryIncreaseRate: parseFloat(e.target.value) / 100,
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="기대 근속연수 (년)"
              type="number"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  retirementBenefit: {
                    ...details.retirementBenefit!,
                    expectedServiceYears: parseInt(e.target.value),
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="현재 확정급여채무"
              type="number"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  retirementBenefit: {
                    ...details.retirementBenefit!,
                    currentObligation: parseFloat(e.target.value),
                  },
                })
              }
            />
            <TextField
              fullWidth
              label="사외적립자산"
              type="number"
              onChange={(e) =>
                setDetails({
                  ...details,
                  retirementBenefit: {
                    ...details.retirementBenefit!,
                    planAssets: parseFloat(e.target.value),
                  },
                })
              }
            />
          </AccordionDetails>
        </Accordion>
      )}

      {/* 충당부채 */}
      {selectedItems.includes("provisions") && (
        <Accordion
          expanded={expanded === "provisions"}
          onChange={handleChange("provisions")}
          sx={{ mb: 2 }}
        >
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography fontWeight="bold">충당부채</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              인식 조건 체크리스트
            </Typography>
            <FormGroup sx={{ mb: 2 }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      details.provision?.recognitionChecklist?.presentObligation ||
                      false
                    }
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        provision: {
                          recognitionChecklist: {
                            presentObligation: e.target.checked,
                            probableOutflow:
                              details.provision?.recognitionChecklist?.probableOutflow ||
                              false,
                            reliableEstimate:
                              details.provision?.recognitionChecklist?.reliableEstimate ||
                              false,
                          },
                          scenarios: details.provision?.scenarios || [],
                          settlementPeriod: details.provision?.settlementPeriod || 0,
                        },
                      })
                    }
                  />
                }
                label="과거 사건의 결과로 현재의 법적의무 또는 의제의무가 존재한다"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      details.provision?.recognitionChecklist?.probableOutflow ||
                      false
                    }
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        provision: {
                          recognitionChecklist: {
                            presentObligation:
                              details.provision?.recognitionChecklist?.presentObligation ||
                              false,
                            probableOutflow: e.target.checked,
                            reliableEstimate:
                              details.provision?.recognitionChecklist?.reliableEstimate ||
                              false,
                          },
                          scenarios: details.provision?.scenarios || [],
                          settlementPeriod: details.provision?.settlementPeriod || 0,
                        },
                      })
                    }
                  />
                }
                label="해당 의무를 이행하기 위해 경제적 효익이 있는 자원이 유출될 가능성이 높다 (>50%)"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={
                      details.provision?.recognitionChecklist?.reliableEstimate ||
                      false
                    }
                    onChange={(e) =>
                      setDetails({
                        ...details,
                        provision: {
                          recognitionChecklist: {
                            presentObligation:
                              details.provision?.recognitionChecklist?.presentObligation ||
                              false,
                            probableOutflow:
                              details.provision?.recognitionChecklist?.probableOutflow ||
                              false,
                            reliableEstimate: e.target.checked,
                          },
                          scenarios: details.provision?.scenarios || [],
                          settlementPeriod: details.provision?.settlementPeriod || 0,
                        },
                      })
                    }
                  />
                }
                label="의무 이행에 필요한 금액을 신뢰성 있게 추정할 수 있다"
              />
            </FormGroup>

            <TextField
              fullWidth
              label="결제 예상 기간 (년)"
              type="number"
              sx={{ mb: 2 }}
              onChange={(e) =>
                setDetails({
                  ...details,
                  provision: {
                    ...details.provision!,
                    settlementPeriod: parseInt(e.target.value),
                  },
                })
              }
            />

            {(details.provision?.settlementPeriod || 0) > 1 && (
              <TextField
                fullWidth
                label="할인율 (%)"
                type="number"
                inputProps={{ step: 0.01 }}
                sx={{ mb: 2 }}
                onChange={(e) =>
                  setDetails({
                    ...details,
                    provision: {
                      ...details.provision!,
                      discountRate: parseFloat(e.target.value) / 100,
                    },
                  })
                }
              />
            )}

            <Alert severity="info" sx={{ mt: 2 }}>
              시나리오별 예상 금액은 다음 단계에서 입력할 수 있습니다.
            </Alert>
          </AccordionDetails>
        </Accordion>
      )}

      <Box sx={{ display: "flex", justifyContent: "space-between", mt: 4 }}>
        <Button onClick={onBack}>이전</Button>
        <Button variant="contained" onClick={handleNext}>
          다음
        </Button>
      </Box>
    </Box>
  );
}
