import { ToggleButton, ToggleButtonGroup, Typography } from '@mui/material';

import { MarketHistoryRange, marketHistoryRangeOptions } from './marketHistoryRanges';

type MarketsHistoryRangeSelectorProps = {
  disabled: boolean;
  timeRange: MarketHistoryRange;
  onTimeRangeChanged: (value: MarketHistoryRange) => void;
  textColor?: string;
};

export const MarketsHistoryRangeSelector = ({
  disabled,
  timeRange,
  onTimeRangeChanged,
  textColor,
}: MarketsHistoryRangeSelectorProps) => {
  const handleChange = (_event: React.MouseEvent<HTMLElement>, newInterval: MarketHistoryRange) => {
    if (newInterval !== null) {
      onTimeRangeChanged(newInterval);
    }
  };

  return (
    <ToggleButtonGroup
      disabled={disabled}
      value={timeRange}
      exclusive
      onChange={handleChange}
      aria-label="Date range"
      sx={{
        height: '24px',
        '& .MuiToggleButton-root': {
          color: `${textColor || 'action.disabled'} !important`,
        },
        '& .MuiToggleButton-root .MuiTypography-root': {
          color: 'inherit !important',
        },
        '& .MuiToggleButton-root.Mui-selected': {
          color: `${textColor || 'inherit'} !important`,
        },
        '& .MuiToggleButton-root.Mui-selected .MuiTypography-root': {
          color: 'inherit !important',
        },
        '&.MuiToggleButtonGroup-grouped': {
          borderRadius: 'unset',
        },
      }}
    >
      {marketHistoryRangeOptions.map((interval) => (
        <ToggleButton
          key={interval}
          value={interval}
          sx={(theme) => ({
            '&.MuiToggleButtonGroup-grouped:not(.Mui-selected), &.MuiToggleButtonGroup-grouped&.Mui-disabled':
              {
                border: '0.5px solid transparent',
                backgroundColor: 'background.surface',
                color: textColor || 'action.disabled',
              },
            '&.MuiToggleButtonGroup-grouped&.Mui-selected': {
              borderRadius: '4px',
              border: `0.5px solid ${theme.palette.divider}`,
              boxShadow: '0px 2px 1px rgba(0, 0, 0, 0.05), 0px 0px 1px rgba(0, 0, 0, 0.25)',
              backgroundColor: 'background.paper',
              color: textColor || 'inherit',
            },
          })}
        >
          <Typography variant="buttonM" sx={{ color: 'inherit' }}>
            {interval}
          </Typography>
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
};
