import { Box, BoxProps, Container } from '@mui/material';
import { ReactNode } from 'react';

interface ContentContainerProps {
  children: ReactNode;
  wrapperSx?: BoxProps['sx'];
}

export const ContentContainer = ({ children, wrapperSx }: ContentContainerProps) => {
  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        flex: 1,
        mt: { xs: '-32px', lg: '-46px', xl: '-44px', xxl: '-48px' },
        ...wrapperSx,
      }}
    >
      <Container>{children}</Container>
    </Box>
  );
};
