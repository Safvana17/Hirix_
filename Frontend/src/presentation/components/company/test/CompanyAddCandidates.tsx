import { Box, Button, Grid, Paper, Stack, TextField, Typography } from '@mui/material'
import React, { useState } from 'react'
import type { CreateTestPayload } from '../../../../types/test'


interface CompanyAddCandidateProps {
  data: CreateTestPayload
  updateData: (data: Partial<CreateTestPayload>) => void
}


const CompanyAddCandidates: React.FC<CompanyAddCandidateProps>= ({data, updateData}) => {
  const [emailText, setEmailText] = useState('')

  const handleAddEmails = () => {
    const emails = emailText.split(/[\n,]+/).map((email) => email.trim().toLowerCase()).filter(Boolean)
    const uniqueEmails = Array.from(new Set([...data.candidates.map((c) => c.email), ...emails]))
    updateData({
      candidates: uniqueEmails.map((email) => ({ email }))
    })

    setEmailText('')
  }

  const handleRemoveEmail = (email: string) => {
    updateData({
      candidates: data.candidates.filter((candidate) => candidate.email !== email)
    })
  }

  return (
    <Box
      sx={{
        backgroundColor: '#E6DECF',
        borderRadius: 3,
        p: 4,
      }}
    >
      <Paper
        elevation={0}
        sx={{
          maxWidth: 720,
          mx: 'auto',
          p: 3,
          borderRadius: 2,
          backgroundColor: '#fff'
        }}
      >
        <Typography
          variant="h6"
          sx={{ mb: 3, fontWeight: 600, color: '#2B2B2B' }}
        >
          Add Email Addresses
        </Typography>
        <Grid container spacing={3}>
          <Grid size={{ xs: 12 }}>
            <TextField
              fullWidth
              multiline
              minRows={6}
              label="Add email addresses"
              placeholder={`
                sarah@gmail.com
                johndoe@gmail.com
                Or: sarah@gmail.com, johndoe@gmail.com
              `}
              value={emailText}
              onChange={(e) => setEmailText(e.target.value)}
            />
          </Grid>
          <Grid size={{ xs: 12}}>
             <Button
               variant='contained'
               onClick={handleAddEmails}
               sx={{
                backgroundColor: '#0B3861',
                textTransform: 'none',
                fontWeight: 600
               }}
             >
              Add Emails to List
             </Button>
          </Grid>
          <Grid size={{ xs: 12 }}>
            <Typography variant='subtitle2' sx={{ mb: 1}}>
              Email List ({data.candidates.length})
            </Typography>

            <Paper
              variant='outlined'
              sx={{
                minHeight: 110,
                p: 2,
                borderRadius: 1
              }}
            >
              {data.candidates.length === 0 ? (
                <Typography
                  variant='body2'
                  sx={{ textAlign: 'center', color: 'secondary', mt: 4}}
                >
                  No emails added yet
                </Typography>
              ) : (
                <Stack spacing={1}>
                  {data.candidates.map((candidate) => (
                    <Box
                      key={candidate.email}
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        alignItems: 'center',
                        px: 2,
                        py: 1,
                        borderRadius: 1,
                        backgroundColor: '#F5EFE6'
                      }}
                    >
                      <Typography variant='body2'>{candidate.email}</Typography>
                      <Button
                        size='small'
                        color='error'
                        onClick={() => handleRemoveEmail(candidate.email)}
                      >
                        Remove
                      </Button>
                    </Box>
                  ))}
                </Stack>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  )
}

export default CompanyAddCandidates
