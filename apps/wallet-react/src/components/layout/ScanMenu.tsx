import { Box, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ScanMenuProps {
  anchorEl: HTMLElement | null;
  closeMenu: () => void;
}

interface IScanMenuItem {
  route: string;
  title: string;
}
export default function ScanMenu({ anchorEl, closeMenu }: ScanMenuProps) {
  const push = useNavigate();
  const scanMenuItems: IScanMenuItem[] = [
    { route: '/issuance-scan', title: 'Issuance' },
    { route: '/presentation-scan', title: 'Presentation' },
  ];
  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={closeMenu}
      elevation={0}
      sx={{
        '& .MuiPaper-root': {
          bottom: '200px !important',
          left: '50% !important',
          transform: 'translate(-50%, -50%) !important',
          height: 'fit-content',
        },
        '& .MuiBackdrop-root': {
          backgroundColor: '#0000002B',
        },
      }}
    >
      <Box sx={{ display: 'grid', rowGap: 1 }}>
        <Typography
          variant="body2"
          sx={{ fontWeight: '500', padding: 1, borderBottom: '1px solid grey' }}
        >
          Select scan reason
        </Typography>
        <MenuList disablePadding dense>
          {scanMenuItems.map(({ route, title }, index) => (
            <MenuItem autoFocus key={index} onClick={() => push(route)}>
              {title}
            </MenuItem>
          ))}
        </MenuList>
      </Box>
    </Menu>
  );
}
