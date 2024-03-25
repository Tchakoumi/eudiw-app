import { Box, Dialog, Typography } from '@mui/material';
import { IVerifiableCredential } from '../../types/credentials.types';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';
import PresentationCredentialCard from './PresentationCredentialCard';

interface ContentDialogProps {
  isDialogOpen: boolean;
  closeDialog: () => void;
}
export default function ContentDialog({
  isDialogOpen,
  closeDialog,
}: ContentDialogProps) {
  const credentials: IVerifiableCredential[] = [
    {
      id: 1,
      issued_at: new Date().getMilliseconds(),
      issuer: 'Authlete.com',
      title: 'Identity Credential',
    },
    {
      id: 1,
      issued_at: new Date().getMilliseconds(),
      issuer: 'Authlete.com',
      title: 'Identity Credential',
    },
  ];
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
          <BackTitleBar onBack={closeDialog} pageTitle="" />
        </Box>
        <Box
          sx={{
            display: 'grid',
            padding: '20px 30px',
            gridTemplateRows: 'auto 1fr auto',
            rowGap: 3,
          }}
        >
          <Box
            sx={{
              display: 'grid',
              justifyItems: 'center',
            }}
          >
            <Typography variant="h3">Select a credential</Typography>
            <Typography variant="body2">to present to Datev eG</Typography>
          </Box>

          <Box sx={{ display: 'grid', rowGap: 1, alignContent: 'start' }}>
            {credentials.map((credential, index) => (
              <PresentationCredentialCard credential={credential} key={index} />
            ))}
          </Box>
          <Box
            sx={{
              display: 'grid',
              gridTemplateColumns: 'auto 1fr',
              justifyItems: 'end',
            }}
          >
            <Typography
              component="a"
              href="#"
              sx={{ textDecoration: 'none', fontSize: '12px' }}
              variant="body2"
            >
              Privacy policy
            </Typography>
            <Typography
              component="a"
              href="#"
              sx={{ textDecoration: 'none', fontSize: '12px' }}
              variant="body2"
            >
              Conditions of use
            </Typography>
          </Box>
        </Box>
      </Box>
    </Dialog>
  );
}
