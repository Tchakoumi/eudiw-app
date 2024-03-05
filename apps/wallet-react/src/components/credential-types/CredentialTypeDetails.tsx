import { Box, Button, Dialog, Typography } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';
import CredentialIssued from './CredentialIssued';
import CredentialTypeCard from './CredentialTypeCard';
import WaitingCredential from './WaitingCredential';
import { ICredentialCard } from './credentials.types';

export default function CredentialTypeDetails({
  isDialogOpen,
  closeDialog,
  credntialTypeClaims,
  selectedCredentialType,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  credntialTypeClaims: string[];
  selectedCredentialType?: ICredentialCard;
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
              onClick={issueVC}
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
