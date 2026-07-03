import { Box, BoxProps } from '@mui/material';

import { SearchInput } from '../SearchInput';

interface ListSearchBarProps {
  onSearchTermChange: (value: string) => void;
  placeholder: string;
  wrapperSx?: BoxProps['sx'];
}

/**
 * Search bar row rendered above a list table (inside ListWrapper children).
 */
export const ListSearchBar = ({
  onSearchTermChange,
  placeholder,
  wrapperSx,
}: ListSearchBarProps) => {
  return (
    <Box sx={{ px: { xs: 4, xsm: 6 }, pb: 3, ...wrapperSx }}>
      <SearchInput
        onSearchTermChange={onSearchTermChange}
        placeholder={placeholder}
        wrapperSx={{ width: '100%' }}
      />
    </Box>
  );
};
