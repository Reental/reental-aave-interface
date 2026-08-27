import { Trans } from '@lingui/macro';
import { Box, Button, Chip, Stack, Tooltip, Typography } from '@mui/material';
import { formatUnits } from 'ethers/lib/utils';
import { CompactableTypography, CompactMode } from 'src/components/CompactableTypography';
import { ListWrapper } from 'src/components/lists/ListWrapper';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { Warning } from 'src/components/primitives/Warning';
import { useAppDataContext } from 'src/hooks/app-data-provider/useAppDataProvider';
import { useModalContext } from 'src/hooks/useModal';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { BUDGET_USD_DECIMALS, UNCONSTRAINED_THRESHOLD } from 'src/libs/reental/sharedRouter/abi';
import { useMandate } from 'src/libs/reental/sharedRouter/useMandate';
import { useIndexerStatus } from 'src/libs/reental/sharedRouter/usePonderMandate';
import { useRootStore } from 'src/store/root';

import { ListLoader } from '../ListLoader';
import { MandateActivity } from './MandateActivity';

/**
 * The connected wallet's mandate on the shared liquidation router.
 *
 * Under v2 there is no per-user router: an LP registers a recipient on one shared contract
 * and configures it. The card follows the order the contract enforces — register, then arm,
 * then budgets — and disables everything downstream of a step that has not happened yet, so
 * no button here can produce a guaranteed revert.
 *
 * The other thing it has to get right is the collateral mode. An LP either pools one budget
 * across every property or funds a chosen list; those are exclusive, and showing the wrong
 * one makes a funded LP look unfunded.
 */

const head = [
  <Trans key="Asset">Asset</Trans>,
  <Trans key="Budget">Budget</Trans>,
  <Trans key="Remaining">Remaining</Trans>,
  <Trans key="Whitelisted">Whitelisted</Trans>,
];

const usd = (value: string) => `$${formatUnits(value, BUDGET_USD_DECIMALS)}`;
const isUnlimited = (value: string) => BigInt(value) >= UNCONSTRAINED_THRESHOLD;

