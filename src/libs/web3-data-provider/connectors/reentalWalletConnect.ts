import { navigateReentalPopup, REENTAL_CONNECTOR_ID } from 'src/ui-config/reentalWalletConnect';
import { createConnector } from 'wagmi';
import { walletConnect } from 'wagmi/connectors';

type ReentalWalletConnectParameters = {
  projectId: string;
};

/**
 * WalletConnect connector branded as Reental: no QR modal; opens app /dashboard?uri=.
 */
export function reentalWalletConnect({ projectId }: ReentalWalletConnectParameters) {
  return createConnector((config) => {
    const wc = walletConnect({
      projectId,
      showQrModal: false,
      metadata: {
        name: 'RNT Lend',
        description: 'Collateralization platform',
        url: 'https://lend.rnt.finance',
        icons: ['https://lend.rnt.finance/favicon.svg'],
      },
    })(config);

    let displayUriHandler: ((uri: string) => void) | undefined;

    return {
      ...wc,
      id: REENTAL_CONNECTOR_ID,
      name: 'Reental',
      async connect(params) {
        const provider = await wc.getProvider();
        if (provider && !displayUriHandler) {
          displayUriHandler = (uri: string) => {
            navigateReentalPopup(uri);
          };
          provider.on('display_uri', displayUriHandler);
        }

        try {
          return await wc.connect(params);
        } finally {
          if (provider && displayUriHandler) {
            provider.removeListener('display_uri', displayUriHandler);
            displayUriHandler = undefined;
          }
        }
      },
    };
  });
}
