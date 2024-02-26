import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import qrScan from '../../assets/scan-qr.png';

export default function NoCredentials() {
  const push = useNavigate();
  return (
    <Box
      sx={{
        display: 'grid',
        justifyItems: 'center',
        rowGap: '38px',
        backgroundColor: '#F6F7F9',
        padding: '0 16px',
        alignContent: 'center',
      }}
    >
      <img src={qrScan} alt="scan qr" height={240} width={139} />
      <Typography sx={{ textAlign: 'center' }}>
        Your wallet is empty.
      </Typography>
      <Typography sx={{ textAlign: 'center' }}>
        Scan the QR code and fill your DATEV-Wallet with proof of your digital
        identity.
      </Typography>
      <Button
        variant="contained"
        color="primary"
        onClick={() => push('/scan')}
        sx={{ justifySelf: 'stretch' }}
      >
        Add your first credential
      </Button>
    </Box>
  );
}
