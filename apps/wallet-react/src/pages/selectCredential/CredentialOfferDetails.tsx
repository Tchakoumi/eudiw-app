import back from '@iconify/icons-fluent/chevron-left-24-filled';
import { Icon } from '@iconify/react';
import {
  Box,
  Button,
  Dialog,
  IconButton,
  Slide,
  Tooltip,
  Typography,
} from '@mui/material';
import { TransitionProps } from '@mui/material/transitions';
import { forwardRef } from 'react';
import { ICredentialCard } from './credentials.types';
import CredentialTypeCard from './CredentialTypeCard';

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: JSX.Element;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export default function CredentialOfferDetails({
  isDialogOpen,
  closeDialog,
  credentialOfferAttributes,
  selectedCredentialOffer,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  credentialOfferAttributes: string[];
  selectedCredentialOffer?: ICredentialCard;
}) {
  return (
    <Dialog
      fullScreen
      open={isDialogOpen}
      onClose={closeDialog}
      TransitionComponent={Transition}
    >
      <Box
        sx={{
          height: '100%',
          display: 'grid',
          gridTemplateRows: 'auto auto 1fr',
        }}
      >
        <Box
          sx={{
            display: 'grid',
            gridTemplateColumns: 'auto 1fr',
            columnGap: '8px',
            alignItems: 'center',
            padding: '16px 16px 16px 8px',
          }}
        >
          <Tooltip arrow title="Back">
            <IconButton size="small" onClick={closeDialog}>
              <Icon icon={back} fontSize={24} />
            </IconButton>
          </Tooltip>
          <Typography
            sx={{
              fontWeight: 600,
              fontSize: '16px',
            }}
          >
            Credential Offer
          </Typography>
        </Box>
        <Box sx={{ backgroundColor: '#F6F7F9', padding: '16px' }}>
          {selectedCredentialOffer && (
            <CredentialTypeCard
              displayName={selectedCredentialOffer.data.display[0].name}
              issuer={selectedCredentialOffer.issuer}
              type={selectedCredentialOffer.type}
            />
          )}
        </Box>
        <Box
          sx={{
            padding: '16px',
            display: 'grid',
            gridTemplateRows: '1fr auto',
            rowGap: '8px',
          }}
        >
          <Box
            sx={{
              display: 'grid',
              rowGap: '14px',
              maxHeight: '100%',
              alignContent: 'start',
              overflow: 'auto',
            }}
          >
            {credentialOfferAttributes.map((attr, index) => (
              <Typography sx={{ fontSize: '14px' }} key={index}>
                {attr}
              </Typography>
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            onClick={() => {
              alert('Move to VC generation phase')
              closeDialog()
            }}
          >
            Issue VC
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
