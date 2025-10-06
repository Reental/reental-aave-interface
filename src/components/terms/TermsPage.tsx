import { Trans } from '@lingui/macro';
import { useLingui } from '@lingui/react';
import { Box, Typography } from '@mui/material';
import ReactMarkdown from 'react-markdown';

import { terms_en } from './terms_en';
import { terms_es } from './terms_es';

const TermsPage = () => {
  const { i18n } = useLingui();

  const getTermsContent = () => {
    return i18n.locale === 'es' ? terms_es : terms_en;
  };
  return (
    <Box
      sx={{
        paddingTop: '64px',
      }}
    >
      <Box sx={{ display: 'flex', alignItems: 'center', marginTop: '24px' }}>
        <Typography variant="h1">
          <Trans>Terms of use</Trans>
        </Typography>
      </Box>
      <ReactMarkdown>{getTermsContent()}</ReactMarkdown>
    </Box>
  );
};

export default TermsPage;
