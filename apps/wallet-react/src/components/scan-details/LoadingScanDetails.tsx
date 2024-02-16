import { Box, CircularProgress, Dialog, Typography } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import DialogTransition from '../layout/DialogTransition';
import wallet from '../../assets/illu-wallet.png';
import { useEffect } from 'react';

export default function LoadingScanDetails({
  isDialogOpen,
  closeDialog,
  connectionLink,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  connectionLink: string;
}) {
  const push = useNavigate();

  useEffect(() => {
    //TODO: CALL API HERE TO PROCESS SCANNED DATA connectionLink
    setTimeout(() => {
      //TODO: listen to event result and move to credential offer if good
      push('/credential-type');
    }, 3000);
  }, [push]);

  return (
    <Dialog
      fullScreen
      open={isDialogOpen}
      onClose={() => null}
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
            src={wallet}
            alt="loading wallet"
            height={141.95}
            width={121.15}
          />

          <CircularProgress
            thickness={2}
            color="primary"
            size={200}
            sx={{
              position: 'absolute',
              top: '-26px',
              left: '-40px',
            }}
          />
        </Box>
        <Typography sx={{ fontSize: '16px', textAlign: 'center' }}>
          Just a moment while we make a secure connection...
        </Typography>
      </Box>
    </Dialog>
  );
}
