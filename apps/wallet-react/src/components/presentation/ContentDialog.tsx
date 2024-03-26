import { Box, Dialog } from '@mui/material';
import { useState } from 'react';
import { IVerifiableCredential } from '../../types/credentials.types';
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

  const [selectedVc, setSelectedVc] = useState<IVerifiableCredential>();

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
          <ConsentHeader service="Datev eG" />

          <Box sx={{ display: 'grid', rowGap: 1, alignContent: 'start' }}>
            {credentials.map((credential, index) => (
              <PresentationCredentialCard
                selectVc={() => setSelectedVc(credential)}
                credential={credential}
                key={index}
              />
            ))}
          </Box>
          <ConsentFooter />
        </Box>
      </Box>
    </Dialog>
  );
}
