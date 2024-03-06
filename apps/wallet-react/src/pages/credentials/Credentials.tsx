import { eventBus } from '@datev/event-bus';
import {
  OID4VCIService,
  OID4VCIServiceEventChannel,
  OID4VCIServiceImpl,
  ServiceResponse,
} from '@datev/oid4vci';
import { Alert, Box, Snackbar } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useMemo, useState } from 'react';
import { IVerifiableCredential } from '../../components/credential-types/credentials.types';
import ConfirmDeleteVCDialog from '../../components/credentials/ConfirmDeleteVCDialog';
import CredentialCard from '../../components/credentials/CredentialCard';
import CredentialDetails from '../../components/credentials/CredentialDetails';
import NoCredentials from '../../components/credentials/NoCredentials';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

export default function Credentials() {
  const OIDVCI: OID4VCIService = useMemo(
    () => new OID4VCIServiceImpl(eventBus),
    []
  );

  const [credentials, setCredentials] = useState<IVerifiableCredential[]>([]);

  OIDVCI.retrieveCredentialHeaders();
  useEffect(() => {
    eventBus.once(
      OID4VCIServiceEventChannel.RetrieveCredentialHeaders,
      (data: ServiceResponse) => {
        setCredentials(data.payload as IVerifiableCredential[]);
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
  }, [OIDVCI]);

  const [selectedCredential, setSelectedCredential] =
    useState<IVerifiableCredential>();
  const [isConfirmDeleteVCDialogOpen, setIsConfirmDeleteVCDialogOpen] =
    useState<boolean>(false);

  const [showDeleteSnackbar, setShowDeleteSnackbar] = useState<boolean>(false);

  return (
    <>
      <Snackbar
        open={showDeleteSnackbar}
        autoHideDuration={6000}
        onClose={() => setShowDeleteSnackbar(false)}
      >
        <Alert
          onClose={() => setShowDeleteSnackbar(false)}
          severity="success"
          variant="filled"
          sx={{ width: '100%' }}
        >
          Credential removed
        </Alert>
      </Snackbar>
      <CredentialDetails
        closeDialog={() => setSelectedCredential(undefined)}
        isDialogOpen={!!selectedCredential && !isConfirmDeleteVCDialogOpen}
        selectedCredential={selectedCredential}
        deleteVC={() => {
          setIsConfirmDeleteVCDialogOpen(true);
        }}
      />
      <ConfirmDeleteVCDialog
        closeDialog={() => setIsConfirmDeleteVCDialogOpen(false)}
        confirmDelete={() => {
          setIsConfirmDeleteVCDialogOpen(false);
          setSelectedCredential(undefined);
          setShowDeleteSnackbar(true);
        }}
        isDialogOpen={isConfirmDeleteVCDialogOpen}
      />
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
                  {credentials.map((credential, index) => (
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
