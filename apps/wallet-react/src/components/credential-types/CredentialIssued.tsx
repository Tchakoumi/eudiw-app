import { Box, Button, Typography } from '@mui/material';
import check from '../../assets/check-circle-primary.png';
import wallet from '../../assets/illu-wallet.png';
import presenting from '../../assets/presenting.png';
import { ScanUsage } from '../scan-details/LoadingScanDetails';

export default function CredentialIssued({
  handleClose,
  usage = 'issuance',
}: {
  handleClose: () => void;
  usage?: ScanUsage;
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
            src={usage === 'issuance' ? wallet : presenting}
            alt="loading wallet"
            height={usage === 'issuance' ? 141.95 : 195}
            width={usage === 'issuance' ? 121.15 : 110.25}
          />
        </Box>
        <Typography sx={{ fontSize: '16px' }}>
          {usage === 'issuance'
            ? 'Credential added to your wallet'
            : 'Information sent successfully'}
        </Typography>
      </Box>
      <Button variant="contained" color="primary" onClick={handleClose}>
        {usage === 'issuance' ? 'Done' : 'Go back home'}
      </Button>
    </Box>
  );
}
