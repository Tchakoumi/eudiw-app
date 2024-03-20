import { Box, Menu, MenuItem, MenuList, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

interface ScanMenuProps {
  anchorEl: HTMLElement | null;
  closeMenu: () => void;
}
export default function ScanMenu({ anchorEl, closeMenu }: ScanMenuProps) {
  const push = useNavigate();
  const tt = [
    { route: '/issuance-scan', title: 'Issuance' },
    { route: '/presentation-scan', title: 'Presentation' },
  ];
  return (
    <Menu
      anchorEl={anchorEl}
      open={!!anchorEl}
      onClose={closeMenu}
      transformOrigin={{
        horizontal: 15.195,
        vertical: 220,
      }}
      elevation={0}
      sx={{
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
          {tt.map(({ route, title }, index) => (
            <MenuItem autoFocus key={index} onClick={() => push(route)}>
              {title}
            </MenuItem>
          ))}
        </MenuList>
      </Box>
    </Menu>
  );
}
