import { Box, Button, Dialog } from '@mui/material';
import { useEffect, useState } from 'react';
import { IVerifiableCredential } from '../../pages/credentials/Credentials';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';
import CredentialCard from './CredentialCard';
import CredentialDetailLine from './CredentialDetailLine';

export interface IVerifiableCredentialDetails extends IVerifiableCredential {
  claims: {
    'phone number': 'Hans Schreiner';
    'email address': 'hans.schreiner@datev.com';
    addres: 'Johannessgase #626';
  };
}

export default function CredentialDetails({
  isDialogOpen,
  closeDialog,
  selectedCredential,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  selectedCredential?: IVerifiableCredential;
}) {
  // TODO: FUNCTION WILL GET THE DETAILS OF A CREDENTIAL WHEN GIVEN A CREDENTIAL_ID
  function getCredentialDetails(credential_id: string) {
    return {
      'Phone number': 'Hans Schreiner',
      'email address': 'hans.schreiner@datev.com',
      address: 'Johannessgase #626',
    };
  }
  //   const tt = getCredentialDetails(
  //     selectedCredential ? selectedCredential.id : ''
  //   );
  const [tt, setTT] = useState<Record<string, string>>({});
  const [canDisplayClaimValue, setCanDisplayClaimValue] = useState<
    Record<keyof typeof tt, boolean>
  >({});
  useEffect(() => {
    const bb = getCredentialDetails(
      selectedCredential ? selectedCredential.id : ''
    );
    setTT(bb);
    const obj: Record<string, boolean> = {};
    Object.keys(bb).forEach((key) => {
      obj[key] = false;
    });
    setCanDisplayClaimValue(obj);
  }, [selectedCredential]);

  function handleShowAllValues() {
    const obj: Record<string, boolean> = {};
    const values = Object.values(canDisplayClaimValue);
    Object.keys(canDisplayClaimValue).forEach(
      (claim) => (obj[claim] = !values.includes(true) ? true : false)
    );
    setCanDisplayClaimValue(obj);
  }

  function handleShowClaimValue(claimKey: string) {
    setCanDisplayClaimValue((prev) => {
      return { ...prev, [claimKey]: !prev[claimKey] };
    });
  }

  return (
    <Dialog
      fullScreen
      open={isDialogOpen}
      onClose={closeDialog}
      TransitionComponent={DialogTransition}
    >
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
        }}
      >
        <BackTitleBar pageTitle="Credential Details" onBack={closeDialog} />
        <Box sx={{ backgroundColor: '#F6F7F9', padding: '16px' }}>
          {selectedCredential && (
            <CredentialCard credential={selectedCredential} />
          )}
        </Box>
        <Box
          sx={{
            padding: '16px',
            display: 'grid',
            gridTemplateRows: 'auto 1fr auto',
            rowGap: '8px',
          }}
        >
          <Button
            variant="text"
            color="secondary"
            size="small"
            sx={{ justifySelf: 'end' }}
            onClick={handleShowAllValues}
          >
            {!Object.values(canDisplayClaimValue).includes(true)
              ? 'Show All'
              : 'Hide All'}
          </Button>

          <Box
            sx={{
              display: 'grid',
              rowGap: '14px',
              maxHeight: '100%',
              alignContent: 'start',
              overflow: 'auto',
            }}
          >
            {Object.keys(tt).map((attr, index) => (
              <CredentialDetailLine
                key={index}
                title={attr}
                value={tt[attr as keyof typeof tt]}
                handleShowValue={() => handleShowClaimValue(attr)}
                showClaimValue={canDisplayClaimValue[attr as keyof typeof tt]}
              />
            ))}
          </Box>

          <Button variant="text" color="error" fullWidth>
            Remove Credential
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
