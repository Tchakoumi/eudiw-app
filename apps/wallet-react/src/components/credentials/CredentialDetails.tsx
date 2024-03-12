import { eventBus } from '@datev/event-bus';
import {
  DisplayCredential,
  OID4VCIServiceEventChannel,
  OID4VCIServiceImpl,
  ServiceResponse,
  ServiceResponseStatus,
} from '@datev/oid4vci';
import { Box, Button, Dialog, Divider } from '@mui/material';
import Scrollbars from 'rc-scrollbars';
import { useEffect, useState } from 'react';
import { IVerifiableCredential } from '../../types/credentials.types';
import { removeUnderscoresFromWord } from '../../utils/common';
import BackTitleBar from '../layout/BackTitleBar';
import DialogTransition from '../layout/DialogTransition';
import CredentialCard from './CredentialCard';
import CredentialDetailLine from './CredentialDetailLine';

export interface IVerifiableCredentialDetails extends IVerifiableCredential {
  claims: IVcData;
}

type IDisplayClaimValues = Record<string, boolean>;
type IVcData = Record<string, string>;
const OIDVCI = new OID4VCIServiceImpl(eventBus);

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
  const [vcData, setVcData] = useState<IVcData>({});
  const [canDisplayClaimValue, setCanDisplayClaimValue] = useState<
    Record<string, boolean>
  >({});
  useEffect(() => {
    if (isDialogOpen && selectedCredential && selectedCredential.id) {
      OIDVCI.retrieveCredentialDetails(selectedCredential.id);
      eventBus.once(
        OID4VCIServiceEventChannel.RetrieveCredentialDetails,
        (data: ServiceResponse<DisplayCredential>) => {
          if (data.status === ServiceResponseStatus.Success) {
            setVcData(data.payload.claims as IVcData);
            const claimValuesDisplayStatus: IDisplayClaimValues = {};
            Object.keys(data.payload.claims as IVcData).forEach((key) => {
              claimValuesDisplayStatus[key] = false;
            });
            setCanDisplayClaimValue(claimValuesDisplayStatus);
          } else alert(data.payload);
        }
      );
    }
  }, [isDialogOpen, selectedCredential]);

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
              {Object.keys(vcData)
                .filter((_) => _ !== 'sub')
                .map((claimKey, index) => (
                  <CredentialDetailLine
                    key={index}
                    title={removeUnderscoresFromWord(claimKey)}
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
