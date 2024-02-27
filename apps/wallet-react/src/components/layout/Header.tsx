import settings from '@iconify/icons-fluent/settings-24-regular';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip, Typography } from '@mui/material';

export default function Header({
  pageTitle = 'DATEV Wallet',
}: {
  pageTitle?: string;
}) {
  return (
    <Box
      sx={{
        padding: '12px',
        display: 'grid',
        gridTemplateColumns: '1fr auto',
        justifyItems: 'center',
        alignItems: 'center',
      }}
    >
      <Typography sx={{ fontWeight: 600, fontSize: '29px' }}>
        {pageTitle}
      </Typography>
      <Tooltip arrow title="Settings">
        <IconButton size="small">
          <Icon icon={settings} fontSize={24} />
        </IconButton>
      </Tooltip>
    </Box>
  );
}
