import { useState } from "react";
import {Box,TextField,Tabs,Tab,Paper } from "@mui/material";
// import UploadIcon from "@mui/icons-material/Upload";

export default function SettingsPage() {
  const [tab, setTab] = useState(0);

  const [settings, setSettings] = useState({
    platformName: "Hirix",
    supportEmail: "support@hirix.com",
    sessionTimeout: 30,
    allowRegistration: true,
    requireEmailVerification: true,
    enableCoding: true,
    enableVideo: false,
    enablePractice: true,
    logo: null,
  });

  // const handleChange = (key, value) => {
  //   setSettings((prev) => ({ ...prev, [key]: value }));
  // };

  // const handleLogoUpload = (e) => {
  //   const file = e.target.files[0];
  //   if (file) {
  //     const url = URL.createObjectURL(file);
  //     handleChange("logo", url);
  //   }
  // };

  // const handleSave = () => {
  //   console.log("Saving settings:", settings);
  //   // TODO: API call
  // };

  return (
    <Box sx={{backgroundColor: '#fff'}} p={3} mx="auto">
    {/* <Box p={3} maxWidth={800} mx="auto"> */}

      <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 2 }}>
        <Tab label="General" />
        {/* <Tab label="Branding" />
        <Tab label="Security" /> */}
      </Tabs>
      {tab === 0 && (
        <Paper sx={{ p: 3 }}>
          <TextField
            fullWidth
            label="Platform Name"
            margin="normal"
            disabled
            value={settings.platformName}
            // onChange={(e) =>
            //   handleChange("platformName", e.target.value)
            // }
          />

          <TextField
            fullWidth
            label="Support Email"
            margin="normal"
            value={settings.supportEmail}
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

      {/* {tab === 1 && (
        <Paper sx={{ p: 3 }}>
          <Box display="flex" alignItems="center" gap={2}>
            <Avatar
              src={settings.logo}
              sx={{ width: 64, height: 64 }}
            />
            <Button
              variant="outlined"
              component="label"
              startIcon={<UploadIcon />}
            >
              Upload Logo
              <input
                hidden
                type="file"
                onChange={handleLogoUpload}
              />
            </Button>
          </Box>
        </Paper>
      )} */}

      {/* FEATURES */}
      {/* {tab === 2 && (
        <Paper sx={{ p: 3 }}>
          <FormControlLabel
            control={
              <Switch
                checked={settings.enableCoding}
                onChange={(e) =>
                  handleChange("enableCoding", e.target.checked)
                }
              />
            }
            label="Coding Tests"
          /> */}

          {/* <FormControlLabel
            control={
              <Switch
                checked={settings.enableVideo}
                onChange={(e) =>
                  handleChange("enableVideo", e.target.checked)
                }
              />
            }
            label="Video Interviews"
          /> */}

          {/* <FormControlLabel
            control={
              <Switch
                checked={settings.enablePractice}
                onChange={(e) =>
                  handleChange("enablePractice", e.target.checked)
                }
              />
            }
            label="Practice Mode"
          />
        </Paper>
      )} */}

      {/* SECURITY */}
      {/* {tab === 3 && (
        <Paper sx={{ p: 3 }}>
          <TextField
            fullWidth
            type="number"
            label="Session Timeout (minutes)"
            margin="normal"
            value={settings.sessionTimeout}
            onChange={(e) =>
              handleChange("sessionTimeout", Number(e.target.value))
            }
          /> */}

          {/* <FormControlLabel
            control={
              <Switch
                checked={settings.allowRegistration}
                onChange={(e) =>
                  handleChange("allowRegistration", e.target.checked)
                }
              />
            }
            label="Allow Registration"
          /> */}

          {/* <FormControlLabel
            control={
              <Switch
                checked={settings.requireEmailVerification}
                onChange={(e) =>
                  handleChange(
                    "requireEmailVerification",
                    e.target.checked
                  )
                }
              />
            }
            label="Require Email Verification"
          />
        </Paper>
      )} */}

      {/* <Box mt={3} display="flex" justifyContent="flex-end">
        <Button variant="contained" onClick={handleSave}>
          Save Changes
        </Button>
      </Box> */}
    </Box>

    // </Box>
  );
}