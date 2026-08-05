import { Box, keyframes } from '@mui/material';

const rntGradientMove = keyframes`
  0% { background-position: 0% 50%; }
  50% { background-position: 100% 50%; }
  100% { background-position: 0% 50%; }
`;

const rntBloomDrift = keyframes`
  0% { background-position: 0% 0%, 100% 100%, 50% 0%; }
  50% { background-position: 20% 10%, 80% 90%, 60% 15%; }
  100% { background-position: 0% 0%, 100% 100%, 50% 0%; }
`;

/**
 * Low-opacity animated brand gradient backdrop (RNT DS motion tokens).
 * Mount behind page content; respects `prefers-reduced-motion`.
 */
export const GradientBackground = () => {
  return (
    <Box
      aria-hidden
      sx={{
        position: 'fixed',
        inset: 0,
        zIndex: -1,
        pointerEvents: 'none',
        opacity: 0.18,
        backgroundColor: 'transparent',
        backgroundImage: `
          radial-gradient(circle at 30% 40%, rgba(0, 77, 255, 0.55) 0%, transparent 55%),
          radial-gradient(circle at 80% 70%, rgba(151, 255, 56, 0.35) 0%, transparent 50%),
          radial-gradient(circle at 55% 10%, rgba(60, 120, 255, 0.4) 0%, transparent 45%)
        `,
        backgroundSize: '160% 160%, 160% 160%, 160% 160%',
        animation: `${rntBloomDrift} 10s ease-in-out infinite`,
        '@media (prefers-reduced-motion: reduce)': {
          animation: 'none',
          backgroundImage:
            'linear-gradient(135deg, rgba(0, 77, 255, 0.25) 0%, rgba(151, 255, 56, 0.2) 100%)',
          backgroundSize: '100% 100%',
        },
        // Secondary wash layer for a soft brand sweep (disabled under reduced motion).
        '&::after': {
          content: '""',
          position: 'absolute',
          inset: 0,
          backgroundImage: 'linear-gradient(135deg, #004DFF 0%, #97FF38 100%)',
          backgroundSize: '220% 220%',
          opacity: 0.12,
          animation: `${rntGradientMove} 8s ease-in-out infinite`,
          '@media (prefers-reduced-motion: reduce)': {
            animation: 'none',
            opacity: 0.08,
            backgroundSize: '100% 100%',
          },
        },
      }}
    />
  );
};