export const LiquidityMandateCard = () => {
  const { reserves, loading } = useAppDataContext();
  const { currentAccount } = useWeb3Context();
  const currentMarketData = useRootStore((store) => store.currentMarketData);
  const { openLiquidityMandate } = useModalContext();
  const { data: indexer } = useIndexerStatus();

  const router = currentMarketData.addresses.SHARED_LIQUIDATION_ROUTER;

  const collateralReserves = reserves.filter(
    (reserve) => Number(reserve.formattedBaseLTVasCollateral) > 0
  );

  const { data: mandate, isLoading } = useMandate({
    marketData: currentMarketData,
    user: currentAccount,
    collateralAssets: collateralReserves.map((reserve) => reserve.underlyingAsset),
  });

  // Markets without a shared router cannot host mandates at all.
  if (!router) return null;

  if (loading || isLoading)
    return <ListLoader title={<Trans>Liquidity provider</Trans>} head={head} withTopMargin />;

  const registered = !!mandate?.registered;
  const aggregating = !!mandate?.acceptsAllCollateral;
  const reserveFor = (asset: string) =>
    reserves.find((reserve) => reserve.underlyingAsset.toLowerCase() === asset.toLowerCase());

  return (
    <ListWrapper
      withTopMargin
      titleComponent={
        <Stack direction="row" alignItems="center" gap={2} sx={{ mr: 4 }}>
          <Typography component="div" variant="h3">
            <Trans>Liquidity provider</Trans>
          </Typography>
          {registered && (
            <Chip
              size="small"
              label={mandate?.enabled ? <Trans>Active</Trans> : <Trans>Paused</Trans>}
              color={mandate?.enabled ? 'success' : 'default'}
            />
          )}
          {registered && !mandate?.isArmed && (
            <Chip size="small" label={<Trans>Not armed</Trans>} color="warning" />
          )}
          {registered && (
            <Chip
              size="small"
              variant="outlined"
              label={aggregating ? <Trans>All collateral</Trans> : <Trans>Selected assets</Trans>}
            />
          )}
        </Stack>
      }
      localStorageName="liquidityMandateDashboardCollapse"
      noData={!registered}
    >
      {/* "Indexer down" and "nothing has happened yet" look identical otherwise, and only
          one of them is a problem. */}
      {indexer && !indexer.online && (
        <Box sx={{ px: { xs: 4, xsm: 6 }, pt: 3 }}>
          <Warning severity="info" sx={{ mb: 0 }}>
            <Trans>
              The liquidation indexer is unreachable, so history and lifetime totals are hidden.
              Everything below is read directly from the chain and is current.
            </Trans>
          </Warning>
        </Box>
      )}

      {!registered ? (
        <Box sx={{ px: { xs: 4, xsm: 6 }, py: 4 }}>
          <Typography color="text.secondary" sx={{ mb: 3 }}>
            <Trans>
              Register a recipient to provide liquidity for liquidations. Your aTokens cover the
              debt and the seized collateral is sent to the recipient you nominate.
            </Trans>
          </Typography>
          <Button
            variant="contained"
            onClick={() => openLiquidityMandate('register')}
            data-cy="registerMandateButton"
          >
            <Trans>Register</Trans>
          </Button>
        </Box>
      ) : (
        <Box sx={{ px: { xs: 4, xsm: 6 }, pb: 4 }}>
          {!mandate?.isArmed && (
            <Warning severity="warning" sx={{ mt: 2 }}>
              <Trans>
                You have no usable aToken allowance for the router, so you are skipped in every
                liquidation. Arm a debt asset below to start participating.
              </Trans>
            </Warning>
          )}

          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 3, flexWrap: 'wrap', gap: 2 }}
          >
            <Box>
              <Typography variant="description" color="text.secondary">
                <Trans>Collateral recipient</Trans>
              </Typography>
              <CompactableTypography variant="secondary14" compactMode={CompactMode.MD}>
                {mandate?.recipient ?? ''}
              </CompactableTypography>
            </Box>
            <Stack direction="row" gap={2}>
              <Button
                size="small"
                variant="outlined"
                onClick={() => openLiquidityMandate('recipient')}
              >
                <Trans>Change</Trans>
              </Button>
              <Button
                size="small"
                variant="outlined"
                onClick={() => openLiquidityMandate('enabled')}
              >
                {mandate?.enabled ? <Trans>Pause</Trans> : <Trans>Resume</Trans>}
              </Button>
            </Stack>
          </Stack>

          {/* Arming: the aToken allowance and balance that make a liquidation possible. */}
          <Typography variant="subheader2" color="text.secondary" sx={{ mt: 4 }}>
            <Trans>Debt assets you cover</Trans>
          </Typography>
          {mandate?.debtAssets.map((debtAsset) => {
            const reserve = reserveFor(debtAsset.asset);
            const decimals = reserve?.decimals ?? 6;
            const hasAllowance = BigInt(debtAsset.allowance) > BigInt(0);
            const hasBalance = BigInt(debtAsset.balance) > BigInt(0);

            return (
              <Stack
                key={debtAsset.asset}
                direction="row"
                justifyContent="space-between"
                alignItems="center"
                sx={{ py: 2, borderBottom: 1, borderColor: 'divider', flexWrap: 'wrap', gap: 2 }}
              >
                <Stack direction="row" alignItems="center" gap={2}>
                  {reserve && <TokenIcon symbol={reserve.iconSymbol} sx={{ fontSize: '24px' }} />}
                  <Box>
                    <Typography variant="secondary14">
                      {reserve?.symbol ?? debtAsset.asset}
                    </Typography>
                    {/* All the ceilings at once: any single zero makes the LP useless while
                        the rest still look healthy. */}
                    <Typography variant="caption" color="text.secondary">
                      {hasAllowance ? (
                        <Trans>
                          Allowance{' '}
                          {isUnlimited(debtAsset.allowance)
                            ? 'unlimited'
                            : formatUnits(debtAsset.allowance, decimals)}
                        </Trans>
                      ) : (
                        <Typography component="span" variant="caption" color="warning.main">
                          <Trans>No allowance</Trans>
                        </Typography>
                      )}
                      {' · '}
                      {hasBalance ? (
                        <Trans>Balance {formatUnits(debtAsset.balance, decimals)}</Trans>
                      ) : (
                        <Typography component="span" variant="caption" color="warning.main">
                          <Trans>No aToken balance</Trans>
                        </Typography>
                      )}
                      {' · '}
                      {debtAsset.maxDebt === '0' ? (
                        <Trans>No per-liquidation cap</Trans>
                      ) : (
                        <Trans>Cap {formatUnits(debtAsset.maxDebt, decimals)}</Trans>
                      )}
                    </Typography>
                  </Box>
                </Stack>
                <Stack direction="row" gap={1}>
                  {hasAllowance && (
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openLiquidityMandate('arm', debtAsset.asset, true)}
                    >
                      <Trans>Revoke</Trans>
                    </Button>
                  )}
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => openLiquidityMandate('maxDebt', debtAsset.asset)}
                  >
                    <Trans>Cap</Trans>
                  </Button>
                  <Button
                    size="small"
                    variant="contained"
                    onClick={() => openLiquidityMandate('arm', debtAsset.asset)}
                  >
                    <Trans>Arm</Trans>
                  </Button>
                </Stack>
              </Stack>
            );
          })}

          {/* Collateral: exactly one of the two modes applies. */}
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
            sx={{ mt: 4, flexWrap: 'wrap', gap: 2 }}
          >
            <Typography variant="subheader2" color="text.secondary">
              <Trans>Collateral you accept</Trans>
            </Typography>
            <Button
              size="small"
              variant="outlined"
              onClick={() => openLiquidityMandate('acceptAll')}
            >
              {aggregating ? <Trans>Choose assets</Trans> : <Trans>Accept all</Trans>}
            </Button>
          </Stack>

          {aggregating ? (
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{ py: 2, flexWrap: 'wrap', gap: 2 }}
            >
              <Box>
                <Typography variant="secondary14">
                  <Trans>Pooled budget</Trans>
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {mandate?.globalBudgetUnconstrained ? (
                    <Trans>Unlimited — funds any property, including ones listed later</Trans>
                  ) : BigInt(mandate?.globalBudget ?? '0') > BigInt(0) ? (
                    <Trans>
                      {usd(mandate?.globalBudget ?? '0')} remaining, spendable on any property
                    </Trans>
                  ) : (
                    <Typography component="span" variant="caption" color="warning.main">
                      <Trans>Exhausted — you are skipped until you top it up</Trans>
                    </Typography>
                  )}
                </Typography>
              </Box>
              <Button
                size="small"
                variant="contained"
                onClick={() => openLiquidityMandate('globalBudget')}
              >
                <Trans>Top up</Trans>
              </Button>
            </Stack>
          ) : (
            <>
              <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: 1 }}>
                <Trans>Budgets are in USD. A budget of zero means the asset is not accepted.</Trans>
              </Typography>
              {mandate?.budgets.map((budget) => {
                const reserve = reserveFor(budget.asset);
                const accepted = BigInt(budget.budget) > BigInt(0);

                return (
                  <Stack
                    key={budget.asset}
                    direction="row"
                    justifyContent="space-between"
                    alignItems="center"
                    sx={{
                      py: 2,
                      borderBottom: 1,
                      borderColor: 'divider',
                      flexWrap: 'wrap',
                      gap: 2,
                    }}
                  >
                    <Stack direction="row" alignItems="center" gap={2}>
                      {reserve && (
                        <TokenIcon symbol={reserve.iconSymbol} sx={{ fontSize: '24px' }} />
                      )}
                      <Box>
                        <Typography variant="secondary14">
                          {reserve?.symbol ?? budget.asset}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {!accepted ? (
                            <Trans>Not accepted</Trans>
                          ) : budget.unconstrained ? (
                            <Trans>Unlimited</Trans>
                          ) : (
                            <>
                              <FormattedNumber
                                value={formatUnits(budget.remaining, BUDGET_USD_DECIMALS)}
                                symbol="USD"
                                variant="caption"
                              />
                              {' / '}
                              <FormattedNumber
                                value={formatUnits(budget.budget, BUDGET_USD_DECIMALS)}
                                symbol="USD"
                                variant="caption"
                              />
                            </>
                          )}
                          {budget.lifetime && budget.lifetime.fillCount > 0 && (
                            <Tooltip title={<Trans>Lifetime, from the indexer</Trans>}>
                              <span>
                                {' · '}
                                <Trans>
                                  {budget.lifetime.fillCount} fills,{' '}
                                  {usd(budget.lifetime.totalReceivedUsd)} received
                                </Trans>
                              </span>
                            </Tooltip>
                          )}
                          {!budget.whitelisted && (
                            <>
                              {' · '}
                              <Typography component="span" variant="caption" color="warning.main">
                                <Trans>Recipient not whitelisted</Trans>
                              </Typography>
                            </>
                          )}
                        </Typography>
                      </Box>
                    </Stack>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => openLiquidityMandate('budget', budget.asset)}
                    >
                      <Trans>Set budget</Trans>
                    </Button>
                  </Stack>
                );
              })}
            </>
          )}

          <MandateActivity user={currentAccount} reserves={reserves} />
        </Box>
      )}
    </ListWrapper>
  );
};
