import { eventBus } from '@datev/event-bus';
import {
  DisplayCredential,
  OID4VCIService,
  OID4VCIServiceEventChannel,
  ServiceResponse,
  ServiceResponseStatus,
} from '@datev/oid4vc';
import { Box, Button, Dialog, Typography } from '@mui/material';
import { useEffect, useMemo, useState } from 'react';
import { IVcData, IVerifiableCredential } from '../../types/credentials.types';
import { removeUnderscoresFromWord } from '../../utils/common';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';
import ClaimCard from './ClaimCard';
import ConsentFooter from './ConsentFooter';
import ConsentHeader from './ConsentHeader';
import PresentationCredentialCard from './PresentationCredentialCard';

interface ContentDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
  confirmRequest: () => void;
}
export default function ContentDialog({
  isDialogOpen,
  closeDialog,
  confirmRequest,
}: ContentDialogProps) {
  const OIDVCI = useMemo(() => new OID4VCIService(eventBus), []);
  const credentials: IVerifiableCredential[] = [
    {
      id: 3,
      issued_at: new Date().getMilliseconds(),
      issuer: 'Authlete.com',
      title: 'Identity Credential',
    },
    {
      id: 2,
      issued_at: new Date().getMilliseconds(),
      issuer: 'Authlete.com',
      title: 'Identity Credential',
    },
  ];

  const [selectedVc, setSelectedVc] = useState<IVerifiableCredential>();
  const [selectedVcDetails, setSelectedVcDetails] = useState<IVcData>();
  const callingService = 'Datev eG';

  useEffect(() => {
    if (selectedVc) {
      OIDVCI.retrieveCredentialDetails(selectedVc.id as number);
      eventBus.on(
        OID4VCIServiceEventChannel.RetrieveCredentialDetails,
        (data: ServiceResponse<DisplayCredential>) => {
          if (data.status === ServiceResponseStatus.Success) {
            setSelectedVcDetails(data.payload.claims as IVcData);
          } else {
            //TODO: REPLACE WITH PROPER ERROR NOTIFICATION METHOD
            alert(data.payload);
          }
        }
      );
    }
  }, [OIDVCI, selectedVc]);

  function confirm() {
    setSelectedVc(undefined);
    setSelectedVcDetails(undefined);
    confirmRequest();
  }

  return (
    <Dialog
      fullScreen
      open={isDialogOpen}
      TransitionComponent={DialogTransition}
    >
      <Box
        sx={{ height: '100%', display: 'grid', gridTemplateRows: 'auto 1fr' }}
      >
        <Box sx={{ borderBottom: '1px solid #D1D5DB' }}>
          <BackTitleBar
            onBack={
              selectedVcDetails
                ? () => setSelectedVcDetails(undefined)
                : closeDialog
            }
            pageTitle={selectedVcDetails ? 'Proof Details' : 'Proof Request'}
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

          {selectedVcDetails ? (
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
                {Object.keys(selectedVcDetails).map((key, index) => (
                  <ClaimCard
                    key={index}
                    {...{
                      title: removeUnderscoresFromWord(key),
                      value: selectedVcDetails[key],
                    }}
                  />
                ))}
              </Box>
              <Box sx={{ display: 'grid', rowGap: 1 }}>
                <Button color="primary" variant="contained" onClick={confirm}>
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
              {credentials.map((credential, index) => (
                <PresentationCredentialCard
                  selectVc={() => setSelectedVc(credential)}
                  credential={credential}
                  key={index}
                />
              ))}
            </Box>
          )}
          <ConsentFooter />
        </Box>
      </Box>
    </Dialog>
  );
}
