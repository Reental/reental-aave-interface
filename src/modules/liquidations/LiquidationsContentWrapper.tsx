import { useState } from 'react';

import { LiquidationsPositionOverview } from './LiquidationsPositionOverview';
import { LiquidationsSetup } from './LiquidationsSetup';
import { LiquidationsConfig } from './types';
import { useLiquidationsData } from './useLiquidationsData';
import { useLiquidationsPosition } from './useLiquidationsPosition';

export const LiquidationsContentWrapper = () => {
  const { deposits, collateralOptions } = useLiquidationsData();
  const { position, savePosition } = useLiquidationsPosition();
  const [isEditing, setIsEditing] = useState(false);

  const handleSubmit = (config: LiquidationsConfig) => {
    // TODO: wire the approve tx to the liquidations contract before persisting
    savePosition(config);
    setIsEditing(false);
  };

  if (position && !isEditing) {
    return (
      <LiquidationsPositionOverview
        position={position}
        deposits={deposits}
        collateralOptions={collateralOptions}
        onEdit={() => setIsEditing(true)}
      />
    );
  }

  return (
    <LiquidationsSetup
      initialConfig={position?.config}
      onSubmit={handleSubmit}
      onCancel={position ? () => setIsEditing(false) : undefined}
    />
  );
};
