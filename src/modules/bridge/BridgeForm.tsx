import { ExternalLinkIcon, SwitchVerticalIcon } from '@heroicons/react/outline';
import { Trans } from '@lingui/macro';
import {
  Box,
  Button,
  CircularProgress,
  IconButton,
  InputBase,
  Paper,
  SvgIcon,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from '@mui/material';
import { useQueryClient } from '@tanstack/react-query';
import { BigNumber, PopulatedTransaction } from 'ethers';
import { formatUnits, parseUnits } from 'ethers/lib/utils';
import { ReactNode, useState } from 'react';
import { MarketLogo } from 'src/components/MarketSwitcher';
import { FormattedNumber } from 'src/components/primitives/FormattedNumber';
import { Link, ROUTES } from 'src/components/primitives/Link';
import { TokenIcon } from 'src/components/primitives/TokenIcon';
import { Warning } from 'src/components/primitives/Warning';
import { NumberFormatCustom } from 'src/components/transactions/Switch/SwitchAssetInput';
import { ConnectWalletButton } from 'src/components/WalletConnection/ConnectWalletButton';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';
import { getEthersProvider } from 'src/libs/web3-data-provider/adapters/EthersAdapter';
import { useRootStore } from 'src/store/root';
import { wagmiConfig } from 'src/ui-config/wagmiConfig';
import { getNetworkConfig } from 'src/utils/marketsAndNetworksConfig';

import { BRIDGE_ASSETS, BRIDGE_CHAIN_IDS, BridgeAsset, getBridgeToken } from './bridgeConfig';
import {
  BridgeQuoteParams,
  fetchBridgeApproval,
  fetchBridgeQuote,
  fetchBridgeTransaction,
  UniswapApiError,
  UniswapTransaction,
} from './uniswapBridgeApi';
import {
  useBridgeQuote,
  useBridgeStatus,
  useBridgeTokenBalance,
  useDebouncedValue,
} from './useBridgeData';

type Step = 'idle' | 'approving' | 'bridging' | 'confirming' | 'submitted';

const toEthersTx = (tx: UniswapTransaction): PopulatedTransaction => {
  if (!tx.data || tx.data === '0x') throw new Error('Invalid transaction returned by Uniswap');
  return {
    to: tx.to,
    data: tx.data,
    value: BigNumber.from(tx.value || 0),
    gasLimit: tx.gasLimit ? BigNumber.from(tx.gasLimit) : undefined,
  };
};

const toBaseUnits = (amount: string, decimals: number) => {
  try {
    return amount && Number(amount) > 0 ? parseUnits(amount, decimals).toString() : '';
  } catch {
    return '';
  }
};

const getErrorMessage = (error: unknown): ReactNode => {
  if (error instanceof UniswapApiError) {
    if (error.errorCode === 'QuoteAmountTooLowError') {
      return <Trans>The amount is below the minimum that can be bridged.</Trans>;
    }
    if (error.errorCode === 'ResourceNotFound' || error.errorCode === 'NoRouteFoundError') {
      return <Trans>No bridge route is available for this amount right now.</Trans>;
    }
    return error.message;
  }
  const { code, message } = (error || {}) as { code?: string | number; message?: string };
  if (code === 4001 || code === 'ACTION_REJECTED') {
    return <Trans>Transaction rejected in your wallet.</Trans>;
  }
  return message || <Trans>Something went wrong. Please try again.</Trans>;
};

const NetworkLabel = ({ chainId }: { chainId: number }) => {
  const network = getNetworkConfig(chainId);
  return (
    <Box sx={{ display: 'flex', alignItems: 'center' }}>
      <MarketLogo size={20} logo={network.networkLogoPath} sx={{ mr: 1.5 }} />
      <Typography variant="subheader1">{network.name}</Typography>
    </Box>
  );
};

const DetailRow = ({ label, children }: { label: ReactNode; children: ReactNode }) => (
  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', py: 1 }}>
    <Typography variant="description" color="text.secondary">
      {label}
    </Typography>
    <Box sx={{ display: 'flex', alignItems: 'center' }}>{children}</Box>
  </Box>
);

export const BridgeForm = () => {
  const queryClient = useQueryClient();
  const {
    currentAccount,
    chainId: connectedChainId,
    switchNetwork,
    readOnlyModeAddress,
  } = useWeb3Context();
  const currentChainId = useRootStore((store) => store.currentMarketData.chainId);

  const [fromChainId, setFromChainId] = useState<number>(() =>
    BRIDGE_CHAIN_IDS.includes(currentChainId) ? currentChainId : BRIDGE_CHAIN_IDS[0]
  );
  const toChainId = BRIDGE_CHAIN_IDS.find((chainId) => chainId !== fromChainId) as number;
  const [asset, setAsset] = useState<BridgeAsset>('USDC');
  const [amount, setAmount] = useState('');
  const [step, setStep] = useState<Step>('idle');
  const [txHash, setTxHash] = useState<string>();
  const [txError, setTxError] = useState<ReactNode>();

  const tokenIn = getBridgeToken(asset, fromChainId);
  const tokenOut = getBridgeToken(asset, toChainId);
  if (!tokenIn || !tokenOut) throw new Error(`Missing bridge token for ${asset}`);

  const { data: balance } = useBridgeTokenBalance(tokenIn, currentAccount);
  const debouncedAmount = useDebouncedValue(amount);
  const quoteParams: Omit<BridgeQuoteParams, 'swapper'> = {
    tokenIn: tokenIn.address,
    tokenInChainId: tokenIn.chainId,
    tokenOut: tokenOut.address,
    tokenOutChainId: tokenOut.chainId,
    amount: toBaseUnits(debouncedAmount, tokenIn.decimals),
  };
  const quoteQuery = useBridgeQuote({ ...quoteParams, swapper: currentAccount });
  const quote = quoteQuery.data?.quote;
  const { data: deliveryStatus } = useBridgeStatus(
    step === 'submitted' ? txHash : undefined,
    fromChainId
  );

  const isBusy = step === 'approving' || step === 'bridging' || step === 'confirming';
  const insufficientBalance = !!balance && !!amount && Number(amount) > Number(balance);
  const quoteIsStale = amount !== debouncedAmount;
  const receiveAmount = quote ? formatUnits(quote.output.amount, tokenOut.decimals) : undefined;
  const bridgeFee =
    quote && BigNumber.from(quote.input.amount).gte(quote.output.amount)
      ? formatUnits(BigNumber.from(quote.input.amount).sub(quote.output.amount), tokenIn.decimals)
      : undefined;

  const resetResult = () => {
    setStep('idle');
    setTxHash(undefined);
    setTxError(undefined);
  };

  const handleFlip = () => {
    resetResult();
    setAmount('');
    setFromChainId(toChainId);
  };

  const handleBridge = async () => {
    setTxError(undefined);
    const params: BridgeQuoteParams = {
      ...quoteParams,
      amount: toBaseUnits(amount, tokenIn.decimals),
      swapper: currentAccount,
    };
    let sentTxHash: string | undefined;
    try {
      const provider = await getEthersProvider(wagmiConfig, { chainId: fromChainId });
      const signer = provider.getSigner(currentAccount);

      setStep('approving');
      const { approval, cancel } = await fetchBridgeApproval(params);
      // USDT on Ethereum must reset an existing allowance to zero before approving again
      if (cancel) await (await signer.sendTransaction(toEthersTx(cancel))).wait();
      if (approval) await (await signer.sendTransaction(toEthersTx(approval))).wait();

      // Re-quote right before sending so the calldata reflects current prices
      setStep('bridging');
      const fresh = await fetchBridgeQuote(params);
      if (fresh.routing !== 'BRIDGE') throw new Error('Bridge route is not available');
      const { swap } = await fetchBridgeTransaction(fresh.quote);
      if (
        swap.from.toLowerCase() !== currentAccount.toLowerCase() ||
        Number(swap.chainId) !== fromChainId
      ) {
        throw new Error('Unexpected transaction returned by Uniswap');
      }
      const tx = await signer.sendTransaction(toEthersTx(swap));
      sentTxHash = tx.hash;
      setTxHash(tx.hash);

      setStep('confirming');
      await tx.wait();
      setStep('submitted');
      setAmount('');
      queryClient.invalidateQueries({ queryKey: ['bridgeTokenBalance'] });
    } catch (error) {
      setTxError(getErrorMessage(error));
      setStep(sentTxHash ? 'submitted' : 'idle');
    }
  };

  const renderAction = () => {
    if (!currentAccount) return <ConnectWalletButton funnel="bridge" fullWidth size="large" />;
    if (readOnlyModeAddress) {
      return (
        <Button variant="contained" size="large" disabled fullWidth>
          <Trans>Watch-only mode: connect a wallet to bridge</Trans>
        </Button>
      );
    }
    if (connectedChainId !== fromChainId) {
      return (
        <Button
          variant="contained"
          size="large"
          fullWidth
          onClick={() => switchNetwork(fromChainId)}
        >
          <Trans>Switch to {getNetworkConfig(fromChainId).name}</Trans>
        </Button>
      );
    }
    const labels: Record<Step, ReactNode> = {
      idle: <Trans>Bridge {tokenIn.symbol}</Trans>,
      approving: <Trans>Approving {tokenIn.symbol}...</Trans>,
      bridging: <Trans>Confirm the bridge in your wallet...</Trans>,
      confirming: <Trans>Waiting for confirmation...</Trans>,
      submitted: <Trans>Bridge {tokenIn.symbol}</Trans>,
    };
    return (
      <Button
        variant="contained"
        size="large"
        fullWidth
        onClick={handleBridge}
        disabled={isBusy || !quote || quoteIsStale || insufficientBalance || !Number(amount)}
        startIcon={isBusy ? <CircularProgress color="inherit" size="16px" /> : undefined}
      >
        {insufficientBalance ? <Trans>Insufficient {tokenIn.symbol} balance</Trans> : labels[step]}
      </Button>
    );
  };

  return (
    <Paper sx={{ width: '100%', maxWidth: 480, mx: 'auto', p: { xs: 4, xsm: 6 } }}>
      <ToggleButtonGroup
        value={asset}
        exclusive
        fullWidth
        size="small"
        onChange={(_, value: BridgeAsset | null) => {
          if (!value || isBusy) return;
          resetResult();
          setAsset(value);
        }}
        sx={{ mb: 4 }}
      >
        {BRIDGE_ASSETS.map((bridgeAsset) => (
          <ToggleButton key={bridgeAsset} value={bridgeAsset} sx={{ gap: 1.5 }}>
            <TokenIcon symbol={bridgeAsset} sx={{ fontSize: '20px' }} />
            {bridgeAsset}
          </ToggleButton>
        ))}
      </ToggleButtonGroup>

      <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '6px', px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="description"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                <Trans>From</Trans>
              </Typography>
              <InputBase
                sx={{ width: '100%', fontSize: '21px' }}
                placeholder="0.00"
                value={amount}
                disabled={isBusy}
                onChange={(e) => {
                  if (step === 'submitted') resetResult();
                  setAmount(e.target.value);
                }}
                inputProps={{ 'aria-label': 'amount input' }}
                // eslint-disable-next-line
                inputComponent={NumberFormatCustom as any}
              />
            </Box>
            <NetworkLabel chainId={fromChainId} />
          </Box>
          {currentAccount && (
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', mt: 1 }}>
              <Typography variant="secondary12" color="text.secondary">
                <Trans>Balance</Trans>
              </Typography>
              <FormattedNumber
                value={balance || '0'}
                compact
                variant="secondary12"
                color="text.secondary"
                sx={{ ml: 1 }}
              />
              <Button
                size="small"
                sx={{ minWidth: 0, ml: 2, p: 0 }}
                disabled={isBusy || !Number(balance)}
                onClick={() => balance && setAmount(balance)}
              >
                <Trans>Max</Trans>
              </Button>
            </Box>
          )}
        </Box>

        {/* Zero-height row in the gap between both boxes keeps the button centered on it */}
        <Box
          sx={{
            height: 0,
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1,
          }}
        >
          <IconButton
            onClick={handleFlip}
            disabled={isBusy}
            aria-label="switch bridge direction"
            sx={{
              border: '1px solid',
              borderColor: 'divider',
              backgroundColor: 'background.paper',
              '&:hover': { backgroundColor: 'background.surface' },
            }}
          >
            <SvgIcon sx={{ color: 'primary.main', fontSize: '18px' }}>
              <SwitchVerticalIcon />
            </SvgIcon>
          </IconButton>
        </Box>

        <Box sx={{ border: 1, borderColor: 'divider', borderRadius: '6px', px: 3, py: 2 }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
            <Box sx={{ flex: 1, minWidth: 0 }}>
              <Typography
                variant="description"
                color="text.secondary"
                sx={{ display: 'block', mb: 1 }}
              >
                <Trans>To</Trans>
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', minHeight: '28px' }}>
                {quoteQuery.isFetching && !quote ? (
                  <CircularProgress color="inherit" size="16px" />
                ) : (
                  <FormattedNumber
                    value={Number(amount) && receiveAmount ? receiveAmount : 0}
                    variant="main21"
                    visibleDecimals={2}
                  />
                )}
              </Box>
            </Box>
            <NetworkLabel chainId={toChainId} />
          </Box>
        </Box>
      </Box>

      {quote && !!Number(amount) && (
        <Box sx={{ mt: 4 }}>
          <DetailRow label={<Trans>Bridge fee</Trans>}>
            <FormattedNumber value={bridgeFee || 0} variant="secondary14" visibleDecimals={2} />
            <Typography variant="secondary14" sx={{ ml: 1 }}>
              {tokenIn.symbol}
            </Typography>
          </DetailRow>
          {quote.gasFeeUSD && (
            <DetailRow label={<Trans>Network fee</Trans>}>
              <FormattedNumber
                value={quote.gasFeeUSD}
                symbol="USD"
                variant="secondary14"
                visibleDecimals={2}
              />
            </DetailRow>
          )}
          {quote.estimatedFillTimeMs !== undefined && (
            <DetailRow label={<Trans>Estimated time</Trans>}>
              <Typography variant="secondary14">
                ~{Math.max(1, Math.round(quote.estimatedFillTimeMs / 1000))}s
              </Typography>
            </DetailRow>
          )}
        </Box>
      )}

      {quoteQuery.error && !!Number(amount) && !quoteIsStale && (
        <Warning severity="warning" sx={{ mt: 4, mb: 0 }}>
          {getErrorMessage(quoteQuery.error)}
        </Warning>
      )}
      {txError && (
        <Warning severity="error" sx={{ mt: 4, mb: 0 }}>
          {txError}
        </Warning>
      )}

      {txHash && (
        <Warning
          severity={deliveryStatus === 'FAILED' || deliveryStatus === 'EXPIRED' ? 'error' : 'info'}
          sx={{ mt: 4, mb: 0 }}
        >
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
            <Typography variant="description">
              {step !== 'submitted' ? (
                <Trans>Bridge transaction sent.</Trans>
              ) : deliveryStatus === 'SUCCESS' ? (
                <Trans>Funds delivered on {getNetworkConfig(toChainId).name}.</Trans>
              ) : deliveryStatus === 'FAILED' || deliveryStatus === 'EXPIRED' ? (
                <Trans>The bridge could not be completed. Your funds will be refunded.</Trans>
              ) : (
                <Trans>
                  Waiting for the funds to arrive on {getNetworkConfig(toChainId).name}...
                </Trans>
              )}
            </Typography>
            <Link
              href={getNetworkConfig(fromChainId).explorerLinkBuilder({ tx: txHash })}
              sx={{ display: 'inline-flex', alignItems: 'center', gap: 0.5 }}
            >
              <Trans>View transaction</Trans>
              <SvgIcon sx={{ fontSize: 14 }}>
                <ExternalLinkIcon />
              </SvgIcon>
            </Link>
            {deliveryStatus === 'SUCCESS' && (
              <Button
                component={Link}
                href={ROUTES.markets}
                variant="outlined"
                size="small"
                sx={{ alignSelf: 'flex-start', mt: 1 }}
              >
                <Trans>Back to markets</Trans>
              </Button>
            )}
          </Box>
        </Warning>
      )}

      <Box sx={{ mt: 4 }}>{renderAction()}</Box>

      <Typography
        variant="caption"
        color="text.muted"
        sx={{ display: 'block', textAlign: 'center', mt: 3 }}
      >
        <Trans>Bridging powered by Uniswap and Across.</Trans>
      </Typography>
    </Paper>
  );
};
