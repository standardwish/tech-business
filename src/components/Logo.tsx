import { SvgIcon, SvgIconProps } from "@mui/material";

export default function Logo(props: SvgIconProps) {
  return (
    <SvgIcon {...props} viewBox="0 0 48 48">
      <defs>
        <linearGradient id="logoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#1976d2" />
          <stop offset="100%" stopColor="#0d47a1" />
        </linearGradient>
      </defs>

      {/* 외부 원형 */}
      <circle
        cx="24"
        cy="24"
        r="22"
        fill="url(#logoGradient)"
        opacity="0.1"
      />

      {/* S 모양의 화살표 (Standard + Shift) */}
      <path
        d="M 18 14 C 18 14, 28 14, 32 18 C 36 22, 32 24, 30 24 C 28 24, 24 24, 24 24"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      <path
        d="M 24 24 C 24 24, 20 24, 18 24 C 16 24, 12 26, 16 30 C 20 34, 30 34, 30 34"
        stroke="url(#logoGradient)"
        strokeWidth="3"
        strokeLinecap="round"
        fill="none"
      />

      {/* 우측 상단 화살표 (전환 의미) */}
      <path
        d="M 30 34 L 36 28 M 36 28 L 33 28 M 36 28 L 36 31"
        stroke="url(#logoGradient)"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        fill="none"
      />
    </SvgIcon>
  );
}
