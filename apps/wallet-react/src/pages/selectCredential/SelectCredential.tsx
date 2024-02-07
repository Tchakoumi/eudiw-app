import { Box } from "@mui/material";

export default function SelectCredential() {
  return (
    <Box sx={{display:'grid', rowGap: 2}}>
        <Box style={{padding:'4px 2px', backgroundColor: 'white', color:'black', borderRadius: '2px', border:'1px solid grey'}}>
            This is the first credential
        </Box>
        <Box style={{padding:'4px 2px', backgroundColor: 'white', color:'black', borderRadius: '2px', border:'1px solid grey'}}>
            This is the second credential
        </Box>
    </Box>
  )
}
