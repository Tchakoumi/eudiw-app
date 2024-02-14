import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function IDTemplate({
  credentialOfferAttributes,
}: {
  credentialOfferAttributes: string[];
}) {
  const push = useNavigate();

  return (
    <Box>
      <Typography variant="h4">Credential attributes</Typography>

      <Box
        sx={{
          display: 'grid',
          rowGap: '14px',
          backgroundColor: 'white',
          padding: '28px',
        }}
      >
        {credentialOfferAttributes.map((attr) => (
          <Typography sx={{ fontSize: '14px' }}>{attr}</Typography>
        ))}
      </Box>

      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: 1,
          alignItems: 'center',
          justifyItems: 'start',
          justifyContent: 'end',
          marginTop: '8px',
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => push('/')}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          onClick={() => alert('Move to VC generation phase')}
        >
          Issue VC
        </Button>
      </Box>
    </Box>
  );
}
