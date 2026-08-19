import { USD_DECIMALS } from '@aave/math-utils';
import { Trans } from '@lingui/macro';
import { Button, Skeleton, Stack, Typography } from '@mui/material';
import { BigNumber } from 'bignumber.js';
import React, { useState } from 'react';
import { CompactableTypography, CompactMode } from 'src/components/CompactableTypography';
import { Warning } from 'src/components/primitives/Warning';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useApprovedAmount } from 'src/hooks/useApprovedAmount';
import { useModalContext } from 'src/hooks/useModal';
import {
  primaryRouter,
  useUserLiquidationRouters,
} from 'src/libs/reental/liquidationRouter/useUserLiquidationRouter';
import { hasAllowance, isUnlimitedAllowance } from 'src/libs/reental/liquidationRouter/utils';
import { useRootStore } from 'src/store/root';
import { GENERAL } from 'src/utils/events';
import { roundToTokenDecimals } from 'src/utils/utils';
import { useShallow } from 'zustand/shallow';

import { AssetInput } from '../AssetInput';
import { GasEstimationError } from '../FlowCommons/GasEstimationError';
import { ModalWrapperProps } from '../FlowCommons/ModalWrapper';
import { TxSuccessView } from '../FlowCommons/Success';
import { DetailsNumberLine, TxModalDetails } from '../FlowCommons/TxModalDetails';
import { ApproveRouterActions, CreateRouterActions } from './SupplyForLiquidationsActions';

