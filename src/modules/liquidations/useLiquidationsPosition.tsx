import { useCallback, useEffect, useState } from 'react';
import { useWeb3Context } from 'src/libs/hooks/useWeb3Context';

import { AllocationMode, LiquidationsConfig, StoredLiquidationsPosition } from './types';

// TODO: replace this localStorage mock with reads/writes against the liquidations
// contract (current allowances per wrapped token + accepted collateral set).
const storageKey = (account: string) => `liquidationsPosition:${account.toLowerCase()}`;

/** Shapes older versions of this page may have persisted */
interface LegacyStoredPosition {
  config: {
    allocations?: { underlyingAsset: string; mode?: AllocationMode; amount?: string }[];
    acceptedCollaterals?: (
      | string
      | { underlyingAsset: string; mode?: AllocationMode; amount?: string }
    )[];
  };
  updatedAt: number;
}

/** Upgrades positions stored with older config shapes so parsing them never breaks the page */
const normalizeStoredPosition = (stored: LegacyStoredPosition): StoredLiquidationsPosition => ({
  updatedAt: stored.updatedAt,
  config: {
    allocations: (stored.config.allocations ?? []).map((allocation) => ({
      underlyingAsset: allocation.underlyingAsset,
      mode: allocation.mode ?? 'all',
      amount: allocation.amount ?? '',
    })),
    acceptedCollaterals: (stored.config.acceptedCollaterals ?? []).map((collateral) =>
      typeof collateral === 'string'
        ? { underlyingAsset: collateral, mode: 'all' as const, amount: '' }
        : {
            underlyingAsset: collateral.underlyingAsset,
            mode: collateral.mode ?? 'all',
            amount: collateral.amount ?? '',
          }
    ),
  },
});

export const useLiquidationsPosition = () => {
  const { currentAccount } = useWeb3Context();
  const [position, setPosition] = useState<StoredLiquidationsPosition | null>(null);

  useEffect(() => {
    if (!currentAccount) {
      setPosition(null);
      return;
    }
    try {
      const stored = localStorage.getItem(storageKey(currentAccount));
      setPosition(
        stored ? normalizeStoredPosition(JSON.parse(stored) as LegacyStoredPosition) : null
      );
    } catch {
      setPosition(null);
    }
  }, [currentAccount]);

  const savePosition = useCallback(
    (config: LiquidationsConfig) => {
      if (!currentAccount) return;
      const next: StoredLiquidationsPosition = { config, updatedAt: Date.now() };
      localStorage.setItem(storageKey(currentAccount), JSON.stringify(next));
      setPosition(next);
    },
    [currentAccount]
  );

  const clearPosition = useCallback(() => {
    if (!currentAccount) return;
    localStorage.removeItem(storageKey(currentAccount));
    setPosition(null);
  }, [currentAccount]);

  return { position, savePosition, clearPosition };
};
