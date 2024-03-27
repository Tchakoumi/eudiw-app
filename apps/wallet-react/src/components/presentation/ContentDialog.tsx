import {
  DisclosureRecord,
  PresentationExchange,
  SdJwtMatchingCredential,
} from '@datev/oid4vc';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { removeUnderscoresFromWord } from '../../utils/common';
import DoneProcessing from '../credential-types/DoneProcessing';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';
import ClaimCard from './ClaimCard';
import ConsentFooter from './ConsentFooter';
import ConsentHeader from './ConsentHeader';
import PresentationCredentialCard from './PresentationCredentialCard';

interface ContentDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirmRequest: (selectedVc: SdJwtMatchingCredential) => void;
  isDone: boolean;
}
export default function ContentDialog({
  isDialogOpen,
  closeDialog,
  confirmRequest,
  isDone: isDonePresenting,
}: ContentDialogProps) {
  // TODO: INTEGRATE THE RESPONSE FROM THE SCAN HERE
  const proofRequest: PresentationExchange = {
    matchingCredentials: [
      {
        credential: {
          id: 2,
          issued_at: 1710426888000,
          claims: {
            given_name: 'Inga',
            family_name: 'Silverstone',
          },
          issuer: 'trial.authlete.net',
          title: 'Identity Credential',
        },
        disclosures: {
          given_name: 'Inga',
        },
      },
    ],
    resolvedRequestObject: {
      presentation_definition: {
        id: '2',
        input_descriptors: [],
      },
    },
  };

  const [selectedVc, setSelectedVc] = useState<SdJwtMatchingCredential>();
  const callingService = 'Datev eG';

  function confirm(selectedVc: SdJwtMatchingCredential) {
    setSelectedVc(undefined);
    confirmRequest(selectedVc);
  }

  const push = useNavigate();

  return (
    <Dialog
      fullScreen
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
    >
      {isDonePresenting ? (
        <DoneProcessing
          usage="presentation"
          handleClose={() => {
            closeDialog();
            push('/');
          }}
        />
      ) : (
        <Box
          sx={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr' }}
        >
          <Box sx={{ borderBottom: '1px solid #D1D5DB' }}>
            <BackTitleBar
              onBack={selectedVc ? () => setSelectedVc(undefined) : closeDialog}
              pageTitle={selectedVc ? 'Proof Details' : 'Proof Request'}
            />
          </Box>
          <Box
            sx={{
              display: 'grid',
              padding: '20px 30px',
              gridTemplateRows: 'auto 1fr auto',
              rowGap: 3,
            }}
          >
            <ConsentHeader service={callingService} />

            {selectedVc ? (
              <Box
                sx={{
                  display: 'grid',
                  gridTemplateRows: 'auto 1fr auto',
                  rowGap: 1,
                }}
              >
                <Typography variant="h5">
                  {`${callingService} is requesting the following credentials`}
                </Typography>
                <Box
                  sx={{
                    display: 'grid',
                    rowGap: 1,
                    alignContent: 'start',
                  }}
                >
                  {Object.keys(selectedVc.disclosures as DisclosureRecord).map(
                    (key, index) => (
                      <ClaimCard
                        key={index}
                        {...{
                          title: removeUnderscoresFromWord(key),
                          value: (selectedVc.disclosures as DisclosureRecord)[
                            key
                          ] as string,
                        }}
                      />
                    )
                  )}
                </Box>
                <Box sx={{ display: 'grid', rowGap: 1 }}>
                  <Button
                    color="primary"
                    variant="contained"
                    disabled={!selectedVc}
                    onClick={() => confirm(selectedVc)}
                  >
                    Share
                  </Button>
                  <Button
                    color="inherit"
                    variant="outlined"
                    onClick={closeDialog}
                  >
                    Decline
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box sx={{ display: 'grid', rowGap: 1, alignContent: 'start' }}>
                {proofRequest.matchingCredentials.map((credential, index) => (
                  <PresentationCredentialCard
                    selectVc={() => setSelectedVc(credential)}
                    credential={credential.credential}
                    key={index}
                  />
                ))}
              </Box>
            )}
            <ConsentFooter />
          </Box>
        </Box>
      )}
    </Dialog>
  );
}
