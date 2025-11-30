// 회계 기준 타입
export type AccountingStandard = 'K-GAAP' | 'IFRS' | 'US-GAAP';

// 매핑 유형
export type MappingType = '1:1' | '집계' | '계산항목' | '조정필요';

// 계정 코드 매핑
export interface AccountMapping {
  internalCode: string;        // 내부표준코드 (예: 1001)
  internalName: string;         // 내부표준계정명 (예: 현금및현금성자산)
  kgaapCode?: string;          // K-GAAP 계정코드
  kgaapName?: string;          // K-GAAP 계정명
  ifrsCode: string;            // IFRS 계정코드
  usgaapCode: string;          // US-GAAP 계정코드
  mappingType: MappingType;    // 매핑 유형
  note?: string;               // 비고
}

// 조정 항목
export interface AdjustmentItem {
  reason: string;              // 조정발생원인
  beforeAmount: number;        // 조정전금액
  adjustmentName: string;      // 조정항목명
  adjustmentAmount: number;    // 조정금액
  afterAmount: number;         // 조정후금액
  note: string;                // 주석
}

// 엑셀에서 추출한 계정 항목
export interface ExtractedAccount {
  accountCode: string;         // 계정코드
  accountName: string;         // 계정명
  amount: number;              // 금액
  debit?: number;              // 차변 (선택적)
  credit?: number;             // 대변 (선택적)
}

// 변환된 계정 항목
export interface ConvertedAccount extends ExtractedAccount {
  internalCode: string;        // 내부표준코드
  internalName: string;        // 내부표준계정명
  targetCode: string;          // 목표 기준 계정코드 (IFRS 또는 US-GAAP)
  mappingType: MappingType;
  adjustments?: AdjustmentItem[]; // 조정 항목들
}

// 변환 입력 데이터
export interface ConversionInput {
  sourceStandard: AccountingStandard;  // 입력 기준
  targetStandard: AccountingStandard;  // 목표 기준
  file: File;                           // 엑셀 파일
  baseDate: string;                     // 기준일 (YYYY-MM-DD)
  exchangeRate?: number;                // 환율 (선택적, 자동 가져오기 가능)
}

// 변환 결과
export interface ConversionResult {
  accounts: ConvertedAccount[];         // 변환된 계정들
  adjustments: AdjustmentItem[];        // 전체 조정 항목들
  summary: {
    totalAccounts: number;
    totalAdjustments: number;
    conversionDate: string;
    sourceStandard: AccountingStandard;
    targetStandard: AccountingStandard;
  };
}

// 추가 세부정보 - 자산평가
export interface AssetValuationDetails {
  model: 'revaluation' | 'cost';        // 재평가모형 vs 원가모형
  fairValue?: number;                   // 공정가치 (재평가모형 선택시)
  depreciationMethod?: string;          // 감가상각 방법
  usefulLife?: number;                  // 내용연수
}

// 추가 세부정보 - 리스자산
export interface LeaseDetails {
  assetType: string;                    // 리스자산 종류
  leaseTerm: number;                    // 리스기간 (개월)
  discountRate: number;                 // 할인율 (리스 이자율)
  leasePayment: number;                 // 리스료
  paymentFrequency: 'monthly' | 'quarterly' | 'yearly'; // 지불 주기
}

// 추가 세부정보 - 금융상품/사채
export interface FinancialInstrumentDetails {
  instrumentType: 'convertible-bond' | 'bond' | 'other';
  issueDate: string;                    // 발행일
  maturityDate: string;                 // 만기일
  faceValue: number;                    // 액면가
  couponRate: number;                   // 표면이자율
  effectiveRate: number;                // 유효이자율
  conversionRatio?: number;             // 전환비율 (전환사채의 경우)
}

// 추가 세부정보 - 수익인식
export interface RevenueRecognitionDetails {
  contractId: string;                   // 계약 ID
  contractPeriod: {
    startDate: string;
    endDate: string;
  };
  deliveryTerms: string;                // 인도조건
  recognitionMethod: 'point-in-time' | 'over-time'; // 시점 vs 기간 인식
  performanceObligations?: string[];    // 수행의무
}

// 추가 세부정보 - 무형자산/개발비
export interface IntangibleAssetDetails {
  assetType: 'development' | 'patent' | 'software' | 'other';
  expenditures: number;                 // 지출금액
  capitalizationChecklist: {
    technicallyFeasible: boolean;       // 기술적 완성 가능
    intentionToComplete: boolean;       // 사용/판매 계획
    abilityToUse: boolean;              // 경제적 효익 기대
    resourcesAvailable: boolean;        // 필요 자원 확보
    reliableMeasurement: boolean;       // 신뢰성 있는 측정
  };
  usefulLife?: number;                  // 내용연수 (자산화시)
}

// 추가 세부정보 - 퇴직급여 충당부채
export interface RetirementBenefitDetails {
  actuarialReport?: File;               // 보험계리 보고서
  discountRate: number;                 // 할인율
  salaryIncreaseRate: number;           // 평균 임금상승률
  expectedServiceYears: number;         // 기대 근속연수
  currentObligation: number;            // 현재 확정급여채무
  planAssets: number;                   // 사외적립자산
}

// 추가 세부정보 - 충당부채
export interface ProvisionDetails {
  recognitionChecklist: {
    presentObligation: boolean;         // 현재 의무 존재
    probableOutflow: boolean;           // 자원유출 가능성 > 50%
    reliableEstimate: boolean;          // 신뢰성 있는 추정
  };
  scenarios: Array<{
    outcome: string;                    // 결과
    estimatedAmount: number;            // 예상 지출액
    probability: number;                // 발생 확률 (0-1)
  }>;
  settlementPeriod: number;             // 결제 예상 기간 (년)
  discountRate?: number;                // 할인율 (1년 이상인 경우)
}

// 전체 세부정보
export interface ConversionDetails {
  assetValuation?: AssetValuationDetails;
  lease?: LeaseDetails;
  financialInstruments?: FinancialInstrumentDetails;
  revenue?: RevenueRecognitionDetails;
  intangibleAsset?: IntangibleAssetDetails;
  retirementBenefit?: RetirementBenefitDetails;
  provision?: ProvisionDetails;
}