import { Box, Typography } from '@mui/material';

export default function ConsentFooter() {
  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateColumns: 'auto 1fr',
        justifyItems: 'end',
      }}
    >
      <Typography
        component="a"
        href="#"
        sx={{ textDecoration: 'none', fontSize: '12px' }}
        variant="body2"
      >
        Privacy policy
      </Typography>
      <Typography
        component="a"
        href="#"
        sx={{ textDecoration: 'none', fontSize: '12px' }}
        variant="body2"
      >
        Conditions of use
      </Typography>
    </Box>
  );
}
