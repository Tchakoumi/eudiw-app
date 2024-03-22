import { eventBus } from '@datev/event-bus';
import {
  OID4VCIServiceEventChannel,
  ServiceResponse,
  ServiceResponseStatus,
} from '@datev/oid4vc';
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Typography,
} from '@mui/material';
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import wallet from '../../assets/illu-wallet.png';
import DialogTransition from '../layout/DialogTransition';

export default function LoadingScanDetails({
  isDialogOpen,
  closeDialog,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
}) {
  const push = useNavigate();
  const [scanError, setScanError] = useState<string>('');

  useEffect(() => {
    if (isDialogOpen) {
      eventBus.once(
        OID4VCIServiceEventChannel.ProcessCredentialOffer,
        (data: ServiceResponse) => {
          if (data.status === ServiceResponseStatus.Success)
            push('/credential-types');
          else {
            //TODO: REPLACE WITH PROPER ERROR NOTIFICATION METHOD
            setScanError(data.payload as string);
            alert(data.payload);
          }
        }
      );
    }
  }, [isDialogOpen, push]);

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
            Just a moment while we make a secure connection...
          </Typography>
        )}
      </Box>
    </Dialog>
  );
}
