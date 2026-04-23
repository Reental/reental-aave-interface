import { Box, Typography } from '@mui/material';

interface GraphLegendProps {
  labels: { text: string; color: string }[];
  textColor?: string;
}

export function GraphLegend({
  labels = [
    { text: 'test', color: '#000' },
    { text: 'bla', color: '#ff0' },
  ],
  textColor,
}: GraphLegendProps) {
  return (
    <Box>
      {labels.map((label) => (
        <Box key={label.text} sx={{ display: 'inline-flex', alignItems: 'center', mr: 6 }}>
          <Box
            sx={{
              width: 6,
              height: 6,
              backgroundColor: label.color,
              mr: '11px',
              borderRadius: '50%',
            }}
          />
          <Typography
            variant="description"
            sx={{ color: textColor || 'text.secondary', opacity: 1 }}
          >
            {label.text}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
