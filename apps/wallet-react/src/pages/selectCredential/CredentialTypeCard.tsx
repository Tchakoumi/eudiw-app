import { Box, Typography, capitalize } from '@mui/material';
import AuthleteLogo from '../../assets/authlete-logo.png';

export default function CredentialTypeCard({
  type,
  issuer,
  displayName,
  selectCredentialType,
}: {
  type: string;
  issuer: string;
  displayName: string;
  selectCredentialType: (type: string) => void;
}) {
  return (
    <Box
      onClick={() => selectCredentialType(type)}
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
      <img src={AuthleteLogo} height={35} alt="authlete logo" />
      <Box sx={{ display: 'grid', rowGap: '3px' }}>
        <Typography
          sx={{
            fontWeight: '600',
            fontSize: '16px',
            lineHeight: '24px',
          }}
        >{`${displayName}`}</Typography>
        <Typography sx={{ fontSize: '14px', lineHeight: '21px' }}>
          {issuer
            .split('//')[1]
            .split('.')
            .slice(0, 2)
            .map((_) => capitalize(_))
            .join(' ')}
        </Typography>
      </Box>
    </Box>
  );
}
