import { eventBus } from '@datev/event-bus';
import {
  OID4VCIServiceEventChannel,
  ServiceResponse,
  ServiceResponseStatus,
} from '@datev/oid4vc';
import { Box, CircularProgress, Dialog, Typography } from '@mui/material';
import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import wallet from '../../assets/illu-wallet.png';
import DialogTransition from '../layout/DialogTransition';

export default function LoadingScanDetails({
  isDialogOpen,
}: {
  isDialogOpen: boolean;
}) {
  const push = useNavigate();

  useEffect(() => {
    if (isDialogOpen) {
      eventBus.once(
        OID4VCIServiceEventChannel.ProcessCredentialOffer,
        (data: ServiceResponse) => {
          if (data.status === ServiceResponseStatus.Success)
            push('/credential-types');
          else alert(data.payload);
        }
      );
    }
  }, [isDialogOpen, push]);

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
