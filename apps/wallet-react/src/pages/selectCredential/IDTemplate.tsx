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

const Transition = forwardRef(function Transition(
  props: TransitionProps & {
    children: JSX.Element;
  },
  ref: React.Ref<unknown>
) {
  return <Slide direction="left" ref={ref} {...props} />;
});

export function CredentialOfferDetails({
  isDialogOpen,
  closeDialog,
  credentialOfferAttributes,
}: {
  isDialogOpen: boolean;
  closeDialog: () => void;
  credentialOfferAttributes: string[];
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
          Hello world
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
            {credentialOfferAttributes.map((attr) => (
              <Typography sx={{ fontSize: '14px' }}>{attr}</Typography>
            ))}
          </Box>

          <Button
            variant="contained"
            color="primary"
            size="small"
            fullWidth
            onClick={() => alert('Move to VC generation phase')}
          >
            Issue VC
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
}
