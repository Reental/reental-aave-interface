import { LiquidationRouterPosition } from './useLiquidationRouterPositions';

export type LiquidationRouterItem = LiquidationRouterPosition & {
  is2FAEnabled: boolean;
};
