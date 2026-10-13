import { Trans } from '@lingui/macro';
import { Box, MenuItem, Select, Skeleton, Stack, Typography } from '@mui/material';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import React, { useMemo, useState } from 'react';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Warning } from 'src/components/primitives/Warning';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { useCandidates } from 'src/libs/reental/sharedRouter/useCandidates';
import { HealthFactorValue } from 'src/modules/analytics/HealthFactorValue';
import { useOnChainPosition } from 'src/modules/analytics/useOnChainPosition';
import { useRootStore } from 'src/store/root';
import { useShallow } from 'zustand/shallow';

import { AssetInput } from '../AssetInput';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsNumberLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { LiquidateActions } from './LiquidateActions';

/**
 * Aave v3 lets a liquidator cover the whole debt once a position is deep enough underwater;
 * above that threshold only half may be covered in one call.
 */
const CLOSE_FACTOR_HF_THRESHOLD = 0.95;
const PARTIAL_CLOSE_FACTOR = 0.5;

export const LiquidateModalContent = React.memo(({ borrower }: { borrower: string }) => {
  const { mainTxState, gasLimit, txError } = useModalContext();
  const { chainId: connectedChainId } = useWeb3Context();
  const [currentMarketData, currentNetworkConfig] = useRootStore(
    useShallow((store) => [store.currentMarketData, store.currentNetworkConfig])
  );

  const { data: position, isLoading: loadingPosition } = useOnChainPosition(borrower);
  const router = currentMarketData.addresses.SHARED_LIQUIDATION_ROUTER;

  const [collateralAsset, setCollateralAsset] = useState('');
  const [debtAsset, setDebtAsset] = useState('');
  const [amount, setAmount] = useState('');

  const isWrongNetwork = connectedChainId !== currentMarketData.chainId;

  // What the borrower actually has, from the authoritative on-chain read.
  const collaterals = useMemo(
    () =>
      (position?.summary.userReservesData ?? []).filter(
        (userReserve) =>
          userReserve.usageAsCollateralEnabledOnUser && Number(userReserve.underlyingBalance) > 0
      ),
    [position]
  );

  const debts = useMemo(
    () =>
      (position?.summary.userReservesData ?? []).filter(
        (userReserve) => Number(userReserve.totalBorrows) > 0
      ),
    [position]
  );

  const selectedCollateral =
    collaterals.find((item) => item.underlyingAsset === collateralAsset) ?? collaterals[0];
  const selectedDebt = debts.find((item) => item.underlyingAsset === debtAsset) ?? debts[0];

  // The router decides which LPs can fund this; asking it avoids mirroring four separate
  // ceilings (allowance, budget, per-liquidation cap, aToken balance) in the frontend.
  const { data: quote, isLoading: loadingRouters } = useCandidates({
    marketData: currentMarketData,
    collateralAsset: selectedCollateral?.underlyingAsset,
    debtAsset: selectedDebt?.underlyingAsset,
  });
  const candidates = quote?.candidates ?? [];

  const healthFactor = position?.healthFactor ?? 0;
  const stillLiquidatable = healthFactor > 0 && healthFactor < 1;

  // Capped by two independent things: Aave's close factor, and how much the available LPs
  // can actually fund between them.
  const poolCapacity = useMemo(
    () => candidates.reduce((total, candidate) => total + BigInt(candidate.maxDebt), BigInt(0)),
    [candidates]
  );

  const maxCoverable = useMemo(() => {
    if (!selectedDebt) return '0';

    const closeFactor = healthFactor < CLOSE_FACTOR_HF_THRESHOLD ? 1 : PARTIAL_CLOSE_FACTOR;
    const byCloseFactor = Number(selectedDebt.totalBorrows) * closeFactor;
    const byPool = Number(formatUnits(poolCapacity.toString(), selectedDebt.reserve.decimals));

    return Math.min(byCloseFactor, byPool).toString();
  }, [selectedDebt, healthFactor, poolCapacity]);

  if (mainTxState.success) {
    return (
      <TxSuccessView
        action={<Trans>Liquidated</Trans>}
        amount={amount}
        symbol={selectedDebt?.reserve.symbol}
      />
    );
  }

  if (loadingPosition || loadingRouters) {
    return (
      <Stack gap={2} sx={{ mt: 4 }}>
        <Skeleton height={44} />
        <Skeleton height={72} />
      </Stack>
    );
  }

  if (!position) {
    return (
      <Warning severity="error" sx={{ mt: 4 }}>
        <Trans>This position could not be read from the protocol.</Trans>
      </Warning>
    );
  }

  // The table is subgraph-derived and assumes no eMode; this on-chain read is the truth.
  if (!stillLiquidatable) {
    return (
      <>
        <Warning severity="info" sx={{ mt: 4 }}>
          <Trans>
            This position is not liquidatable on-chain. Its health factor is{' '}
            {healthFactor.toFixed(3)}, which is at or above 1.
          </Trans>
        </Warning>
        {position.userEmodeCategoryId > 0 && (
          <Warning severity="info" sx={{ mt: 2 }}>
            <Trans>
              The borrower is in eMode, which raises their liquidation threshold. The analytics
              table does not account for eMode and can overstate the risk of such positions.
            </Trans>
          </Warning>
        )}
      </>
    );
  }

  const amountExceedsMax = Number(amount) > Number(maxCoverable);
  const blocked =
    !router || !selectedCollateral || !selectedDebt || amountExceedsMax || !candidates.length;

  return (
    <>
      <Warning severity="warning" sx={{ mt: 4, mb: 0 }}>
        <Trans>
          Liquidations are permissionless and the caller keeps nothing. The debt is funded by the
          liquidity providers listed below, and each one&apos;s share of the seized collateral goes
          to their own nominated recipient.
        </Trans>
      </Warning>

      <Stack gap={1} sx={{ mt: 4 }}>
        <Typography variant="description" color="text.secondary">
          <Trans>Collateral to seize</Trans>
        </Typography>
        <Select
          value={selectedCollateral?.underlyingAsset ?? ''}
          onChange={(event) => setCollateralAsset(event.target.value)}
          size="small"
          data-cy="liquidateCollateralSelect"
        >
          {collaterals.map((item) => (
            <MenuItem key={item.underlyingAsset} value={item.underlyingAsset}>
              {item.reserve.symbol} —{' '}
              <FormattedNumber
                value={item.underlyingBalanceUSD}
                symbol="USD"
                variant="secondary14"
              />
            </MenuItem>
          ))}
        </Select>
      </Stack>

      <Stack gap={1} sx={{ mt: 3 }}>
        <Typography variant="description" color="text.secondary">
          <Trans>Debt to repay</Trans>
        </Typography>
        <Select
          value={selectedDebt?.underlyingAsset ?? ''}
          onChange={(event) => setDebtAsset(event.target.value)}
          size="small"
          data-cy="liquidateDebtSelect"
        >
          {debts.map((item) => (
            <MenuItem key={item.underlyingAsset} value={item.underlyingAsset}>
              {item.reserve.symbol} —{' '}
              <FormattedNumber value={item.totalBorrowsUSD} symbol="USD" variant="secondary14" />
            </MenuItem>
          ))}
        </Select>
      </Stack>

      {!candidates.length && selectedDebt && !loadingRouters && (
        <Warning severity="error" sx={{ mt: 3, mb: 0 }}>
          <Trans>
            No liquidity provider can fund this liquidation right now. Providers need an armed
            allowance, a collateral budget for {selectedCollateral?.reserve.symbol}, and a
            whitelisted recipient.
          </Trans>
        </Warning>
      )}

      {!!candidates.length && (
        <Box sx={{ mt: 3 }}>
          <AssetInput
            value={amount}
            onChange={(value) => setAmount(value === '-1' ? maxCoverable : value)}
            usdValue={
              selectedDebt
                ? (
                    Number(amount || 0) *
                    (Number(selectedDebt.totalBorrowsUSD) / Number(selectedDebt.totalBorrows))
                  ).toString()
                : '0'
            }
            symbol={selectedDebt?.reserve.symbol ?? ''}
            assets={[
              {
                balance: maxCoverable,
                symbol: selectedDebt?.reserve.symbol ?? '',
                iconSymbol: selectedDebt?.reserve.iconSymbol ?? '',
              },
            ]}
            maxValue={maxCoverable}
            isMaxSelected={amount === maxCoverable}
            disabled={mainTxState.loading}
            balanceText={<Trans>Max coverable</Trans>}
          />
        </Box>
      )}

      <TxModalDetails gasLimit={gasLimit} skipLoad disabled={blocked || Number(amount) === 0}>
        <Stack direction="row" justifyContent="space-between" alignItems="center">
          <Typography variant="description" color="text.secondary">
            <Trans>Health factor</Trans>
          </Typography>
          <HealthFactorValue value={healthFactor} />
        </Stack>

        <DetailsNumberLine
          description={<Trans>Total debt</Trans>}
          value={selectedDebt?.totalBorrows ?? 0}
          symbol={selectedDebt?.reserve.symbol}
          iconSymbol={selectedDebt?.reserve.iconSymbol}
        />

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="description" color="text.secondary">
            <Trans>Close factor</Trans>
          </Typography>
          <Typography variant="secondary14">
            {healthFactor < CLOSE_FACTOR_HF_THRESHOLD ? '100%' : '50%'}
          </Typography>
        </Stack>

        <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
          <Typography variant="description" color="text.secondary">
            <Trans>Liquidity providers used</Trans>
          </Typography>
          <Typography variant="secondary14">
            <Trans>
              {candidates.length} of {quote?.totalLps ?? 0}
            </Trans>
          </Typography>
        </Stack>
      </TxModalDetails>

      {/* A pair the router cannot price at all is a different problem from one no LP has
          funded, and only one of them is fixable by finding more liquidity. */}
      {quote?.quoteError && (
        <Warning severity="error" sx={{ mt: 3, mb: 0 }}>
          <Trans>The router cannot quote this collateral and debt pair: {quote.quoteError}.</Trans>
        </Warning>
      )}

      {!quote?.quoteError && quote && candidates.length === 0 && (
        <Warning severity="warning" sx={{ mt: 3, mb: 0 }}>
          <Trans>
            No liquidity provider can fund this liquidation right now. Providers are skipped when
            their allowance, aToken balance, collateral budget or per-liquidation cap runs out.
          </Trans>
        </Warning>
      )}

      {amountExceedsMax && (
        <Warning severity="error" sx={{ mt: 3, mb: 0 }}>
          <Trans>Amount is above what the close factor and the available providers allow.</Trans>
        </Warning>
      )}

      {txError && <GasEstimationError txError={txError} />}

      {router && selectedCollateral && selectedDebt && (
        <LiquidateActions
          router={router}
          call={{
            borrower,
            collateralAsset: selectedCollateral.underlyingAsset,
            debtAsset: selectedDebt.underlyingAsset,
            debtToCover: amount
              ? parseUnits(amount, selectedDebt.reserve.decimals).toString()
              : '0',
            candidates: candidates.map((candidate) => candidate.lp),
          }}
          symbol={selectedDebt.reserve.symbol}
          chainId={currentMarketData.chainId}
          isWrongNetwork={isWrongNetwork}
          blocked={blocked || Number(amount) === 0}
        />
      )}

      <Typography variant="helperText" color="text.secondary" sx={{ mt: 2, display: 'block' }}>
        <Trans>Network: {currentNetworkConfig.name}</Trans>
      </Typography>
    </>
  );
});
