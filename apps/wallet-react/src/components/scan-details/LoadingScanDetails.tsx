import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from '@mui/material';
import { useEffect } from 'react';
import wallet from '../../assets/illu-wallet.png';
import presenting from '../../assets/presenting.png';
import DialogTransition from '../layout/DialogTransition';

interface LoadingScanDetailsProps {
  isDialogOpen: boolean;
  resultListener: () => void;
  closeDialog: () => void;
  scanError: string;
  usage?: 'issuance' | 'presentation';
}
export default function LoadingScanDetails({
  isDialogOpen,
  resultListener,
  closeDialog,
  scanError,
  usage = 'issuance',
}: LoadingScanDetailsProps) {
  useEffect(() => {
    if (isDialogOpen) resultListener();
  }, [isDialogOpen, resultListener]);

  return (
    <Dialog
      fullScreen
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
    >
      <Box
        sx={{
          display: 'grid',
          alignContent: 'center',
          rowGap: '123px',
          justifyContent: 'center',
          justifyItems: 'center',
          height: '100%',
          padding: '16px',
        }}
      >
        <Box sx={{ position: 'relative' }}>
          <img
            src={usage === 'issuance' ? wallet : presenting}
            alt="loading wallet"
            height={usage === 'issuance' ? 141.95 : 195}
            width={usage === 'issuance' ? 121.15 : 110.25}
          />

          <CircularProgress
            thickness={1}
            color="primary"
            size={usage === 'issuance' ? 200 : 250}
            sx={{
              position: 'absolute',
              top: usage === 'issuance' ? '-26px' : '-30px',
              left: usage === 'issuance' ? '-40px' : '-70px',
            }}
          />
        </Box>
        {scanError ? (
          <Box sx={{ display: 'grid', justifyItems: 'center', rowGap: 2 }}>
            <Typography>
              No supported offers found, please scan again!!!
            </Typography>
            <Button onClick={closeDialog} variant="contained" color="primary">
              Scan again
            </Button>
          </Box>
        ) : (
          <Typography sx={{ fontSize: '16px', textAlign: 'center' }}>
            {usage === 'issuance'
              ? `Just a moment while we make a secure connection...`
              : 'Sending the information securely...'}
          </Typography>
        )}
      </Box>
    </Dialog>
  );
}
