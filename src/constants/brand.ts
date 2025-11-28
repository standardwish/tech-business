/**
 * 브랜드 관련 상수
 * 제품명이나 회사 정보를 변경할 때 이 파일만 수정하면 전체 앱에 반영됩니다.
 */

export const BRAND = {
  // 제품명
  APP_NAME: 'StandardShift',
  APP_NAME_KR: '스탠다드시프트',

  // 태그라인
  TAGLINE: 'K-GAAP에서 IFRS로의 스마트 전환 솔루션',
  TAGLINE_SHORT: '회계기준 전환 AI',

  // 설명
  DESCRIPTION: '중소기업을 위한 K-GAAP에서 IFRS로의 스마트 전환 솔루션',

  // 회사 정보
  COMPANY_NAME: 'StandardShift',
  COPYRIGHT_YEAR: '2025',

  // URL
  DOMAIN: 'standardshift.io',

  // 연락처
  SUPPORT_EMAIL: 'support@standardshift.io',

  // 소셜 미디어 (필요시 추가)
  // GITHUB: '',
  // TWITTER: '',
  // LINKEDIN: '',
} as const;

// 타입 안전성을 위한 타입 정의
export type BrandType = typeof BRAND;
