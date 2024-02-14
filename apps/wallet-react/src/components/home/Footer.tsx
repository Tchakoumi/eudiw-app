import home from '@iconify/icons-fluent/home-24-regular';
import homeFilled from '@iconify/icons-fluent/home-24-filled';
import qr from '@iconify/icons-fluent/qr-code-28-filled';
import wallet from '@iconify/icons-fluent/wallet-48-regular';
import walletFilled from '@iconify/icons-fluent/wallet-48-filled';
import { Icon, IconifyIcon } from '@iconify/react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useLocation, useNavigate } from 'react-router-dom';
import line from '../../assets/line.png';
import { useTheme } from '../../utils/theme';

interface INavElements {
  icon: IconifyIcon;
  title: string;
  route: string;
  isMain?: boolean;
}

export default function Footer({ showArrow = true }: { showArrow?: boolean }) {
  const location = useLocation();
  const NAV_ELEMENTS: INavElements[] = [
    {
      icon: location.pathname === '/' ? homeFilled : home,
      title: 'Home',
      route: '/',
    },
    {
      icon: qr,
      title: 'QR Code',
      isMain: true,
      route: '/scan',
    },
    {
      icon: location.pathname === '/credentials' ? walletFilled : wallet,
      title: 'Credentials',
      route: '/credentials',
    },
  ];

  const theme = useTheme();
  const push = useNavigate();
  return (
    <Box
      sx={{
        position: 'relative',
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: 2,
        padding: '12.5px 21px',
      }}
    >
      {showArrow && (
        <img
          src={line}
          alt="line"
          style={{
            position: 'absolute',
            top: '-80px',
            left: '51%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      )}
      {NAV_ELEMENTS.map(({ icon, title, isMain, route }, index) => (
        <Box
          key={index}
          sx={{
            display: 'grid',
            rowGap: 0.5,
            justifyItems: 'center',
          }}
        >
          <Tooltip arrow title={title}>
            <IconButton
              onClick={() => push(route)}
              size={isMain ? 'large' : 'medium'}
              sx={{
                width: 'fit-content',
                position: isMain ? 'absolute' : 'relative',
                top: isMain ? '-20px' : 0,
                backgroundColor: isMain
                  ? theme.palette.primary.main
                  : 'initial',
                border: isMain ? '7px solid #F5F7F9' : 'none',
                '&:hover': {
                  backgroundColor: isMain
                    ? theme.palette.primary.main
                    : 'initial',
                },
              }}
            >
              <Icon icon={icon} fontSize={24} />
            </IconButton>
          </Tooltip>
          <Typography
            sx={{
              fontWeight: location.pathname === route ? 700 : 400,
              alignSelf: 'end',
            }}
            variant="subtitle2"
          >
            {title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
