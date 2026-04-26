import { useEffect, useState } from 'react'
import { Box, Button, Typography, Grid, Pagination, MenuItem, TextField, InputAdornment } from '@mui/material'
import TemplateModal from '../modal/EmailTemplateModal'
import TemplateCard from './EmailTemplateCard'
import type { TemplatePayload, EmailTemplate } from '../../../types/template'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import toast from 'react-hot-toast'
import { createEmailTemplate, deleteEmailTemplate, editEmailTemplate, getAllTemplates, updateEmailTemplateStatus } from '../../../redux/slices/features/settingsSlice/adminSettings'
import ConfirmationModal from '../modal/ConfirmationModal'
import { Search } from '@mui/icons-material'
import type { NotificationChannel } from '../../../types/notification'
import { useDebounce } from '../../../hooks/useDebounce'

const notificationChannel: NotificationChannel[] = ['EMAIL', 'IN_APP']

export default function TemplatePage() {
  const dispatch = useDispatch<AppDispatch>()
  const [formModalOpen, setFormModalOpen] = useState<boolean>(false)
  const [selectedTemplate, setSelectedTemplate] = useState<EmailTemplate | null>(null)
  const [mode, setMode] = useState<'create' | 'edit' | 'view'>('create')
  const [page, setPage ] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [channel, setChannel] = useState<NotificationChannel | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
  const { templates, pagination } = useSelector((state: RootState) => state.AdminSettings)

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
    type: 'danger' | 'warning' | 'info';
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => { },
    type: 'warning'
  })

  useEffect(() => {
    dispatch(getAllTemplates({params: {search: debouncedSearchTerm, channel: channel || undefined, page, limit:9}}))
  }, [dispatch, page, debouncedSearchTerm, channel])

  const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
    setModalConfig({...config, isOpen: true})
  }

  const closeModal = () => {
    setModalConfig(prev => ({...prev, isOpen: false}))
  }
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

  const handleToggleStatus = (template: EmailTemplate) => {
    const newStatus = template.isActive ? 'Deactivate' : 'Activate'
    const actionText = newStatus === 'Deactivate' ? 'Deactivate' : 'Activate'
  
    openModal({
      title: `${actionText} Template`,
      message: `Are you sure you want to ${actionText.toLowerCase()} this Template? ${newStatus === 'Deactivate' ? 'It will no longer be available for sending emails' : 'It will be available for sending emails again'}.`,
      type: newStatus === 'Deactivate' ? 'danger' : 'warning',
        onConfirm: async() => {
          try {
            await dispatch(updateEmailTemplateStatus({id: template.id, status: newStatus})).unwrap()
            toast.success('Template status updated successfully')
            closeModal()
            await dispatch(getAllTemplates({params: {page, limit: 9}}))
          } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to update template status')
          }
        }
    })
  }

  const handleDeleteTemplate = (template: EmailTemplate) => {  
    openModal({
      title: 'Delete Template',
      message: `Are you sure you want to delete this Template? It will no longer be available for sending emails.`,
      type: 'danger',
        onConfirm: async() => {
          try {
            await dispatch(deleteEmailTemplate({id: template.id})).unwrap()
            toast.success('Template deleted successfully')
            closeModal()
            await dispatch(getAllTemplates({params: {page, limit: 9}}))
          } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to delete template')
          }
        }
    })
  }

  const handleSubmit = async (payload: TemplatePayload) => {
    try {
      if (mode === 'create') {
        await dispatch(createEmailTemplate(payload)).unwrap()
        toast.success('Email template added successfully')
        setFormModalOpen(false)
      }
      if(mode === 'edit'){
         await dispatch(editEmailTemplate({data: payload, id: payload.id})).unwrap()
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
      <Box display="flex" gap={2} my={2}>
        <TextField
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          placeholder="Search questions, categories..."
          InputProps={{
            startAdornment: (
              <InputAdornment position='start'>
                <Search sx={{color: '#fff'}} />
              </InputAdornment>
            )
          }}
          sx={{
            borderRadius: 2,
            backgroundColor: "#6B4705",
            "& .MuiInputBase-input": {
              color: "#fff"
            },
            "& .MuiInputBase-input::placeholder": {
              color: "#fff",
              opacity: 0.7
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#6B4705"
              },
              "&:hover fieldset": {
                borderColor: "#6B4705"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6B4705"
              }
            }
          }}
        />
        <TextField
          select 
          label="Channel" 
          value={channel} 
          onChange={(e) => setChannel(e.target.value as NotificationChannel)} 
          sx={{ 
            width: 150, 
            background: "#6B4705", 
            borderRadius: 3,
            "& .MuiSelect-select": {
              color: "#fff"
            },
            "& .MuiInputLabel-root": {
              color: "#fff"
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#fff"
            },
            "& .MuiSvgIcon-root": {
              color: "#fff"
            },
            "& .MuiOutlinedInput-root": {
              "& fieldset": {
                borderColor: "#6B4705"
              },
              "&:hover fieldset": {
                borderColor: "#6B4705"
              },
              "&.Mui-focused fieldset": {
                borderColor: "#6B4705"
              }
            }
          }}>
          <MenuItem value="easy">Select Channel</MenuItem>
          {notificationChannel.map((d) => (
            <MenuItem key={d} value={d}>{d}</MenuItem>
          ))}
        </TextField>
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
                onDelete={() => handleDeleteTemplate(template)}
                onToggleStatus={() =>handleToggleStatus(template)}
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
      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />
    </Box>
  )
}