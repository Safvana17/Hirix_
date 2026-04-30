import React from 'react'
import {
  Box,
  FormControlLabel,
  Grid,
  Paper,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import type { CreateTestPayload } from '../../../../types/test'

interface CompanyTestRulesProps {
  data: CreateTestPayload
  updateData: (data: Partial<CreateTestPayload>) => void
}

const CompanyTestRules: React.FC<CompanyTestRulesProps> = ({ data, updateData }) => {
  const updateRules = (
    section: keyof CreateTestPayload['rules'],
    value: object
  ) => {
    updateData({
      rules: {
        ...data.rules,
        [section]: {
          ...data.rules[section],
          ...value,
        },
      },
    })
  }

  return (
    <Box sx={{ backgroundColor: '#E6DECF', borderRadius: 3, p: { xs: 2, md: 4 } }}>
      <Paper
        elevation={0}
        sx={{
          maxWidth: 900,
          mx: 'auto',
          p: { xs: 2.5, md: 4 },
          borderRadius: 3,
          backgroundColor: '#fff',
        }}
      >
        <Typography variant="h6" fontWeight={700} mb={3}>
          Test Configuration
        </Typography>

        <Grid container spacing={3}>
          <Grid size={{ xs: 12, md: 6 }}>
            <RuleCard title="Timer Rules">
              <RuleSwitch
                title="Auto Submit On Time End"
                description="Automatically submit when test time expires"
                checked={data.rules.timing.autoSubmissionOnTimeEnds}
                onChange={(checked) =>
                  updateRules('timing', { autoSubmissionOnTimeEnds: checked })
                }
              />

              <RuleInput
                label="Duration In Minutes"
                value={data.rules.timing.durationInMinutes}
                onChange={(value) =>
                  updateRules('timing', { durationInMinutes: value })
                }
              />

              <RuleInput
                label="Warning Before End In Minutes"
                value={data.rules.timing.warningBeforeEndInMinutes}
                onChange={(value) =>
                  updateRules('timing', { warningBeforeEndInMinutes: value })
                }
              />
            </RuleCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <RuleCard title="Navigation Rules">
              <RuleSwitch
                title="Allow Tab Switch"
                description="Allow candidate to leave the test tab"
                checked={data.rules.navigation.allowTabSwitch}
                onChange={(checked) =>
                  updateRules('navigation', { allowTabSwitch: checked })
                }
              />

              <RuleInput
                label="Max Tab Switch Count"
                value={data.rules.navigation.maxTabSwitchCount}
                onChange={(value) =>
                  updateRules('navigation', { maxTabSwitchCount: value })
                }
              />

              <RuleSwitch
                title="Auto Submit On Tab Violation"
                description="Submit test if tab switch limit is reached"
                checked={data.rules.navigation.autoSubmissionOnTabViolation}
                onChange={(checked) =>
                  updateRules('navigation', {
                    autoSubmissionOnTabViolation: checked,
                  })
                }
              />

              <RuleSwitch
                title="Shuffle Questions"
                description="Randomize question order"
                checked={data.rules.navigation.shuffleQuestion}
                onChange={(checked) =>
                  updateRules('navigation', { shuffleQuestion: checked })
                }
              />

              <RuleSwitch
                title="Shuffle Options"
                description="Randomize MCQ options"
                checked={data.rules.navigation.shuffleOptions}
                onChange={(checked) =>
                  updateRules('navigation', { shuffleOptions: checked })
                }
              />

              <RuleSwitch
                title="Allow Back Navigation"
                description="Allow candidate to go back to previous questions"
                checked={data.rules.navigation.allowBackNavigation}
                onChange={(checked) =>
                  updateRules('navigation', { allowBackNavigation: checked })
                }
              />
            </RuleCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <RuleCard title="Proctoring Rules">
              <RuleSwitch
                title="Enable Camera"
                description="Require webcam access"
                checked={data.rules.proctoring.enableCamera}
                onChange={(checked) =>
                  updateRules('proctoring', { enableCamera: checked })
                }
              />

              <RuleSwitch
                title="Capture Snapshots"
                description="Capture candidate snapshots during the test"
                checked={data.rules.proctoring.captureSnapShots}
                onChange={(checked) =>
                  updateRules('proctoring', { captureSnapShots: checked })
                }
              />

              <RuleInput
                label="Snapshot Interval Seconds"
                value={data.rules.proctoring.snapShotIntervalSeconds}
                onChange={(value) =>
                  updateRules('proctoring', { snapShotIntervalSeconds: value })
                }
              />

              <RuleSwitch
                title="Detect No Face"
                description="Warn if no face is detected"
                checked={data.rules.proctoring.detectNoFace}
                onChange={(checked) =>
                  updateRules('proctoring', { detectNoFace: checked })
                }
              />

              <RuleSwitch
                title="Detect Multiple Face"
                description="Warn if multiple faces are detected"
                checked={data.rules.proctoring.detectMultipleFace}
                onChange={(checked) =>
                  updateRules('proctoring', { detectMultipleFace: checked })
                }
              />

              <RuleInput
                label="Max Warnings Allowed"
                value={data.rules.proctoring.maxWarningsAllowed}
                onChange={(value) =>
                  updateRules('proctoring', { maxWarningsAllowed: value })
                }
              />

              <RuleSwitch
                title="Auto Submit On Max Warnings"
                description="Submit when warning limit is reached"
                checked={data.rules.proctoring.autoSubmissionOnMaxWarnings}
                onChange={(checked) =>
                  updateRules('proctoring', {
                    autoSubmissionOnMaxWarnings: checked,
                  })
                }
              />
            </RuleCard>
          </Grid>

          <Grid size={{ xs: 12, md: 6 }}>
            <RuleCard title="Behavior Rules">
              <RuleSwitch
                title="Enforce Full Screen"
                description="Require full screen mode"
                checked={data.rules.behavior.enforceFullScreen}
                onChange={(checked) =>
                  updateRules('behavior', { enforceFullScreen: checked })
                }
              />

              <RuleSwitch
                title="Auto Submit Full Screen Exit"
                description="Submit if candidate exits full screen"
                checked={data.rules.behavior.autoSubmissionFullScreenExit}
                onChange={(checked) =>
                  updateRules('behavior', {
                    autoSubmissionFullScreenExit: checked,
                  })
                }
              />

              <RuleSwitch
                title="Allow Copy Paste"
                description="Allow copy and paste"
                checked={data.rules.behavior.allowCopyPaste}
                onChange={(checked) =>
                  updateRules('behavior', { allowCopyPaste: checked })
                }
              />

              <RuleSwitch
                title="Allow Right Click"
                description="Allow browser right click"
                checked={data.rules.behavior.allowRightClick}
                onChange={(checked) =>
                  updateRules('behavior', { allowRightClick: checked })
                }
              />

              <RuleSwitch
                title="Allow Keyboard Shortcuts"
                description="Allow browser keyboard shortcuts"
                checked={data.rules.behavior.allowKeyboardShortcuts}
                onChange={(checked) =>
                  updateRules('behavior', { allowKeyboardShortcuts: checked })
                }
              />
            </RuleCard>
          </Grid>

          <Grid size={{ xs: 12 }}>
            <RuleCard title="Auto Save Rules">
              <Grid container spacing={2}>
                <Grid size={{ xs: 12, md: 4 }}>
                  <RuleSwitch
                    title="Enable Auto Save"
                    description="Save answers automatically"
                    checked={data.rules.autoSave.enabled}
                    onChange={(checked) =>
                      updateRules('autoSave', { enabled: checked })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <RuleInput
                    label="Interval In Seconds"
                    value={data.rules.autoSave.intervalInSeconds}
                    onChange={(value) =>
                      updateRules('autoSave', { intervalInSeconds: value })
                    }
                  />
                </Grid>

                <Grid size={{ xs: 12, md: 4 }}>
                  <RuleSwitch
                    title="Save On Every Answer"
                    description="Save immediately after each answer"
                    checked={data.rules.autoSave.saveOnEveryAnswer}
                    onChange={(checked) =>
                      updateRules('autoSave', { saveOnEveryAnswer: checked })
                    }
                  />
                </Grid>
              </Grid>
            </RuleCard>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

const RuleCard = ({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        height: '100%',
        p: 2.5,
        borderRadius: 3,
        backgroundColor: '#F5EFE6',
        border: '1px solid #D8CBB8',
      }}
    >
      <Typography fontWeight={700} mb={2} color="#2B2B2B">
        {title}
      </Typography>

      <Box display="flex" flexDirection="column" gap={2}>
        {children}
      </Box>
    </Paper>
  )
}

interface RuleSwitchProps {
  title: string
  description: string
  checked: boolean
  onChange: (checked: boolean) => void
}

const RuleSwitch: React.FC<RuleSwitchProps> = ({
  title,
  description,
  checked,
  onChange,
}) => {
  return (
    <Paper
      elevation={0}
      sx={{
        p: 1.5,
        borderRadius: 2,
        backgroundColor: '#fff',
        border: '1px solid #E0D6C8',
      }}
    >
      <FormControlLabel
        sx={{
          m: 0,
          width: '100%',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
        labelPlacement="start"
        control={
          <Switch
            checked={checked}
            onChange={(e) => onChange(e.target.checked)}
            sx={{
              '& .MuiSwitch-switchBase.Mui-checked': {
                color: '#6B4705',
              },
              '& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track': {
                backgroundColor: '#6B4705',
              },
            }}
          />
        }
        label={
          <Box>
            <Typography fontWeight={700} fontSize={13}>
              {title}
            </Typography>
            <Typography fontSize={11.5} color="text.secondary">
              {description}
            </Typography>
          </Box>
        }
      />
    </Paper>
  )
}

interface RuleInputProps {
  label: string
  value: number
  onChange: (value: number) => void
}

const RuleInput: React.FC<RuleInputProps> = ({ label, value, onChange }) => {
  return (
    <TextField
      fullWidth
      type="number"
      label={label}
      value={value}
      onChange={(e) => onChange(Number(e.target.value))}
      sx={{
        backgroundColor: '#fff',
        borderRadius: 2,
        '& .MuiOutlinedInput-root': {
          borderRadius: 2,
        },
      }}
    />
  )
}

export default CompanyTestRules