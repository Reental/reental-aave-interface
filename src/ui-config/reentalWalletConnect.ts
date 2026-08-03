/**
 * Reental WalletConnect (opción A): URL de la app wallet por mercado + helpers de pestaña.
 * Spec: docs/reental-walletconnect-spec.pdf
 * Handoff app: docs/reental-walletconnect-handoff.md
 */

export const REENTAL_CONNECTOR_ID = 'reental';

type PendingPopup = Window | null;

let pendingReentalPopup: PendingPopup = null;
/** Base URL del mercado capturada en el click (evita race si cambia el market switcher). */
let pendingBaseUrl: string | null = null;

const normalizeBaseUrl = (url: string): string => url.replace(/\/$/, '');

export const buildReentalConnectUrl = (uri: string, baseUrl: string): string => {
  const base = normalizeBaseUrl(baseUrl);
  const separator = base.includes('?') ? '&' : '?';
  return `${base}${separator}uri=${encodeURIComponent(uri)}`;
};

/** Abrir about:blank en el click (evita bloqueo de pestañas) antes de tener el URI. */
export const openBlankReentalPopup = (baseUrl: string): Window | null => {
  pendingBaseUrl = normalizeBaseUrl(baseUrl);
  const popup = window.open('about:blank', 'reental-wallet');
  pendingReentalPopup = popup;
  return popup;
};

export const navigateReentalPopup = (uri: string): boolean => {
  const baseUrl = pendingBaseUrl;
  pendingBaseUrl = null;

  if (!baseUrl) {
    return false;
  }

  const url = buildReentalConnectUrl(uri, baseUrl);
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
  pendingBaseUrl = null;
};
