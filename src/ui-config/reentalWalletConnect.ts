/**
 * Reental WalletConnect (opción A): URL de la app wallet por mercado + helpers de pestaña.
 * Spec: docs/reental-walletconnect-spec.pdf
 * Handoff app: docs/reental-walletconnect-handoff.md
 */

export const REENTAL_CONNECTOR_ID = 'reental';

/**
 * Peer metadata that the Reental app WalletKit MUST publish (wallet side).
 * RNT Lend uses this to show the "connected to Reental" mark for both:
 * - Connect with Reental (connector id `reental`)
 * - Connect wallet → WalletConnect URI pasted into the app
 */
export const REENTAL_WALLET_PEER_METADATA = {
  name: 'Reental',
  description: 'Reental HumanWallet',
  url: 'https://app.reental.co',
} as const;

/** Hosts accepted as Reental app wallet peer (prod + common aliases). */
const REENTAL_PEER_URL_HOSTS = new Set(['app.reental.co', 'reental.co', 'www.reental.co']);

const REENTAL_PEER_NAMES = new Set(['reental', 'reental app', 'humanwallet', 'human wallet']);

export type WalletConnectPeerMetadata = {
  name?: string;
  description?: string;
  url?: string;
  icons?: string[];
};

export const isReentalPeerMetadata = (
  meta: WalletConnectPeerMetadata | null | undefined
): boolean => {
  if (!meta) return false;

  const name = (meta.name || '').trim().toLowerCase();
  if (REENTAL_PEER_NAMES.has(name)) {
    return true;
  }

  const rawUrl = (meta.url || '').trim();
  if (!rawUrl) return false;

  try {
    const host = new URL(
      rawUrl.includes('://') ? rawUrl : `https://${rawUrl}`
    ).hostname.toLowerCase();
    if (REENTAL_PEER_URL_HOSTS.has(host) || host.endsWith('.reental.co')) {
      return true;
    }
  } catch {
    return false;
  }

  return false;
};

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
