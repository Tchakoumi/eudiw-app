import { Box, Button, Dialog, Divider } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useState } from 'react';
import { IVerifiableCredential } from '../credential-types/credentials.types';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';
import CredentialCard from './CredentialCard';
import CredentialDetailLine from './CredentialDetailLine';

export interface IVerifiableCredentialDetails extends IVerifiableCredential {
  claims: IVcData;
}

type IDisplayClaimValues = Record<string, boolean>;
type IVcData = Record<string, string>;

export default function CredentialDetails({
  isDialogOpen,
  closeDialog,
  selectedCredential,
  deleteVC,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  selectedCredential?: IVerifiableCredential;
  deleteVC: () => void;
}) {
  // TODO: FUNCTION WILL GET THE DETAILS OF A CREDENTIAL WHEN GIVEN A credential_id
  function getCredentialDetails(credential_id: number | null): IVcData {
    return {
      'Phone number': 'Hans Schreiner',
      'email address': 'hans.schreiner@datev.com',
      address: 'Johannessgase #626',
    };
  }
  const [vcData, setVcData] = useState<IVcData>({});
  const [canDisplayClaimValue, setCanDisplayClaimValue] = useState<
    Record<string, boolean>
  >({});
  useEffect(() => {
    const vcData = getCredentialDetails(
      selectedCredential ? selectedCredential.id ?? null : null
    );
    setVcData(vcData);
    const claimValuesDisplayStatus: IDisplayClaimValues = {};
    Object.keys(vcData).forEach((key) => {
      claimValuesDisplayStatus[key] = false;
    });
    setCanDisplayClaimValue(claimValuesDisplayStatus);
  }, [selectedCredential]);

  function handleShowAllValues() {
    const claimValuesDisplayStatus: IDisplayClaimValues = {};
    const values = Object.values(canDisplayClaimValue);
    Object.keys(canDisplayClaimValue).forEach(
      (claim) =>
        (claimValuesDisplayStatus[claim] = !values.includes(true)
          ? true
          : false)
    );
    setCanDisplayClaimValue(claimValuesDisplayStatus);
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
            gridTemplateRows: 'auto 1fr auto auto',
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

          <Scrollbars autoHide universal>
            <Box
              sx={{
                display: 'grid',
                rowGap: '14px',
                maxHeight: '100%',
                alignContent: 'start',
                overflow: 'auto',
              }}
            >
              {Object.keys(vcData).map((claimKey, index) => (
                <CredentialDetailLine
                  key={index}
                  title={claimKey}
                  value={vcData[claimKey as keyof typeof vcData]}
                  handleShowValue={() => handleShowClaimValue(claimKey)}
                  showClaimValue={
                    canDisplayClaimValue[claimKey as keyof typeof vcData]
                  }
                />
              ))}
            </Box>
          </Scrollbars>
          <Divider sx={{ width: '80%', justifySelf: 'center' }} />

          <Button variant="text" color="error" fullWidth onClick={deleteVC}>
            Remove Credential
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
