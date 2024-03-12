import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import wallet from '../../assets/illu-wallet.png';

export default function WaitingCredential() {
  const push = useNavigate();

  return (
    <Box
      sx={{
        display: 'grid',
        gridTemplateRows: '1fr auto',
        alignItems: 'center',
        height: '100%',
        padding: '16px 16px 34px 16px',
      }}
    >
      <Box
        sx={{
          display: 'grid',
          alignContent: 'center',
          rowGap: '123px',
          justifyContent: 'center',
          justifyItems: 'center',
        }}
      >
        <img src={wallet} alt="loading wallet" height={141.95} width={121.15} />
        <Typography sx={{ fontSize: '16px' }}>
          Your credential is on the way...
        </Typography>
      </Box>
      <Button
        variant="contained"
        color="inherit"
        onClick={() => push('/credentials')}
      >
        Go back to home
      </Button>
    </Box>
  );
}
