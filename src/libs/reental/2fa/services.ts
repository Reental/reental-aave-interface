import { useQuery } from '@tanstack/react-query';

import { request } from '../gql/client';
import { GetTwoFaAccountDocument } from '../gql/types/graphql';

export function use2FA({
  url,
  chainId,
  asset,
  user,
  enabled = true,
}: {
  url?: string;
  chainId: number;
  asset: string;
  user: string;
  enabled?: boolean;
}) {
  return useQuery({
    queryKey: ['2fa', url, chainId, asset, user],
    enabled: enabled && !!url,
    queryFn: () => request(url as string, GetTwoFaAccountDocument, { chainId, asset, user }),
    select: (data) => data,
    retry: (failureCount) => failureCount < 3,
    retryDelay: (attempt) => Math.min(1000 * 2 ** attempt, 15_000),
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
