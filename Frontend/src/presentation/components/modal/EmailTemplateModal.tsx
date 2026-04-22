import React, { useState } from 'react'
import {
  Box,
  Button,
  Chip,
  FormControl,
  FormControlLabel,
  IconButton,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Stack,
  Switch,
  TextField,
  Typography,
} from '@mui/material'
import type { TemplatePayload, EmailTemplate, TemplateChannel } from '../../../types/template'
import { Close } from '@mui/icons-material';

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
    footerText: template?.footerText || '',
    ctaText: template?.ctaText || '',
    ctaUrl: template?.ctaUrl || '',
    showOtpBox: template?.showOtpBox || false,
    otpLabel: template?.otpLabel || '',
    expiryText: template?.expiryText || '',
    supportText: template?.supportText || '',
    isActive: template?.isActive || true
  })
  const [showButtonSection, setShowButtonSection] = useState(!!template?.ctaText || !!template?.ctaUrl)

  const handleChange = <K extends keyof TemplatePayload>(
    key: K,
    value: TemplatePayload[K]
  ): void => {
    setForm((prev) => ({
      ...prev,
      [key]: value
    }))
  }

  const handleToggleButton = (checked: boolean) => {
    setShowButtonSection(checked)
    if(!checked){
      setForm((prev) => ({
        ...prev,
        ctaText: '',
        ctaUrl: ''
      }))
    }
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
          footerText: form.footerText,
          ctaText: form.ctaText,
          ctaUrl: form.ctaUrl,
          showOtpBox: form.showOtpBox,
          otpLabel: form.otpLabel,
          expiryText: form.expiryText,
          supportText: form.supportText,
          isActive: form.isActive
        })
    }else if(mode === 'edit' && template){
      onSubmit({
        id: template.id,
        key: form.key,
        name: form.name,
        channel: form.channel,
        subject: form.subject,
        title: form.title,
        body: form.body,
        footerText: form.footerText,
        ctaText: form.ctaText,
        ctaUrl: form.ctaUrl,
        showOtpBox: form.showOtpBox,
        otpLabel: form.otpLabel,
        expiryText: form.expiryText,
        supportText: form.supportText,
        isActive: form.isActive
      })
    }
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Typography variant="h6" fontWeight={700}>
          {mode === 'create'
            ? 'Create Template'
            : mode === 'edit'
            ? 'Edit Template'
            : 'View Template'}
        </Typography>

        <IconButton
          onClick={onClose}
          sx={{
            color: '#000',
          }}
        >
          <Close />
        </IconButton>
      </Box>

        <Box display="flex" flexDirection="column" gap={2.5}>
          <TextField
            label="Template Name"
            value={form.name}
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
            onChange={(e) => handleChange('name', e.target.value)}
            fullWidth
          />

          <TextField
            label="Template Key"
            value={form.key}
            onChange={(e) => handleChange('key', e.target.value)}
            fullWidth
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
            helperText="Example: company_approved_email"
          />

          <FormControl fullWidth>
            <InputLabel>Channel</InputLabel>
            <Select
              value={form.channel}
              label="Channel"
              slotProps={{
                input: {
                  readOnly: mode === 'view',
                },
              }}
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
              slotProps={{
                input: {
                  readOnly: mode === 'view',
                },
              }}
              onChange={(e) => handleChange('subject', e.target.value)}
              fullWidth
            />
          )}

          {form.channel === 'IN_APP' && (
            <TextField
              label="Title"
              value={form.title ?? ''}
              slotProps={{
                input: {
                  readOnly: mode === 'view',
                },
              }}
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
            slotProps={{
              input: {
                readOnly: mode === 'view',
              },
            }}
            helperText="Use placeholders like {{companyName}}, {{candidateName}}"
          />
          {form.channel === 'EMAIL' && (
            <>
          <FormControlLabel
            control={
              <Switch
                checked={form.showOtpBox || false}
                onChange={(e) => handleChange('showOtpBox', e.target.checked)}
              />
            }
            label="Include OTP Section"
          />

          {form.showOtpBox && (
            <Stack spacing={2}>
              <TextField
                label="OTP Label"
                value={form.otpLabel || ''}
                onChange={(e) => handleChange('otpLabel', e.target.value)}
                fullWidth
              />

              <TextField
                label="Expiry Text (use {{expiryTime}})"
                value={form.expiryText || ''}
                onChange={(e) => handleChange('expiryText', e.target.value)}
                fullWidth
              />
            </Stack>
          )}
          <FormControlLabel
            control={
              <Switch
                checked={showButtonSection}
                onChange={(e) =>handleToggleButton(e.target.checked )}
              />
            }
            label="Include Button"
          />

          {showButtonSection && (
            <Stack spacing={2}>
              <TextField
                label="Button Text"
                value={form.ctaText || ''}
                onChange={(e) => handleChange('ctaText', e.target.value)}
                fullWidth
              />

              <TextField
                label="Button URL (can use variables like {{loginUrl}})"
                value={form.ctaUrl || ''}
                onChange={(e) => handleChange('ctaUrl', e.target.value)}
                fullWidth
              />
            </Stack>
          )}
          <TextField
            label="Footer Text"
            value={form.footerText || ''}
            onChange={(e) => handleChange('footerText', e.target.value)}
            multiline
            rows={2}
            fullWidth
          />

          <TextField
            label="Support Text"
            value={form.supportText || ''}
            onChange={(e) => handleChange('supportText', e.target.value)}
            fullWidth
          />
          </>
          )}
          {mode === 'view' && (
            <Box display="flex" justifyContent="flex-start">
              <Chip
                label={form.isActive ? 'Active' : 'Inactive'}
                color={form.isActive ? 'success' : 'default'}
                variant={form.isActive ? 'filled' : 'outlined'}
              />
            </Box>
          )}

          {mode !== 'view' && (
            <Box display="flex" justifyContent="flex-end" gap={1.5}>
              <Button variant="contained" onClick={onClose} sx={{backgroundColor: '#0a2e50'}}>
                Cancel
              </Button>
              <Button variant="contained" onClick={handleSubmit} sx={{backgroundColor: '#4F3503'}}>
                {mode === 'create' ? 'Create' : 'Update'}
              </Button>
            </Box>
          )}
        </Box>
      </Box>
    </Modal>
  )
}

export default TemplateModal