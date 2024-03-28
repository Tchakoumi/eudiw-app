import { eventBus } from '@datev/event-bus';
import {
  OID4VCIService,
  OID4VCIServiceEventChannel,
  ServiceResponse,
  ServiceResponseStatus,
} from '@datev/oid4vc';
import { Alert, Box, Snackbar } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useMemo, useState } from 'react';
import ConfirmDeleteVCDialog from '../../components/credentials/ConfirmDeleteVCDialog';
import CredentialCard from '../../components/credentials/CredentialCard';
import CredentialDetails from '../../components/credentials/CredentialDetails';
import NoCredentials from '../../components/credentials/NoCredentials';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';
import { IVerifiableCredential } from '../../types/credentials.types';

export default function Credentials() {
  const OIDVCI: OID4VCIService = useMemo(
    () => new OID4VCIService(eventBus),
    []
  );

  const [credentials, setCredentials] = useState<IVerifiableCredential[]>([]);
  const [snackbarMessage, setSnackbarMessage] = useState<string>();

  useEffect(() => {
    OIDVCI.retrieveCredentialHeaders();
    eventBus.once(
      OID4VCIServiceEventChannel.RetrieveCredentialHeaders,
      (data: ServiceResponse) => {
        if (data.status === ServiceResponseStatus.Success)
          setCredentials(data.payload as IVerifiableCredential[]);
        else {
          //TODO: REPLACE WITH PROPER ERROR NOTIFICATION METHOD
          alert(data.payload);
        }
      }
    );

    return () => {
      // Clean up event listener
      eventBus.off(
        OID4VCIServiceEventChannel.RetrieveCredentialHeaders,
        (data: ServiceResponse) => {
          setCredentials(data.payload as IVerifiableCredential[]);
        }
      );
    };
  }, [OIDVCI, snackbarMessage]);

  const [selectedCredential, setSelectedCredential] =
    useState<IVerifiableCredential>();
  const [isConfirmDeleteVCDialogOpen, setIsConfirmDeleteVCDialogOpen] =
    useState<boolean>(false);

  function deleteVC(selectedVCID: number) {
    OIDVCI.deleteCredential(selectedVCID as number);
    eventBus.once(
      OID4VCIServiceEventChannel.DeleteCredential,
      (data: ServiceResponse<string>) => {
        if (data.status === ServiceResponseStatus.Success) {
          setSnackbarMessage(data.payload);
          setIsConfirmDeleteVCDialogOpen(false);
          setSelectedCredential(undefined);
        } else {
          //TODO: REPLACE WITH PROPER ERROR NOTIFICATION METHOD
          alert(data.payload);
        }
      }
    );
  }

  return (
    <>
      <Snackbar
        open={!!snackbarMessage}
        autoHideDuration={6000}
        onClose={() => setSnackbarMessage(undefined)}
      >
        <Alert
          onClose={() => setSnackbarMessage(undefined)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
      {selectedCredential && (
        <>
          (
          <CredentialDetails
            closeDialog={() => setSelectedCredential(undefined)}
            isDialogOpen={!isConfirmDeleteVCDialogOpen}
            selectedCredential={selectedCredential}
            deleteVC={() => {
              setIsConfirmDeleteVCDialogOpen(true);
            }}
          />
          <ConfirmDeleteVCDialog
            closeDialog={() => setIsConfirmDeleteVCDialogOpen(false)}
            confirmDelete={() => deleteVC(selectedCredential.id as number)}
            isDialogOpen={isConfirmDeleteVCDialogOpen}
          />
          )
        </>
      )}
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto 1fr auto',
        }}
      >
        <Header />
        <Box sx={{ height: '100%', backgroundColor: '#F6F7F9' }}>
          <Scrollbars autoHide universal>
            <Box
              sx={{
                display: 'grid',
                rowGap: 1,
                padding: '12px',
                alignContent: 'start',
              }}
            >
              {credentials.length === 0 ? (
                <NoCredentials />
              ) : (
                <Box sx={{ display: 'grid', rowGap: 1 }}>
                  {credentials
                    .sort((a, b) =>
                      (a.issued_at as number) < (b.issued_at as number) ? 1 : -1
                    )
                    .map((credential, index) => (
                      <CredentialCard
                        credential={credential}
                        key={index}
                        openDetails={() => setSelectedCredential(credential)}
                      />
                    ))}
                </Box>
              )}
            </Box>
          </Scrollbars>
        </Box>

        <Footer showArrow={false} />
      </Box>
    </>
  );
}
