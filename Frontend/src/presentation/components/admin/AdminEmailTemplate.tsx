import { useState } from 'react'
import { Box, Button, Typography, Grid } from '@mui/material'
import TemplateModal from '../modal/EmailTemplateModal'
import TemplateCard from './EmailTemplateCard'
import type { CreateTemplatePayload } from '../../../types/template'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import toast from 'react-hot-toast'
import { createEmailTemplate } from '../../../redux/slices/features/settingsSlice/adminSettings'

export default function TemplatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)
  const [mode, setMode] = useState<'create' | 'edit'>('create')
  const { templates } = useSelector((state: RootState) => state.AdminSettings)

  const handleOpenCreate = (): void => {
    setMode('create')
    setFormModalOpen(true)
  }

  const handleSubmit = async (payload: CreateTemplatePayload) => {
    try {
      if (mode === 'create') {
        await dispatch(createEmailTemplate(payload)).unwrap()
        toast.success('Email template added successfully')
        setFormModalOpen(false)

        // you said you will fetch later → so no local push needed
      }
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to create email templates')
    }
  }

  return (
    <Box p={3}>
      {/* HEADER */}
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          onClick={handleOpenCreate}
          sx={{
            backgroundColor: '#4F3503',
            borderRadius: 4,
            textTransform: 'none',
            '&:hover': { backgroundColor: '#3d2902' }
          }}
        >
          Add Template
        </Button>
      </Box>

      {/* EMPTY STATE */}
      {templates.length === 0 ? (
        <Box
          sx={{
            height: 300,
            border: '1px dashed #d1d5db',
            borderRadius: 4,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 1,
            bgcolor: '#fff'
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            No template available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add Template" to create one
          </Typography>
        </Box>
      ) : (
        /* TEMPLATE CARDS */
        <Grid container spacing={2}>
          {templates.map((template) => (
            <Grid
              key={template.id}
              size={{ xs: 12, md: 6, lg: 4 }}
            >
              <TemplateCard
                template={template}
                onView={(t) => console.log('view', t)}
                onEdit={(t) => console.log('edit', t)}
              />
            </Grid>
          ))}
        </Grid>
      )}

      {/* MODAL */}
      <TemplateModal
        open={formModalOpen}
        mode={mode}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}