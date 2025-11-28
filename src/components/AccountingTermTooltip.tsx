import { useState } from 'react';
import { Tooltip, IconButton, Typography, Box, CircularProgress } from '@mui/material';
import HelpOutlineIcon from '@mui/icons-material/HelpOutline';

interface AccountingTermTooltipProps {
  term: string;
  definition?: string;
  children?: React.ReactNode;
}

/**
 * AccountingTermTooltip 컴포넌트
 * 회계 전문 용어에 대한 설명을 툴팁으로 표시합니다.
 * Context7과 통합하여 최신 회계 기준 정보를 제공할 수 있습니다.
 */
export default function AccountingTermTooltip({
  term,
  definition,
  children,
}: AccountingTermTooltipProps) {
  const [loading] = useState(false);

  // 기본 회계 용어 정의 (Context7를 통해 실시간으로 가져올 수도 있음)
  const termDefinitions: Record<string, string> = {
    'IFRS': 'International Financial Reporting Standards (국제회계기준) - 전 세계적으로 통용되는 회계 기준으로, 재무제표의 투명성과 비교가능성을 높이기 위해 제정되었습니다.',
    'K-GAAP': 'Korean Generally Accepted Accounting Principles (한국채택국제회계기준) - 한국의 일반기업회계기준으로, IFRS 도입 이전 사용되던 회계 기준입니다.',
    '재평가모형': '유형자산을 재평가일의 공정가치에서 재평가 후 발생한 감가상각누계액과 손상차손누계액을 차감한 재평가금액으로 측정하는 방법입니다.',
    '원가모형': '유형자산을 원가에서 감가상각누계액과 손상차손누계액을 차감한 금액으로 측정하는 방법입니다.',
    '리스자산': 'IFRS 16에 따라 리스이용자가 인식하는 기초자산을 사용할 권리를 나타내는 자산입니다.',
    '사용권자산': '리스 기간 동안 기초자산을 사용할 권리로, 리스이용자가 인식하는 자산입니다.',
    '리스부채': '리스료 지급의무에 대한 현재가치로 측정되는 부채입니다.',
    '유효이자율법': '상각후원가 측정 금융상품의 이자수익이나 이자비용을 관련 기간에 배분할 때 사용하는 방법입니다.',
    'IFRS 15': '수익인식 기준으로, 고객과의 계약에서 생기는 수익을 인식하는 방법을 규정합니다.',
    'IFRS 16': '리스 회계처리 기준으로, 리스이용자의 모든 리스를 재무상태표에 인식하도록 요구합니다.',
    '무형자산': '물리적 실체는 없지만 식별가능하고 기업이 통제하며 미래경제적효익이 기대되는 비화폐성자산입니다.',
    '개발비': '연구 이후 단계에서 발생한 지출로, 특정 요건을 충족하면 무형자산으로 인식할 수 있습니다.',
    '퇴직급여충당부채': '종업원이 제공한 근무용역의 대가로 지급될 퇴직급여에 대한 추정부채입니다.',
    '확정급여제도': '퇴직급여의 금액이 확정되어 있어 기업이 추가적인 부담을 질 수 있는 제도입니다.',
    '보험수리적가정': '확정급여채무와 관련원가를 측정할 때 사용하는 할인율, 급여상승률 등의 가정입니다.',
    '충당부채': '과거사건의 결과로 현재의무가 존재하고, 경제적효익의 유출가능성이 높으며, 금액을 신뢰성있게 추정할 수 있는 경우 인식하는 부채입니다.',
    'OCI': 'Other Comprehensive Income (기타포괄손익) - 당기손익에 포함되지 않는 수익과 비용의 합계입니다.',
    '공정가치': '측정일에 시장참여자 사이의 정상거래에서 자산을 매도할 때 받거나 부채를 이전할 때 지급하게 될 가격입니다.',
    '감가상각': '유형자산의 취득원가를 그 자산의 사용가능기간 동안 체계적으로 배분하는 것입니다.',
    '손상차손': '자산의 회수가능액이 장부금액에 미달하는 경우 그 차액을 비용으로 인식하는 것입니다.',
  };

  const tooltipContent = definition || termDefinitions[term] || '설명을 불러오는 중...';

  if (children) {
    return (
      <Tooltip
        title={
          <Box sx={{ p: 1, maxWidth: 400 }}>
            {loading ? (
              <CircularProgress size={20} />
            ) : (
              <>
                <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                  {term}
                </Typography>
                <Typography variant="body2">{tooltipContent}</Typography>
              </>
            )}
          </Box>
        }
        arrow
        enterDelay={200}
        leaveDelay={200}
      >
        <Box
          component="span"
          sx={{
            borderBottom: '1px dashed',
            borderColor: 'primary.main',
            cursor: 'help',
            color: 'primary.main',
          }}
        >
          {children}
        </Box>
      </Tooltip>
    );
  }

  return (
    <Tooltip
      title={
        <Box sx={{ p: 1, maxWidth: 400 }}>
          {loading ? (
            <CircularProgress size={20} />
          ) : (
            <>
              <Typography variant="subtitle2" fontWeight="bold" gutterBottom>
                {term}
              </Typography>
              <Typography variant="body2">{tooltipContent}</Typography>
            </>
          )}
        </Box>
      }
      arrow
      enterDelay={200}
      leaveDelay={200}
    >
      <IconButton size="small" color="primary">
        <HelpOutlineIcon fontSize="small" />
      </IconButton>
    </Tooltip>
  );
}
