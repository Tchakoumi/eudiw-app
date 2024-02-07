import list from '@iconify/icons-fluent/apps-list-24-regular';
import connected from '@iconify/icons-fluent/connected-20-regular';
import qr from '@iconify/icons-fluent/qr-code-28-filled';
import settings from '@iconify/icons-fluent/settings-48-regular';
import wallet from '@iconify/icons-fluent/wallet-48-regular';
import { Icon, IconifyIcon } from '@iconify/react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import line from '../../assets/line.png';
import { useTheme } from '../../utils/theme';

interface INavElements {
  icon: IconifyIcon;
  title: string;
  isMain?: boolean;
  action?: () => void;
}

export default function Footer({ showArrow = true }: { showArrow?: boolean }) {
  const NAV_ELEMENTS: INavElements[] = [
    { icon: wallet, title: 'Wallet' },
    { icon: connected, title: 'Contacts' },
    {
      icon: qr,
      title: 'QR Code',
      isMain: true,
      action: () => push('scan'),
    },
    { icon: list, title: 'Activities' },
    { icon: settings, title: 'Settings' },
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
      {NAV_ELEMENTS.map(({ icon, title, action, isMain }, index) => (
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
              onClick={() => (action ? action() : null)}
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
            sx={{ fontWeight: 400, alignSelf: 'end' }}
            variant="subtitle2"
          >
            {title}
          </Typography>
        </Box>
      ))}
    </Box>
  );
}
