import { act, configure, fireEvent, render, screen } from '@testing-library/react';
import { ReactNode } from 'react';

import { LIQUIDITY_NOTICE_LOCK_SECONDS, LiquidityNoticeModal } from '../LiquidityNoticeModal';

// The app tags elements with data-cy (shared with Cypress), BasicModal's close button included.
configure({ testIdAttribute: 'data-cy' });

// next/jest compiles with SWC, which does not run the lingui macro: render the source text.
jest.mock('@lingui/macro', () => ({
  Trans: ({ children }: { children: ReactNode }) => <>{children}</>,
}));

const renderModal = () => render(<LiquidityNoticeModal />);

const closeButton = () => screen.getByTestId('LiquidityNoticeModal-close');
const isOpen = () => screen.queryByTestId('LiquidityNoticeModal') !== null;

// The countdown schedules one timeout per second after each render, so advance one at a time.
const tickSeconds = (seconds: number) => {
  for (let i = 0; i < seconds; i++) {
    act(() => {
      jest.advanceTimersByTime(1000);
    });
  }
};

describe('LiquidityNoticeModal', () => {
  beforeEach(() => jest.useFakeTimers());
  afterEach(() => jest.useRealTimers());

  it('cannot be dismissed during the lock period', () => {
    renderModal();

    expect(isOpen()).toBe(true);
    expect(closeButton()).toBeDisabled();
    expect(closeButton()).toHaveTextContent(`(${LIQUIDITY_NOTICE_LOCK_SECONDS}s)`);
    expect(screen.queryByTestId('close-button')).toBeNull();

    tickSeconds(LIQUIDITY_NOTICE_LOCK_SECONDS - 1);

    expect(closeButton()).toBeDisabled();
    expect(closeButton()).toHaveTextContent('(1s)');

    fireEvent.click(closeButton());
    fireEvent.keyDown(screen.getByTestId('LiquidityNoticeModal'), { key: 'Escape' });
    expect(isOpen()).toBe(true);
  });

  it('can be dismissed once the lock period is over', () => {
    renderModal();

    tickSeconds(LIQUIDITY_NOTICE_LOCK_SECONDS);

    expect(closeButton()).toBeEnabled();
    expect(closeButton()).not.toHaveTextContent('s)');
    expect(screen.getByTestId('close-button')).toBeInTheDocument();

    fireEvent.click(closeButton());
    expect(isOpen()).toBe(false);
  });
});
