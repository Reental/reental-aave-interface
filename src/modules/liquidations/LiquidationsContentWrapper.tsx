import { Skeleton } from '@mui/material';
import { useRouter } from 'next/router';
import { ROUTES } from 'src/components/primitives/Link';

import { LiquidationsNoPosition } from './LiquidationsNoPosition';
import { LiquidationsPositionOverview } from './LiquidationsPositionOverview';
import { useLiquidationsData } from './useLiquidationsData';
import { useLiquidationsPosition } from './useLiquidationsPosition';

/**
 * Main /liquidations content: shows the user's position (or an empty state).
 * The setup/edit form lives on its own page at /liquidations/setup.
 */
export const LiquidationsContentWrapper = () => {
  const router = useRouter();
  const { deposits, collateralOptions } = useLiquidationsData();
  const { position, mandate, loading } = useLiquidationsPosition();

  const goToSetup = () => router.push(ROUTES.liquidationsSetup);

  // The position is read from the router now, so "no position" is only true once that read
  // has come back. Rendering the empty state first would flash "set up liquidations" at
  // someone who already has.
  if (loading) {
    return <Skeleton variant="rectangular" height={420} sx={{ borderRadius: '6px' }} />;
  }

  if (!position) {
    return <LiquidationsNoPosition onSetup={goToSetup} />;
  }

  return (
    <LiquidationsPositionOverview
      position={position}
      mandate={mandate}
      deposits={deposits}
      collateralOptions={collateralOptions}
      onEdit={goToSetup}
    />
  );
};