export const SupplyForLiquidationsModalContent = React.memo(
  ({
    poolReserve,
    userReserve,
    isWrongNetwork,
    initialRevoke,
    routerAddress,
  }: ModalWrapperProps & { initialRevoke?: boolean; routerAddress?: string }) => {
    const { marketReferencePriceInUsd } = useAppDataContext();
    const { mainTxState, gasLimit, txError } = useModalContext();
    const [currentMarketData, user] = useRootStore(
      useShallow((state) => [state.currentMarketData, state.account])
    );

    const [amount, setAmount] = useState('');
    const [revoking, setRevoking] = useState(!!initialRevoke);

    const factory = currentMarketData.addresses.LIQUIDATION_ROUTER_FACTORY;

    const {
      data: routers,
      isLoading: loadingRouter,
      refetch: refetchRouter,
    } = useUserLiquidationRouters({ marketData: currentMarketData, user });

    // The card can hand us a specific router when the reserve has more than one; without
    // one, fall back to the reserve's primary router.
    const candidates =
      routers?.byAsset[poolReserve.aTokenAddress.toLowerCase()] ??
      routers?.byAsset[poolReserve.underlyingAsset.toLowerCase()];
    const router = routerAddress
      ? candidates?.find((candidate) => candidate.address === routerAddress.toLowerCase()) ?? null
      : primaryRouter(candidates);

    const { data: approvedAmount, isFetching: fetchingApprovedAmount } = useApprovedAmount({
      chainId: currentMarketData.chainId,
      token: poolReserve.aTokenAddress,
      spender: router?.address ?? '',
      enabled: !!router,
    });

    // 1:1 with the aToken balance, so the supplied position is what can be committed.
    const maxAmountToApprove = userReserve?.underlyingBalance || '0';

    const handleChange = (value: string) => {
      if (value === '-1') {
        setAmount(maxAmountToApprove);
      } else {
        setAmount(roundToTokenDecimals(value, poolReserve.decimals));
      }
    };

    const amountInUsd = new BigNumber(amount)
      .multipliedBy(poolReserve.formattedPriceInMarketReferenceCurrency)
      .multipliedBy(marketReferencePriceInUsd)
      .shiftedBy(-USD_DECIMALS);

    if (!factory) {
      return (
        <Warning severity="error" sx={{ mt: 4 }}>
          <Trans>No liquidation router factory is configured for this market.</Trans>
        </Warning>
      );
    }

    if (mainTxState.success) {
      if (!router) {
        return (
          <TxSuccessView
            customAction={
              <Typography>
                <Trans>Your {poolReserve.symbol} liquidation router is ready</Trans>
              </Typography>
            }
          />
        );
      }

      if (revoking) {
        return (
          <TxSuccessView
            customAction={
              <Typography>
                <Trans>Revoked {poolReserve.symbol} from your liquidation router</Trans>
              </Typography>
            }
          />
        );
      }

      return (
        <TxSuccessView
          action={<Trans>Supplied for liquidations</Trans>}
          amount={amount}
          symbol={poolReserve.symbol}
        />
      );
    }

    if (loadingRouter) {
      return (
        <Stack gap={2} sx={{ mt: 4 }}>
          <Skeleton height={44} />
          <Skeleton height={72} />
        </Stack>
      );
    }

    // No router yet on this reserve — the only available action is to deploy one.
    if (!router) {
      return (
        <>
          <Warning severity="info" sx={{ mt: 4, mb: 0 }}>
            <Trans>
              You need your own liquidation router for {poolReserve.symbol} before you can commit
              aTokens. It is created once and reused for every later approval.
            </Trans>
          </Warning>

          {txError && <GasEstimationError txError={txError} />}

          <CreateRouterActions
            factory={factory}
            aTokenAddress={poolReserve.aTokenAddress}
            underlyingAsset={poolReserve.underlyingAsset}
            onCreated={refetchRouter}
            isWrongNetwork={isWrongNetwork}
            symbol={poolReserve.symbol}
            chainId={currentMarketData.chainId}
          />
        </>
      );
    }

    const currentlyApproved = approvedAmount ?? 0;
    const unlimited = isUnlimitedAllowance(currentlyApproved);
    const canRevoke = hasAllowance(currentlyApproved);

    return (
      <>
        {revoking && (
          <Warning severity="warning" sx={{ mt: 4, mb: 0 }}>
            <Trans>
              This sets your {poolReserve.symbol} allowance for the router to 0. The router will no
              longer be able to use these aTokens to offset liquidations.
            </Trans>
          </Warning>
        )}

        {!revoking && (
          <AssetInput
            value={amount}
            onChange={handleChange}
            usdValue={amountInUsd.toString(10)}
            symbol={poolReserve.symbol}
            assets={[
              {
                balance: maxAmountToApprove,
                symbol: poolReserve.symbol,
                iconSymbol: poolReserve.iconSymbol,
              },
            ]}
            isMaxSelected={amount === maxAmountToApprove}
            disabled={mainTxState.loading}
            maxValue={maxAmountToApprove}
            balanceText={<Trans>Supplied balance</Trans>}
            event={{
              eventName: GENERAL.MAX_INPUT_SELECTION,
              eventParams: {
                asset: poolReserve.underlyingAsset,
                assetName: poolReserve.name,
              },
            }}
          />
        )}

        <TxModalDetails
          gasLimit={gasLimit}
          skipLoad={true}
          disabled={!revoking && Number(amount) === 0}
        >
          {unlimited ? (
            <Stack direction="row" justifyContent="space-between" alignItems="center">
              <Typography variant="description" color="text.secondary">
                <Trans>Currently supplied for liquidations</Trans>
              </Typography>
              <Typography variant="secondary14">
                <Trans>Unlimited</Trans>
              </Typography>
            </Stack>
          ) : (
            <DetailsNumberLine
              description={<Trans>Currently supplied for liquidations</Trans>}
              value={currentlyApproved}
              loading={fetchingApprovedAmount}
              iconSymbol={poolReserve.iconSymbol}
              symbol={poolReserve.symbol}
            />
          )}
          <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mt: 2 }}>
            <Typography variant="description" color="text.secondary">
              <Trans>Your router</Trans>
            </Typography>
            <CompactableTypography variant="secondary14" compactMode={CompactMode.MD}>
              {router.address}
            </CompactableTypography>
          </Stack>
        </TxModalDetails>

        {txError && <GasEstimationError txError={txError} />}

        <ApproveRouterActions
          amountToApprove={amount}
          aTokenAddress={poolReserve.aTokenAddress}
          router={router.address}
          symbol={poolReserve.symbol}
          decimals={poolReserve.decimals}
          isWrongNetwork={isWrongNetwork}
          chainId={currentMarketData.chainId}
          revoke={revoking}
        />

        {canRevoke && (
          <Button
            variant="outlined"
            size="large"
            fullWidth
            disabled={mainTxState.loading}
            onClick={() => setRevoking(!revoking)}
            sx={{ mt: 2, minHeight: '44px' }}
            data-cy="revokeToggleButton"
          >
            {revoking ? <Trans>Back to supplying</Trans> : <Trans>Revoke approval</Trans>}
          </Button>
        )}
      </>
    );
  }
);
