import {
  Box,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import Grid from '@mui/material/Grid'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../../redux/store'
import type { CreateTestPayload } from '../../../../types/test'
import { getAllJobRoles } from '../../../../redux/slices/features/jobRoles/jobRoleSlice'

interface CompanyTestBasicInfoProps {
  data: CreateTestPayload
  updateData: (data: Partial<CreateTestPayload>) => void
}

const CompanyTestBasicInfo: React.FC<CompanyTestBasicInfoProps> = ({ data, updateData }) => {
  const dispatch = useDispatch<AppDispatch>()
  const { jobRoles } = useSelector((state: RootState) => state.jobRole)

  useEffect(() => {
    dispatch(getAllJobRoles({}))
  }, [dispatch])

  const inputStyle = {
    backgroundColor: '#FFFFFF',
    borderRadius: 2,
    boxShadow: '0px 2px 6px rgba(0,0,0,0.05)',
    '& .MuiOutlinedInput-root': {
      borderRadius: 2,
    },
  }
  
  return (
    <Box
      sx={{
        backgroundColor: '#E6DECF',
        borderRadius: 3,
        p: 4,
      }}
    >
      <Typography
        variant="h6"
        sx={{ mb: 3, fontWeight: 600, color: '#2B2B2B' }}
      >
        Test Details
      </Typography>

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            label="Test Name"
            value={data.name}
            onChange={(e) => updateData({ name: e.target.value })}
            variant="outlined"
            sx={inputStyle}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <FormControl fullWidth sx={inputStyle}>
            <InputLabel>Job Role</InputLabel>
            <Select
              value={data.jobRoleId}
              label="Job Role"
              onChange={(e) =>
                updateData({
                  jobRoleId: e.target.value,
                })
              }
            >
              {jobRoles.map((role) => (
                <MenuItem key={role.id || role.id} value={role.id || role.id}>
                  {role.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Grid>

        <Grid size={{ xs: 12 }}>
          <TextField
            fullWidth
            multiline
            rows={3}
            label="Description"
            value={data.description}
            onChange={(e) => updateData({ description: e.target.value })}
            sx={inputStyle}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="datetime-local"
            label="Start Time"
            value={data.startTime}
            onChange={(e) => updateData({ startTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={inputStyle}
          />
        </Grid>

        <Grid size={{ xs: 12, md: 6 }}>
          <TextField
            fullWidth
            type="datetime-local"
            label="End Time"
            value={data.endTime}
            onChange={(e) => updateData({ endTime: e.target.value })}
            InputLabelProps={{ shrink: true }}
            sx={inputStyle}
          />
        </Grid>
      </Grid>
    </Box>
  )
}

export default CompanyTestBasicInfo