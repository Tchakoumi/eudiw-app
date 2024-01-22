import { Box, Button, Typography } from '@mui/material';
import { useTheme } from '../../utils/theme';

export default function InstallPWABanner({
  installApp,
}: {
  installApp: () => Promise<void>;
}) {
  const theme = useTheme();

  return (
    <Box
      sx={{
        display: 'grid',
        gridAutoFlow: 'column',
        columnGap: 0.5,
        alignItems: 'center',
        padding: '8px',
        backgroundColor: theme.palette.secondary.light,
      }}
    >
      <Typography variant="body2" sx={{ fontWeight: '500' }}>
        To access the app from your phone, install now
      </Typography>
      <Button
        variant="contained"
        color="primary"
        size="small"
        onClick={installApp}
      >
        Install
      </Button>
    </Box>
  );
}
