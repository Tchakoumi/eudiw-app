import { eventBus } from '@datev/event-bus';
import {
  OID4VCIServiceEventChannel,
  ServiceResponse,
  ServiceResponseStatus,
} from '@datev/oid4vc';
import back from '@iconify/icons-fluent/arrow-left-48-filled';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoadingScanDetails from '../../components/scan-details/LoadingScanDetails';
import Scanner from '../../components/scanner/Scanner';
import { useTheme } from '../../utils/theme';

export default function Scan() {
  const theme = useTheme();
  const push = useNavigate();
  const [scanError, setScanError] = useState<string>('');
  const [scanResult, setScanResult] = useState<string>('');
  const [isLoadingDialogOpen, setIsLoadingDialogOpen] =
    useState<boolean>(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [isPresentationDetailsDialogOpen, setIsPresentationDetailsDialogOpen] =
    useState<boolean>(false);

  function resolveCredentialOffer(result: string) {
    setIsLoadingDialogOpen(true);
    setScanResult(result);
    //TODO: integrate service that figures out which scan(issuance/presentation) is made
  }

  function credentialOfferListener() {
    eventBus.once(
      OID4VCIServiceEventChannel.ProcessCredentialOffer,
      (data: ServiceResponse) => {
        if (data.status === ServiceResponseStatus.Success)
          push('/credential-types');
        else {
          setScanError(data.payload as string);
          //TODO: REPLACE WITH PROPER ERROR NOTIFICATION METHOD
          alert(data.payload);
        }
      }
    );
  }

  function presentationDetailsListener() {
    //TODO: integrate listening of event that holds presentation details here
    setTimeout(() => {
      setIsLoadingDialogOpen(false);
      setIsPresentationDetailsDialogOpen(true);
    }, 3000);
  }

  return (
    <>
      <LoadingScanDetails
        isDialogOpen={!!scanResult && isLoadingDialogOpen}
        resultListener={() => {
          presentationDetailsListener();
          credentialOfferListener();
        }}
        closeDialog={() => {
          setScanResult('');
          setIsLoadingDialogOpen(false);
        }}
        scanError={scanError}
      />

      <Box
        sx={{
          display: 'grid',
          rowGap: 1,
          gridTemplateRows: 'auto 1fr',
          position: 'relative',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            alignContent: 'center',
            justifyContent: 'start',
            padding: '8px',
            backgroundColor: theme.palette.secondary.light,
          }}
        >
          <Tooltip arrow title="Back">
            <IconButton size="small" onClick={() => push('/')}>
              <Icon icon={back} color="black" />
            </IconButton>
          </Tooltip>
        </Box>
        <Scanner handleScanResult={resolveCredentialOffer} />
      </Box>
    </>
  );
}
