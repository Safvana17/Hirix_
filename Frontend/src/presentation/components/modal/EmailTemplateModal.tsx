import React, { useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  TextField,
  Typography,
} from '@mui/material'
import type { TemplatePayload, EmailTemplate, TemplateChannel } from '../../../types/template'

interface TemplateModalProps {
  open: boolean
  mode: 'create' | 'edit' | 'view'
  template: EmailTemplate | null
  onClose: () => void
  onSubmit: (payload: TemplatePayload) => void
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 700,
  maxWidth: '95vw',
  maxHeight: '90vh',
  overflowY: 'auto',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4
}

const  TemplateModal: React.FC <TemplateModalProps> = ({ open, mode, template, onClose, onSubmit }: TemplateModalProps)  =>{
  const [form, setForm] = useState<TemplatePayload>({
    id: template?.id || '',
    key: template?.key || '',
    name: template?.name || '',
    channel:template?.channel || 'EMAIL',
    subject:template?.subject || '',
    title: template?.title || '',
    body: template?.body || '',
  })

  const handleChange = <K extends keyof TemplatePayload>(
    key: K,
    value: TemplatePayload[K]
  ): void => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleSubmit = (e: React.FormEvent): void => {
    e.preventDefault()
    console.log('data from modal:', form)
    if(mode === 'create'){
        onSubmit({
          id: '',
        key: form.key,
        name: form.name,
        channel: form.channel as TemplateChannel,
        subject: form.subject ?? null,
        title: form.title ?? null,
        body: form.body,
        })
    }else if(mode === 'edit' && template){
      onSubmit({
        id: template.id,
        key: form.key,
        name: form.name,
        channel: form.channel,
        subject: form.subject,
        title: form.title,
        body: form.body
      })
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={3}>
          {mode === 'create' ? 'Create Template' : 'Edit Template'}
        </Typography>

        <Box display="flex" flexDirection="column" gap={2.5}>
          <TextField
            label="Template Name"
            value={form.name}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
          />

          <TextField
            label="Template Key"
            value={form.key}
            onChange={(e) => handleChange('key', e.target.value)}
            fullWidth
            disabled={mode === 'edit'}
            helperText="Example: company_approved_email"
          />

          <FormControl fullWidth>
            <InputLabel>Channel</InputLabel>
            <Select
              value={form.channel}
              label="Channel"
              disabled={mode === 'edit'}
              onChange={(e) =>
                handleChange('channel', e.target.value as TemplateChannel)
              }
            >
              <MenuItem value="EMAIL">EMAIL</MenuItem>
              <MenuItem value="IN_APP">IN_APP</MenuItem>
            </Select>
          </FormControl>

          {form.channel === 'EMAIL' && (
            <TextField
              label="Subject"
              value={form.subject ?? ''}
              onChange={(e) => handleChange('subject', e.target.value)}
              fullWidth
            />
          )}

          {form.channel === 'IN_APP' && (
            <TextField
              label="Title"
              value={form.title ?? ''}
              onChange={(e) => handleChange('title', e.target.value)}
              fullWidth
            />
          )}

          <TextField
            label="Body"
            value={form.body}
            onChange={(e) => handleChange('body', e.target.value)}
            fullWidth
            multiline
            minRows={8}
            helperText="Use placeholders like {{companyName}}, {{candidateName}}"
          />

          <Box display="flex" justifyContent="flex-end" gap={1.5}>
            <Button variant="contained" onClick={onClose} sx={{backgroundColor: '#0a2e50'}}>
              Cancel
            </Button>
            <Button variant="contained" onClick={handleSubmit} sx={{backgroundColor: '#4F3503'}}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default TemplateModal