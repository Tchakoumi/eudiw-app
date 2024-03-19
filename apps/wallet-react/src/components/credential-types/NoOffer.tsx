import { Box, Button, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function NoOffer() {
  const push = useNavigate();
  return (
    <Box
      sx={{
        height: '100%',
        display: 'grid',
        alignContent: 'center',
        justifyContent: 'center',
      }}
    >
      <Box sx={{ display: 'grid', justifyItems: 'center', rowGap: 2 }}>
        <Typography>No supported offers found, please scan again!!!</Typography>
        <Button
          onClick={() => push('/scan')}
          variant="contained"
          color="primary"
        >
          Scan again
        </Button>
      </Box>
    </Box>
  );
}
