import { Box, Typography } from '@mui/material';

interface ClaimCardProps {
  title: string;
  value: string;
}
export default function ClaimCard({ title, value }: ClaimCardProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        rowGap: 0.5,
        padding: 1,
        borderRadius: '4px',
        boxShadow:
          '0px 2px 5px 0px #2C33351F, 0px 0px 2px 0px #2C333566, 0px 1px 0px 0px #033B4A75',
      }}
    >
      <Typography variant="body2">{title}</Typography>
      <Typography fontWeight={500}>{value}</Typography>
    </Box>
  );
}
