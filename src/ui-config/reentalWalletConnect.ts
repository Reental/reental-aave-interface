/**
 * Reental WalletConnect (opción A): URL de la app wallet + helpers de pestaña.
 * Spec: docs/reental-walletconnect-spec.pdf
 * Handoff app: docs/reental-walletconnect-handoff.md
 */

export const REENTAL_CONNECTOR_ID = 'reental';

/** Base URL del dashboard en la app Reental (sin query). */
export const getReentalWalletConnectBaseUrl = (): string => {
  return (
    process.env.NEXT_PUBLIC_REENTAL_WALLET_CONNECT_URL?.replace(/\/$/, '') ||
    'https://reental.co/dashboard'
  );
};

export const buildReentalConnectUrl = (uri: string): string => {
  const base = getReentalWalletConnectBaseUrl();
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}uri=${encodeURIComponent(uri)}`;
};

type PendingPopup = Window | null;

let pendingReentalPopup: PendingPopup = null;

/** Abrir about:blank en el click (evita bloqueo de pestañas) antes de tener el URI. */
export const openBlankReentalPopup = (): Window | null => {
  const popup = window.open('about:blank', 'reental-wallet');
  pendingReentalPopup = popup;
  return popup;
};

export const navigateReentalPopup = (uri: string): boolean => {
  const url = buildReentalConnectUrl(uri);
  const popup = pendingReentalPopup;
  pendingReentalPopup = null;

  if (popup && !popup.closed) {
    try {
      popup.location.href = url;
      return true;
    } catch {
      // cross-origin / closed — fallback
    }
  }

  const opened = window.open(url, 'reental-wallet');
  return Boolean(opened);
};

export const closePendingReentalPopup = (): void => {
  if (pendingReentalPopup && !pendingReentalPopup.closed) {
    pendingReentalPopup.close();
  }
  pendingReentalPopup = null;
};
