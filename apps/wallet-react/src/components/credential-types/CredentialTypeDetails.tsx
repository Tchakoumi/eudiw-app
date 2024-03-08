import { eventBus } from '@datev/event-bus';
import { OID4VCIServiceEventChannel, OID4VCIServiceImpl } from '@datev/oid4vci';
import { Box, Button, Dialog, Typography } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';
import CredentialIssued from './CredentialIssued';
import CredentialTypeCard from './CredentialTypeCard';
import WaitingCredential from './WaitingCredential';
import {
  CredentialOfferResponsePayload,
  ICredentialCard,
} from './credentials.types';

export default function CredentialTypeDetails({
  isDialogOpen,
  closeDialog,
  credntialTypeClaims,
  selectedCredentialType,
  resolvedCredentialOfferPayload,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  credntialTypeClaims: string[];
  selectedCredentialType?: ICredentialCard;
  resolvedCredentialOfferPayload: CredentialOfferResponsePayload;
}) {
  const push = useNavigate();
  const OIDVCI = new OID4VCIServiceImpl(eventBus);
  const [isIssuing, setIsIssuing] = useState<boolean>(false);
  const [isDoneIssuing, setIsDoneIssuing] = useState<boolean>(false);

  function issueVC(
    credentialOfferResponsePayload: CredentialOfferResponsePayload,
    credentialTypeKey: string
  ) {
    setIsIssuing(true);
    OIDVCI.requestCredentialIssuance(credentialOfferResponsePayload, {
      credentialTypeKey,
    });

    eventBus.once(OID4VCIServiceEventChannel.CredentialProposition, () => {
      setIsIssuing(false);
      setIsDoneIssuing(true);
    });
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
      TransitionComponent={DialogTransition}
    >
      {isDoneIssuing ? (
        <CredentialIssued
          handleClose={() => {
            close();
            push('/credentials');
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
            pageTitle="Credential Type Details"
            onBack={() => (isIssuing ? null : close())}
          />
          <Box sx={{ backgroundColor: '#F6F7F9', padding: '16px' }}>
            {selectedCredentialType && (
              <CredentialTypeCard
                displayName={
                  selectedCredentialType.data.display
                    ? selectedCredentialType.data.display[0].name
                    : ''
                }
                issuer={selectedCredentialType.issuer}
                type={selectedCredentialType.type}
              />
            )}
          </Box>
          <Box
            sx={{
              padding: '16px',
              display: 'grid',
              gridTemplateRows: '1fr auto auto',
              rowGap: '8px',
            }}
          >
            <Scrollbars autoHide universal>
              <Box
                sx={{
                  display: 'grid',
                  rowGap: '14px',
                  maxHeight: '100%',
                  alignContent: 'start',
                  overflow: 'auto',
                }}
              >
                {credntialTypeClaims.map((claim, index) => (
                  <Typography sx={{ fontSize: '14px' }} key={index}>
                    {claim}
                  </Typography>
                ))}
              </Box>
            </Scrollbars>

            <Button
              variant="contained"
              color="primary"
              size="small"
              fullWidth
              onClick={() => {
                if (selectedCredentialType)
                  issueVC(
                    resolvedCredentialOfferPayload,
                    selectedCredentialType.type
                  );
                else alert('Missing credential type');
              }}
            >
              Issue VC
            </Button>
            <Button
              variant="contained"
              color="inherit"
              size="small"
              fullWidth
              onClick={close}
            >
              Cancel
            </Button>
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
