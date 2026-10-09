import { useQuery } from '@tanstack/react-query';
import { ethers } from 'ethers';
import { useRootStore } from 'src/store/root';
import { MarketDataType } from 'src/ui-config/marketsConfig';

import { REENTAL_TOKEN_ABI, REENTAL_TOKEN_CONTROL_ABI } from './abi';

/**
 * Whether the router is allowed to hold a given RWA collateral at all.
 *
 * Reental's tokens gate transfers on their own control contract, which is separate from the
 * router's whitelist and — critically — is not modelled by `quote()`. Seized collateral
 * passes through the router before reaching the recipient, so if the router is not permitted
 * to hold the token, the liquidation reverts with ReentalTokenControl_NotWhitelisted even
 * though every provider quoted a healthy number.
 *
 * That combination is the worst possible failure to leave undetected: the book says the
 * liquidation is fundable, the user signs, and the transaction burns gas on a revert whose
 * cause is in a contract the book never mentions.
 */

export type TransferCheck = {
  /** False when the router cannot receive this collateral. */
  routerAllowed: boolean;
  /** Absent for plain ERC20 collateral that has no control contract. */
  controlAddress?: string;
  /** Present when the check itself could not be performed. */
  indeterminate?: boolean;
};

export const useCollateralTransferCheck = ({
  marketData,
  collateralAsset,
  aTokenAddress,
  enabled = true,
}: {
  marketData: MarketDataType;
  collateralAsset?: string;
  /** The Aave aToken holding the collateral — the `from` side of the seizing transfer. */
  aTokenAddress?: string;
  enabled?: boolean;
}) =>
  useQuery({
    queryKey: ['sharedRouterTransferCheck', marketData.chainId, collateralAsset, aTokenAddress],
    enabled: enabled && !!collateralAsset && !!aTokenAddress,
    staleTime: 60_000,
    queryFn: async (): Promise<TransferCheck> => {
      const provider = useRootStore.getState().jsonRpcProvider(marketData.chainId);
      const router = marketData.addresses.SHARED_LIQUIDATION_ROUTER;
      if (!router) return { routerAllowed: true };

      const token = new ethers.Contract(collateralAsset as string, REENTAL_TOKEN_ABI, provider);

      // Only Reental's own tokens carry a control contract; anything else is unrestricted.
      let controlAddress: string;
      try {
        controlAddress = await token.tokenControl();
      } catch {
        return { routerAllowed: true };
      }

      if (!controlAddress || controlAddress === ethers.constants.AddressZero) {
        return { routerAllowed: true };
      }

      const control = new ethers.Contract(controlAddress, REENTAL_TOKEN_CONTROL_ABI, provider);

      try {
        // A nominal amount: this gate is about who may hold the token, not how much. Using
        // the real seize amount would conflate a permission failure with a balance one.
        await control.checkTransfer(collateralAsset, aTokenAddress, router, 1);
        return { routerAllowed: true, controlAddress };
      } catch (error) {
        const message = JSON.stringify(error ?? '');
        if (message.includes('NotWhitelisted')) {
          return { routerAllowed: false, controlAddress };
        }
        // Any other revert is not evidence the router is barred, so it must not be reported
        // as one — a false blocker would stop liquidations that would actually succeed.
        return { routerAllowed: true, controlAddress, indeterminate: true };
      }
    },
  });
