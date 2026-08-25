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
  const { position } = useLiquidationsPosition();

  const goToSetup = () => router.push(ROUTES.liquidationsSetup);

  if (!position) {
    return <LiquidationsNoPosition onSetup={goToSetup} />;
  }

  return (
    <LiquidationsPositionOverview
      position={position}
      deposits={deposits}
      collateralOptions={collateralOptions}
      onEdit={goToSetup}
    />
  );
};
