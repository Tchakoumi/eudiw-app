import { eventBus } from '@datev/event-bus';
import {
  OID4VCIServiceEventChannel,
  OID4VCService,
  OID4VCServiceEventChannel,
  PresentationExchange,
  SdJwtMatchingCredential,
  ServiceResponse,
  ServiceResponseStatus,
} from '@datev/oid4vc';
import back from '@iconify/icons-fluent/arrow-left-48-filled';
import { Icon } from '@iconify/react';
import { Box, IconButton, Tooltip } from '@mui/material';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ContentDialog from '../../components/presentation/ContentDialog';
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
  const [isPresentationDetailsDialogOpen, setIsPresentationDetailsDialogOpen] =
    useState<boolean>(false);

  const OIDVCI: OID4VCService = new OID4VCService(eventBus);

  function resolveCredentialOffer(result: string) {
    setIsLoadingDialogOpen(true);
    setScanResult(result);
    OIDVCI.resolveOID4VCUri(result);
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

  // TODO: remove this when integration is done
  const staticProofRequest: PresentationExchange = {
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
  const [proofRequest, setProofRequest] =
    useState<PresentationExchange>(staticProofRequest);
  function presentationDetailsListener() {
    //TODO: integrate listening of event that holds presentation details here
    eventBus.once(
      OID4VCServiceEventChannel.PresentationWorking,
      (data: ServiceResponse) => {
        if (data.status === ServiceResponseStatus.Success) {
          setProofRequest(staticProofRequest);
          setIsLoadingDialogOpen(false);
          setIsPresentationDetailsDialogOpen(true);
        }
      }
    );
  }

  const [isSendingProofRequest, setIsSendingProofRequest] =
    useState<boolean>(false);
  const [isDonePresenting, setIsDonePresenting] = useState<boolean>(false);

  //listen to result when proof is sent
  function fulfillProofRequestListener() {
    // TODO: CALL SERVICE LAYER TO LISTEN TO RESPONSE of sent proof
    setTimeout(() => {
      setScanResult('');
      setIsLoadingDialogOpen(false);
      setIsSendingProofRequest(false);
    }, 3000);
  }

  // send selectedVc to service layer to fulfull proof
  function fulfillProofRequest(selectedVc: SdJwtMatchingCredential) {
    //TODO: CALL API HERE TO SUBMIT selectedVc to service layer
    setIsDonePresenting(true);
    setIsSendingProofRequest(true);
  }

  function wrongQrListener() {
    eventBus.once(
      OID4VCServiceEventChannel.ResolveOID4VCUri,
      (data: ServiceResponse) => {
        if (data.status === ServiceResponseStatus.Error) alert(data.payload);
        push('/');
      }
    );
  }

  function closeLoadingScanDialog() {
    setScanResult('');
    setIsLoadingDialogOpen(false);
    setIsSendingProofRequest(false);
  }

  return (
    <>
      <LoadingScanDetails
        isDialogOpen={
          (!!scanResult && isLoadingDialogOpen) || isSendingProofRequest
        }
        resultListener={() => {
          if (isSendingProofRequest) {
            fulfillProofRequestListener();
          } else {
            wrongQrListener();
            presentationDetailsListener();
            credentialOfferListener();
          }
        }}
        closeDialog={closeLoadingScanDialog}
        usage={isSendingProofRequest ? 'presentation' : 'issuance'}
        scanError={scanError}
      />

      {proofRequest && (
        <ContentDialog
          isDialogOpen={isPresentationDetailsDialogOpen}
          closeDialog={() => setIsPresentationDetailsDialogOpen(false)}
          isDone={isDonePresenting}
          proofRequest={proofRequest}
          confirmRequest={fulfillProofRequest}
        />
      )}

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
        {!isPresentationDetailsDialogOpen && (
          <Scanner handleScanResult={resolveCredentialOffer} />
        )}
      </Box>
    </>
  );
}
