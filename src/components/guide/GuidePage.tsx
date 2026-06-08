import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';

import { guide_en } from './guide_en';
import { guide_es } from './guide_es';

const GuidePage = () => {
  const { i18n } = useLingui();

  const getGuideContent = () => {
    return i18n.locale === 'es' ? guide_es : guide_en;
  };

  return (
    <Box
      sx={{
        paddingTop: '64px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
        <Typography variant="h1">
          {i18n.locale === 'es' ? 'Guía del Protocolo RNT Lend' : 'RNT Lend Protocol Guide'}
        </Typography>
      </Box>
      <Box
        sx={(theme) => ({
          '& table': {
            width: '100%',
            borderCollapse: 'separate',
            borderSpacing: 0,
            margin: '20px 0',
            fontSize: '14px',
            border: `1px solid ${theme.palette.divider}`,
            borderRadius: '12px',
            overflow: 'hidden',
          },
          '& thead th': {
            backgroundColor:
              theme.palette.mode === 'light'
                ? theme.palette.background.surface
                : 'rgba(255, 255, 255, 0.04)',
            textAlign: 'left',
            fontWeight: 600,
            color: theme.palette.text.secondary,
            fontSize: '12px',
            letterSpacing: '0.06em',
            textTransform: 'uppercase',
            padding: '13px 18px',
          },
          '& thead th:nth-of-type(2)': {
            textAlign: 'center',
          },
          '& tbody td': {
            padding: '14px 18px',
            borderTop: `1px solid ${theme.palette.divider}`,
            color: theme.palette.text.secondary,
            verticalAlign: 'top',
          },
          '& tbody td:first-of-type': {
            fontWeight: 700,
            color: theme.palette.text.primary,
          },
          '& tbody td:nth-of-type(2)': {
            fontWeight: 700,
            textAlign: 'center',
            whiteSpace: 'nowrap',
            color: theme.palette.primary.main,
          },
          '& tbody tr:hover td': {
            backgroundColor:
              theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.02)',
          },
          '& blockquote': {
            margin: '16px 0',
            padding: '14px 18px',
            borderRadius: '10px',
            border: `1px solid ${theme.palette.divider}`,
            backgroundColor:
              theme.palette.mode === 'light' ? 'rgba(0, 0, 0, 0.02)' : 'rgba(255, 255, 255, 0.03)',
            color: theme.palette.text.primary,
            fontWeight: 600,
            '& p': { margin: 0 },
          },
          '& hr': {
            border: 0,
            borderTop: `1px solid ${theme.palette.divider}`,
            margin: '32px 0',
          },
        })}
      >
        <ReactMarkdown remarkPlugins={[remarkGfm]}>{getGuideContent()}</ReactMarkdown>
      </Box>
    </Box>
  );
};

export default GuidePage;
