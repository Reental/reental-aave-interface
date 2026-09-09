import { useQuery } from '@tanstack/react-query';

import { request } from '../gql/client';
import { GetTwoFaAccountDocument } from '../gql/types/graphql';

export function use2FA({
  chainId,
  asset,
  user,
  endpoint,
  enabled = true,
}: {
  chainId: number;
  asset: string;
  user: string;
  endpoint?: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['2fa', endpoint, chainId, asset, user],
    queryFn: () => request(GetTwoFaAccountDocument, { chainId, asset, user }, endpoint as string),
    select: (data) => data,
    retry: (failureCount) => failureCount < 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
    enabled: enabled && Boolean(endpoint) && Boolean(user),
    refetchOnWindowFocus: 'always',
    refetchInterval: (query) => {
      if (
        !query.state.data?.twoFaAccount ||
        query.state.data.twoFaAccount.expiresAt * 1000 < Date.now()
      ) {
        return 5000;
      }
      return query.state.data.twoFaAccount.expiresAt * 1000 - Date.now();
    },
  });
}
