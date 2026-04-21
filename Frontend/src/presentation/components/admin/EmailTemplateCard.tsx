import { Box, Button, Chip, Paper, Typography } from '@mui/material'
import type { EmailTemplate } from '../../../types/template'

interface TemplateCardProps {
  template: EmailTemplate
  onView: (template: EmailTemplate) => void
  onEdit: (template: EmailTemplate) => void
  onDelete: (template: EmailTemplate) => void
  onToggleStatus: (template: EmailTemplate) => void
}

export default function TemplateCard({
  template,
  onView,
  onEdit,
  onDelete,
  onToggleStatus
}: TemplateCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        gap: 1.5,
        height: '100%'
      }}
    >
      {/* HEADER */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={700}>
          {template.name}
        </Typography>

        <Box display="flex" gap={1}>
          <Chip label={template.channel} size="small" />

          <Chip
            label={template.isActive ? 'Active' : 'Inactive'}
            size="small"
            sx={{
              bgcolor: template.isActive ? '#1B5E20' : '#424242',
              color: '#fff',
              fontWeight: 600
            }}
          />
        </Box>
      </Box>

      {/* CONTENT */}
      <Typography variant="body2" color="text.secondary">
        Key: {template.key}
      </Typography>

      {template.subject && (
        <Typography variant="body2">Subject: {template.subject}</Typography>
      )}

      {template.title && (
        <Typography variant="body2">Title: {template.title}</Typography>
      )}

      {/* ACTIONS */}
      <Box display="flex" flexWrap="wrap" gap={1} mt={2}>
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: '#4F3503',
            '&:hover': { backgroundColor: '#3d2902' }
          }}
          onClick={() => onView(template)}
        >
          View
        </Button>

        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: '#0B3358',
            '&:hover': { backgroundColor: '#082844' }
          }}
          onClick={() => onEdit(template)}
        >
          Edit
        </Button>

        {/* Toggle Status */}
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: template.isActive ? '#6B7280' : '#047857',
            '&:hover': {
              backgroundColor: template.isActive ? '#4B5563' : '#065f46'
            }
          }}
          onClick={() => onToggleStatus(template)}
        >
          {template.isActive ? 'Deactivate' : 'Activate'}
        </Button>

        {/* Delete */}
        <Button
          variant="contained"
          size="small"
          sx={{
            backgroundColor: '#B91C1C',
            '&:hover': { backgroundColor: '#7F1D1D' }
          }}
          onClick={() => onDelete(template)}
        >
          Delete
        </Button>
      </Box>
    </Paper>
  )
}