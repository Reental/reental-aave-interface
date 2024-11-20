import { Trans } from '@lingui/macro';
import FacebookIcon from '@mui/icons-material/Facebook';
import InstagramIcon from '@mui/icons-material/Instagram';
import LinkedInIcon from '@mui/icons-material/LinkedIn';
import TelegramIcon from '@mui/icons-material/Telegram';
import XIcon from '@mui/icons-material/X';
import YouTubeIcon from '@mui/icons-material/YouTube';
import { Box, styled, SvgIcon, Typography } from '@mui/material';
import { Link } from 'src/components/primitives/Link';

import DiscordIcon from '/public/icons/discord.svg';

interface StyledLinkProps {
  onClick?: React.MouseEventHandler<HTMLAnchorElement>;
}

const StyledLink = styled(Link)<StyledLinkProps>(({ theme }) => ({
  color: theme.palette.text.muted,
  '&:hover': {
    color: theme.palette.text.primary,
  },
  display: 'flex',
  alignItems: 'center',
}));

const FOOTER_ICONS = [
  {
    href: 'https://www.youtube.com/channel/UCyZespLYqbv-Cxs19ASFalw',
    icon: <YouTubeIcon />,
    title: 'YouTube',
  },
  {
    href: 'https://www.linkedin.com/company/reental/',
    icon: <LinkedInIcon />,
    title: 'LinkedIn',
  },
  {
    href: 'https://www.instagram.com/reental.co',
    icon: <InstagramIcon />,
    title: 'Instagram',
  },
  {
    href: 'https://x.com/Reental_co',
    icon: <XIcon />,
    title: 'X',
  },
  {
    href: 'https://www.facebook.com/Reental/',
    icon: <FacebookIcon />,
    title: 'Facebook',
  },
  {
    href: 'https://discord.gg/QnU76B9PbP',
    icon: <DiscordIcon />,
    title: 'Discord',
  },
  {
    href: 'https://t.me/reental',
    icon: <TelegramIcon />,
    title: 'Telegram',
  },
];

export function AppFooter() {
  const FOOTER_LINKS = [
    {
      href: '/terms',
      label: <Trans>Terms</Trans>,
      key: 'Terms',
    },
  ];

  return (
    <Box
      sx={(theme) => ({
        display: 'flex',
        padding: ['22px 0px 40px 0px', '0 22px 0 40px', '20px 22px'],
        width: '100%',
        justifyContent: 'space-between',
        alignItems: 'center',
        gap: '22px',
        flexDirection: ['column', 'column', 'row'],
        boxShadow:
          theme.palette.mode === 'light'
            ? 'inset 0px 1px 0px rgba(0, 0, 0, 0.04)'
            : 'inset 0px 1px 0px rgba(255, 255, 255, 0.12)',
      })}
    >
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {FOOTER_LINKS.map((link) => (
          <StyledLink key={link.key} href={link.href} target="_blank">
            <Typography variant="caption">{link.label}</Typography>
          </StyledLink>
        ))}
      </Box>
      <Box sx={{ display: 'flex', gap: '10px', alignItems: 'center' }}>
        {FOOTER_ICONS.map((icon) => (
          <StyledLink href={icon.href} key={icon.title}>
            <SvgIcon
              sx={{
                fontSize: [24, 24, 20],
              }}
            >
              {icon.icon}
            </SvgIcon>
          </StyledLink>
        ))}
      </Box>
    </Box>
  );
}
