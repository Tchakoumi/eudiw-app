import {
  Box,
  Button,
  Checkbox,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material';
import { useNavigate } from 'react-router-dom';

export default function IDTemplate({
  credentialOfferAttributes,
  selectedClaimKeys,
  handleClaimSelection,
  handleSelectAll,
}: {
  credentialOfferAttributes: {
    key: string | number;
    preferredLocale: string;
  }[];
  selectedClaimKeys: string[];
  handleClaimSelection: (claimKey: string) => void;
  handleSelectAll: (keys: string[]) => void;
}) {
  const isAllSelected =
    selectedClaimKeys.length === credentialOfferAttributes.length;
  const push = useNavigate();

  return (
    <Box>
      <Typography variant="h4">
        Select Claims to present in credential
      </Typography>

      <TableContainer
        sx={{
          borderRadius: '8px',
          border: `1px solid #D1D5DB`,
          borderTopLeftRadius: 0,
          borderTopRightRadius: 0,
        }}
      >
        <Table stickyHeader size="small">
          <TableHead>
            <TableRow
              role="checkbox"
              onClick={() =>
                handleSelectAll(
                  isAllSelected
                    ? []
                    : credentialOfferAttributes.map(({ key }) => key as string)
                )
              }
              sx={{
                '& th': {
                  padding: '8.5px',
                },
              }}
            >
              <TableCell padding="checkbox">
                <Checkbox checked={isAllSelected} />
              </TableCell>
              <TableCell>Available Claims</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {credentialOfferAttributes.map(
              ({ key: attrKey, preferredLocale: name }) => (
                <TableRow
                  role="checkbox"
                  onClick={() => handleClaimSelection(String(attrKey))}
                  sx={{
                    '&:last-child td, &:last-child th': { border: 0 },
                    '& td': {
                      padding: '7px',
                    },
                  }}
                >
                  <TableCell padding="checkbox">
                    <Checkbox
                      checked={selectedClaimKeys.includes(String(attrKey))}
                    />
                  </TableCell>
                  <TableCell>{name}</TableCell>
                </TableRow>
              )
            )}
          </TableBody>
        </Table>
      </TableContainer>

      <Box
        sx={{
          display: 'grid',
          gridAutoFlow: 'column',
          columnGap: 1,
          alignItems: 'center',
          justifyItems: 'start',
          justifyContent: 'end',
          marginTop: '8px',
        }}
      >
        <Button
          variant="outlined"
          color="primary"
          size="small"
          onClick={() => push('/')}
        >
          Cancel
        </Button>

        <Button
          variant="contained"
          color="primary"
          size="small"
          disabled={selectedClaimKeys.length === 0}
          onClick={() => alert('Move to VC generation phase')}
        >
          Generate VC
        </Button>
      </Box>
    </Box>
  );
}
