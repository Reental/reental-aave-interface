import { t, Trans } from '@lingui/macro';
import { Box, Checkbox, Typography, useMediaQuery, useTheme } from '@mui/material';
import { useState } from 'react';
import { ListColumn } from 'src/components/lists/ListColumn';
import { ListHeaderTitle } from 'src/components/lists/ListHeaderTitle';
import { ListHeaderWrapper } from 'src/components/lists/ListHeaderWrapper';
import { ListSearchBar } from 'src/components/lists/ListSearchBar';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { NoSearchResults } from 'src/components/NoSearchResults';
import { TextWithTooltip } from 'src/components/TextWithTooltip';
import { matchesSearchTerm } from 'src/utils/assetSearch';

import {
  AcceptedCollaterals,
  CollateralAcceptance,
  LiquidationCollateralOption,
} from '../../types';
import { LiquidationCollateralListItem } from './LiquidationCollateralListItem';

interface LiquidationCollateralListProps {
  options: LiquidationCollateralOption[];
  accepted: AcceptedCollaterals;
  onAcceptanceChange: (underlyingAsset: string, acceptance: CollateralAcceptance) => void;
  /** Toggles the given assets (the currently displayed ones, so it respects an active search) */
  onToggleAll: (accepted: boolean, assets: string[]) => void;
}

const EMPTY_ACCEPTANCE: CollateralAcceptance = { accepted: false, mode: 'all', amount: '' };

const MAX_LIST_HEIGHT = '440px';

export const LiquidationCollateralList = ({
  options,
  accepted,
  onAcceptanceChange,
  onToggleAll,
}: LiquidationCollateralListProps) => {
  const theme = useTheme();
  const downToXSM = useMediaQuery(theme.breakpoints.down('xsm'));
  const [searchTerm, setSearchTerm] = useState('');

  const acceptedCount = options.filter((o) => accepted[o.underlyingAsset]?.accepted).length;

  const displayedOptions = options.filter((option) =>
    matchesSearchTerm(searchTerm, option.symbol, option.name)
  );
  const displayedAcceptedCount = displayedOptions.filter(
    (o) => accepted[o.underlyingAsset]?.accepted
  ).length;
  const allDisplayedAccepted =
    displayedOptions.length > 0 && displayedAcceptedCount === displayedOptions.length;

  return (
    <ListWrapper
      // Rendered inside the setup card, which already draws the outer border
      paperSx={{ border: 0 }}
      titleComponent={
        <Typography component="div" variant="h3" sx={{ mr: 4 }}>
          <Trans>Collaterals you accept to receive</Trans>
        </Typography>
      }
      subTitleComponent={
        <Typography variant="secondary14" color="text.secondary">
          {acceptedCount}/{options.length} <Trans>selected</Trans>
        </Typography>
      }
    >
      <ListSearchBar
        onSearchTermChange={setSearchTerm}
        placeholder={t`Search asset name or symbol`}
      />

      {displayedOptions.length === 0 ? (
        <NoSearchResults searchTerm={searchTerm} />
      ) : (
        <Box sx={{ maxHeight: MAX_LIST_HEIGHT, overflowY: 'auto' }}>
          {!downToXSM && (
            <ListHeaderWrapper px={6} sx={{ pt: 0 }}>
              <ListColumn maxWidth={48} minWidth={48} align="center">
                <Checkbox
                  size="small"
                  checked={allDisplayedAccepted}
                  indeterminate={displayedAcceptedCount > 0 && !allDisplayedAccepted}
                  onChange={(e) =>
                    onToggleAll(
                      e.target.checked,
                      displayedOptions.map((o) => o.underlyingAsset)
                    )
                  }
                  inputProps={{ 'aria-label': 'accept all collaterals' }}
                  sx={{ p: 0 }}
                />
              </ListColumn>
              <ListColumn isRow maxWidth={190} minWidth={160}>
                <ListHeaderTitle>
                  <Trans>Asset</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn>
                <ListHeaderTitle>
                  <Trans>Oracle price</Trans>
                </ListHeaderTitle>
              </ListColumn>
              <ListColumn>
                <TextWithTooltip
                  text={<Trans>Liquidation bonus</Trans>}
                  variant="subheader2"
                  color="text.secondary"
                >
                  <Trans>
                    Discount at which you receive this collateral when your deposit is used in a
                    liquidation.
                  </Trans>
                </TextWithTooltip>
              </ListColumn>
              <ListColumn maxWidth={220} minWidth={200} align="right">
                <TextWithTooltip
                  text={<Trans>Amount you accept</Trans>}
                  variant="subheader2"
                  color="text.secondary"
                >
                  <Trans>
                    Cap how much of this asset you are willing to receive from liquidations, or
                    accept it without limit.
                  </Trans>
                </TextWithTooltip>
              </ListColumn>
            </ListHeaderWrapper>
          )}

          {displayedOptions.map((option) => (
            <LiquidationCollateralListItem
              key={option.underlyingAsset}
              option={option}
              acceptance={accepted[option.underlyingAsset] ?? EMPTY_ACCEPTANCE}
              onAcceptanceChange={onAcceptanceChange}
            />
          ))}
        </Box>
      )}
    </ListWrapper>
  );
};
