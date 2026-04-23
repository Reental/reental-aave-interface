import { Trans } from '@lingui/macro';
import { SxProps, Theme } from '@mui/material/styles';
import { Warning } from 'src/components/primitives/Warning';
import { NetworkConfig } from 'src/ui-config/networksConfig';

type WalletEmptyInfoProps = Pick<NetworkConfig, 'bridge' | 'name'> & {
  chainId: number;
  icon?: boolean;
  sx?: SxProps<Theme>;
};

export function WalletEmptyInfo({ name, icon, sx }: WalletEmptyInfoProps) {
  return (
    <Warning severity="info" icon={icon} sx={sx}>
      <Trans>Your {name} wallet is empty. Purchase or transfer assets.</Trans>
    </Warning>
  );
}
