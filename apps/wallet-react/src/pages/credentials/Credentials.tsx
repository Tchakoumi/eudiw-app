import { Alert, Box, Snackbar } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useState } from 'react';
import AuthleteLogo from '../../assets/authlete-logo.png';
import { IVerifiableCredential } from '../../components/credential-type/credentials.types';
import ConfirmDeleteVCDialog from '../../components/credentials/ConfirmDeleteVCDialog';
import CredentialCard from '../../components/credentials/CredentialCard';
import CredentialCardSkeleton from '../../components/credentials/CredentialCardSkeleton';
import CredentialDetails from '../../components/credentials/CredentialDetails';
import NoCredentials from '../../components/credentials/NoCredentials';
import Footer from '../../components/layout/Footer';
import Header from '../../components/layout/Header';

export default function Credentials() {
  const [credentials, setCredentials] = useState<IVerifiableCredential[]>([]);
  const [isLoadingCredentials, setIsLoadingCredentials] =
    useState<boolean>(false);

  useEffect(() => {
    setIsLoadingCredentials(true);
    setTimeout(() => {
      setCredentials([
        {
          id: '123123',
          issuer: 'DATEV eG',
          logo: AuthleteLogo,
          subtitle: 'Hello world',
          title: 'E-ID Hans Schreiner',
        },
      ]);
      setIsLoadingCredentials(false);
    }, 3000);
  }, []);

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
              {isLoadingCredentials ? (
                [...new Array(4)].map((_, index) => (
                  <CredentialCardSkeleton key={index} />
                ))
              ) : credentials.length === 0 ? (
                <NoCredentials />
              ) : (
                <Box>
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
