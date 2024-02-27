import { Box, Button, Typography } from '@mui/material';
import check from '../../assets/check-circle-primary.png';
import wallet from '../../assets/illu-wallet.png';

export default function CredentialIssued({
  handleClose,
}: {
  handleClose: () => void;
}) {
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
        <Box sx={{ display: 'grid', justifyItems: 'center', rowGap: '24px' }}>
          <img src={check} alt="check" height={39} width={39} />
          <img
            src={wallet}
            alt="loading wallet"
            height={141.95}
            width={121.15}
          />
        </Box>
        <Typography sx={{ fontSize: '16px' }}>
          Credential added to your wallet
        </Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={handleClose}>
        Done
      </Button>
    </Box>
  );
}
