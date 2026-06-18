import { useState } from "react";
import {Box,TextField,Tabs,Tab,Paper } from "@mui/material";
// import UploadIcon from "@mui/icons-material/Upload";

export default function SettingsPage() {
  const [tab, setTab] = useState(0);

  return (
    <Box sx={{backgroundColor: '#fff'}} p={3} mx="auto">
    {/* <Box p={3} maxWidth={800} mx="auto"> */}

      <Tabs value={tab} onChange={(_,v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="General" />
      </Tabs>
      {tab === 0 && (
        <Paper sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Platform Name"
            margin="normal"
            disabled
            value="Hirix"
            // onChange={(e) =>
            //   handleChange("platformName", e.target.value)
            // }
          />

          <TextField
            fullWidth
            label="Support Email"
            margin="normal"
            value="support@hirix.com"
            disabled
            // onChange={(e) =>
            //   handleChange("supportEmail", e.target.value)
            // }
          />

          <TextField
            fullWidth
            label="Platform URL"
            margin="normal"
            value="https://hirix.com"
            disabled
          />
        </Paper>
      )}
    </Box>

    // </Box>
  );
}