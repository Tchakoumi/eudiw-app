import { Box, Typography } from '@mui/material';

interface ConsentHeaderProps {
  service: string;
}
export default function ConsentHeader({ service }: ConsentHeaderProps) {
  return (
    <Box
      sx={{
        display: 'grid',
        justifyItems: 'center',
      }}
    >
      <Typography variant="h3">Select a credential</Typography>
      <Typography variant="body2">{`to present to ${service}`}</Typography>
    </Box>
  );
}
