export const marketHistoryRangeOptions = ['1w', '1m', '1y', '3y', 'all'] as const;

export type MarketHistoryRange = (typeof marketHistoryRangeOptions)[number];

export const isMarketHistoryRange = (value: string): value is MarketHistoryRange =>
  marketHistoryRangeOptions.includes(value as MarketHistoryRange);

export const marketHistoryRangeToDateRange = (range: MarketHistoryRange) => {
  const now = Date.now();

  switch (range) {
    case '1w':
      return {
        startDate: new Date(now - 7 * 24 * 60 * 60 * 1000),
        endDate: new Date(now),
      };
    case '1m':
      return {
        startDate: new Date(now - 30 * 24 * 60 * 60 * 1000),
        endDate: new Date(now),
      };
    case '1y':
      return {
        startDate: new Date(now - 365 * 24 * 60 * 60 * 1000),
        endDate: new Date(now),
      };
    case '3y':
      return {
        startDate: new Date(now - 3 * 365 * 24 * 60 * 60 * 1000),
        endDate: new Date(now),
      };
    case 'all':
      return {
        startDate: new Date(0),
        endDate: new Date(now),
      };
  }
};

export const marketHistoryRangeToBucketMs = (range: MarketHistoryRange) => {
  switch (range) {
    case '1w':
      return 60 * 60 * 1000;
    case '1m':
      return 4 * 60 * 60 * 1000;
    case '1y':
      return 24 * 60 * 60 * 1000;
    case '3y':
      return 24 * 60 * 60 * 1000;
    case 'all':
      return 7 * 24 * 60 * 60 * 1000;
  }
};
