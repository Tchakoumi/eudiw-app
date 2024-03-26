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
import ConsentFooter from './ConsentFooter';
import ConsentHeader from './ConsentHeader';
import PresentationCredentialCard from './PresentationCredentialCard';

interface ContentDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
}
export default function ContentDialog({
  isDialogOpen,
  closeDialog,
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
          <ConsentHeader service="Datev eG" />

          {selectedVcDetails ? (
            <Box
              sx={{
                display: 'grid',
                gridTemplateRows: 'auto 1fr auto',
                rowGap: 1,
              }}
            >
              <Typography variant="h5">
                Datev eG is requesting the following credentials
              </Typography>
              <Box sx={{ display: 'grid', rowGap: 1, alignContent: 'start' }}>
                {Object.keys(selectedVcDetails).map((key, index) => (
                  <Box
                    key={index}
                    sx={{
                      display: 'grid',
                      rowGap: 0.5,
                      padding: 1,
                      border: '1px solid #D1D5DB',
                      borderRadius: '12px',
                    }}
                  >
                    <Typography variant="body2">
                      {removeUnderscoresFromWord(key)}
                    </Typography>
                    <Typography fontWeight={500}>
                      {selectedVcDetails[key]}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box sx={{ display: 'grid', rowGap: 1 }}>
                <Button color="primary" variant="contained">
                  Share
                </Button>
                <Button color="inherit" variant="outlined">
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
