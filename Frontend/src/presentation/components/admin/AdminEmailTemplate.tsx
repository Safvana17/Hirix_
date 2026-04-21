import { useEffect, useState } from 'react'
import { Box, Button, Typography, Grid, Pagination } from '@mui/material'
import TemplateModal from '../modal/EmailTemplateModal'
import TemplateCard from './EmailTemplateCard'
import type { TemplatePayload, EmailTemplate } from '../../../types/template'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import toast from 'react-hot-toast'
import { createEmailTemplate, editEmailTemplate, getAllTemplates } from '../../../redux/slices/features/settingsSlice/adminSettings'


export default function TemplatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create')
  const [page, setPage ] = useState(1)
  const { templates, pagination } = useSelector((state: RootState) => state.AdminSettings)

  useEffect(() => {
    dispatch(getAllTemplates({params: { page, limit:9}}))
  }, [dispatch, page])

  const handleOpenCreate = (): void => {
    setSelectedTemplate(null)
    setMode('create')
    setFormModalOpen(true)
  }
  console.log('from templates: ', templates)

  const handleEditTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setMode('edit')
    setFormModalOpen(true)
  }

  const handleViewTemplate = (template: EmailTemplate) => {
    setSelectedTemplate(template)
    setMode('view')
    setFormModalOpen(true)
  }
  const handleSubmit = async (payload: TemplatePayload) => {
    try {
      if (mode === 'create') {
        await dispatch(createEmailTemplate(payload)).unwrap()
        toast.success('Email template added successfully')
        setFormModalOpen(false)
      }
      if(mode === 'edit'){
         await dispatch(editEmailTemplate({data: payload, id: payload.id}))
         toast.success('Email template edited successfully')
         setFormModalOpen(false)
      }
      await dispatch(getAllTemplates({params: { page, limit:9}}))
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to create email templates')
    }
  }

  return (
    <Box p={3}>
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
        <>
        <Grid container spacing={2} alignItems='stretch'>
          {templates.map((template) => (
            <Grid
              key={template.id}
              size={{ xs: 12, md: 6, lg: 4 }}
              sx={{display: 'flex'}}
            >
              <TemplateCard
                template={template}
                onView={() => handleViewTemplate(template)}
                onEdit={() => handleEditTemplate(template)}
                onDelete={(t) => console.log(t)}
                onToggleStatus={(t) => console.log(t)}
              />
            </Grid>
          ))}
        </Grid>
        <Box display="flex" justifyContent="center" mt={3}>
          <Pagination count={pagination.templates.totalPages} page={page} onChange={(_, v) => setPage(v)} />
        </Box>
      </>
      )}
      <TemplateModal
        key={selectedTemplate?.id || mode}
        open={formModalOpen}
        mode={mode}
        template={selectedTemplate}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}