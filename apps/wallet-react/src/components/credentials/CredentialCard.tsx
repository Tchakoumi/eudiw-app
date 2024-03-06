import { Box, Typography } from '@mui/material';
import AuthleteLogo from '../../assets/authlete-logo.png';
import { capitalize } from '../../utils/common';
import { IVerifiableCredential } from '../credential-types/credentials.types';

export default function CredentialCard({
  credential: { issuer, logo, title },
  openDetails,
}: {
  credential: IVerifiableCredential;
  openDetails?: () => void;
}) {
  return (
    <Box
      onClick={() => (openDetails ? openDetails() : null)}
      sx={{
        background: '#FFFFFF',
        padding: '24px',
        borderRadius: '8px',
        display: 'grid',
        rowGap: '13px',
        boxShadow: '0px 1px 24px 0px #2C333517',
        transition: 'all 0.3s ease-in-out',
        border: '1px solid #D1D5DB',
        cursor: 'pointer',
        '&:hover': {
          transform: 'scale(1.003)',
          backgroundColor: '#e6f4e6',
        },
      }}
    >
      <img src={logo ?? AuthleteLogo} height={35} alt="authlete logo" />
      <Box sx={{ display: 'grid', rowGap: '3px' }}>
        <Typography
          sx={{
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '24px',
          }}
        >{`${title}`}</Typography>
        <Typography sx={{ fontSize: '14px', lineHeight: '21px' }}>
          {issuer
            .split('.')
            .slice(0, 2)
            .map((_) => capitalize(_))
            .join(' ')}
        </Typography>
      </Box>
    </Box>
  );
}
