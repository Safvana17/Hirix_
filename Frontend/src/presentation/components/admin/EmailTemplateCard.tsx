import { Box, Button, Chip, Paper, Typography } from '@mui/material'
import type { EmailTemplate } from '../../../types/template'

interface TemplateCardProps {
  template: EmailTemplate
  onView: (template: EmailTemplate) => void
  onEdit: (template: EmailTemplate) => void
}

export default function TemplateCard({
  template,
  onView,
  onEdit
}: TemplateCardProps) {
  return (
    <Paper
      elevation={2}
      sx={{
        p: 2,
        borderRadius: 3,
        display: 'flex',
        flexDirection: 'column',
        gap: 1.5
      }}
    >
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight={700}>
          {template.name}
        </Typography>

        <Box display="flex" gap={1}>
          <Chip label={template.channel} size="small" />
          <Chip
            label={template.isActive ? 'Active' : 'Inactive'}
            color={template.isActive ? 'success' : 'default'}
            size="small"
          />
        </Box>
      </Box>

      <Typography variant="body2" color="text.secondary">
        Key: {template.key}
      </Typography>

      {template.subject && (
        <Typography variant="body2">Subject: {template.subject}</Typography>
      )}

      {template.title && (
        <Typography variant="body2">Title: {template.title}</Typography>
      )}

      <Typography
        variant="body2"
        color="text.secondary"
        sx={{
          display: '-webkit-box',
          overflow: 'hidden',
          WebkitLineClamp: 3,
          WebkitBoxOrient: 'vertical'
        }}
      >
        {template.body}
      </Typography>

      <Box display="flex" gap={1} mt={1}>
        <Button variant="outlined" onClick={() => onView(template)}>
          View
        </Button>
        <Button variant="contained" onClick={() => onEdit(template)}>
          Edit
        </Button>
      </Box>
    </Paper>
  )
}