import { Box, Typography } from '@mui/material';

export default function Header() {
  return (
    <Box
      sx={{
        padding: '0 16px',
        display: 'grid',
        gap: 1.2,
        marginBottom: 2,
      }}
    >
      <Typography variant="h2">DATEV-Wallet</Typography>
    </Box>
  );
}
