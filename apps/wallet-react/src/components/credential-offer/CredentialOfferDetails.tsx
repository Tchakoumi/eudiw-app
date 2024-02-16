import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  Slide,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef, useState } from 'react';
import BackTitleBar from '../layout/BackTitleBar';
import CredentialTypeCard from './CredentialTypeCard';
import { ICredentialCard } from './credentials.types';
import WaitingCredential from './WaitingCredential';
import CredentialIssued from './CredentialIssued';
import { useNavigate } from 'react-router-dom';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: JSX.Element;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function CredentialOfferDetails({
  isDialogOpen,
  closeDialog,
  credentialOfferAttributes,
  selectedCredentialOffer,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  credentialOfferAttributes: string[];
  selectedCredentialOffer?: ICredentialCard;
}) {
  const push = useNavigate();
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [isDoneIssuing, setIsDoneIssuing] = useState<boolean>(false);
  function issueVC() {
    setIsIssuing(true);
    setTimeout(() => {
      setIsIssuing(false);
      setIsDoneIssuing(true);
      //TODO: CALL API HERE TO ISSUE VC
    }, 3000);
  }

  function close() {
    setIsIssuing(false);
    setIsDoneIssuing(false);
    closeDialog();
  }

  return (
    <Dialog
      fullScreen
      open={isDialogOpen}
      onClose={() => (isIssuing ? null : close())}
      TransitionComponent={Transition}
    >
      {isDoneIssuing ? (
        <CredentialIssued
          handleClose={() => {
            close();
            push('/credential');
          }}
        />
      ) : isIssuing ? (
        <WaitingCredential />
      ) : (
        <Box
          sx={{
            height: '100%',
            display: 'grid',
            gridTemplateRows: 'auto auto 1fr',
          }}
        >
          <BackTitleBar
            pageTitle="Credential Offer"
            onBack={() => (isIssuing ? null : close())}
          />
          <Box sx={{ backgroundColor: '#F6F7F9', padding: '16px' }}>
            {selectedCredentialOffer && (
              <CredentialTypeCard
                displayName={selectedCredentialOffer.data.display[0].name}
                issuer={selectedCredentialOffer.issuer}
                type={selectedCredentialOffer.type}
              />
            )}
          </Box>
          <Box
            sx={{
              padding: '16px',
              display: 'grid',
              gridTemplateRows: '1fr auto',
              rowGap: '8px',
            }}
          >
            <Box
              sx={{
                display: 'grid',
                rowGap: '14px',
                maxHeight: '100%',
                alignContent: 'start',
                overflow: 'auto',
              }}
            >
              {credentialOfferAttributes.map((attr, index) => (
                <Typography sx={{ fontSize: '14px' }} key={index}>
                  {attr}
                </Typography>
              ))}
            </Box>

            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              onClick={issueVC}
              disabled={isIssuing}
              endIcon={
                isIssuing && (
                  <CircularProgress size={20} color="primary" thickness={7} />
                )
              }
            >
              Issue VC
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
