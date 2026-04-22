import { useMemo, useState } from 'react'
import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Modal,
  Select,
  Switch,
  Typography
} from '@mui/material'
import type { EmailTemplate } from '../../../types/template'
import type{ CreateNotificationRulePayload, NotificationChannel, NotificationRule, UpdateNotificationRulePayload } from '../../../types/notification'

interface RuleModalProps {
  open: boolean
  mode: 'create' | 'edit' | 'view'
  rule: NotificationRule | null
  templates: EmailTemplate[]
//   loading: boolean
  eventOptions: string[]
  onClose: () => void
  onSubmit: (
    payload: CreateNotificationRulePayload | UpdateNotificationRulePayload
  ) => void
}

interface RuleFormState {
  event: string
  channel: NotificationChannel
  templateKey: string
  isActive: boolean
}

const modalStyle = {
  position: 'absolute' as const,
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 650,
  maxWidth: '95vw',
  bgcolor: 'background.paper',
  borderRadius: 3,
  boxShadow: 24,
  p: 4
}

const NotificationRuleModal: React.FC <RuleModalProps> = ({
  open,
  mode,
  templates,
  rule,
  eventOptions,
  onClose,
  onSubmit
}: RuleModalProps) => {
  const [form, setForm] = useState<RuleFormState>({
    event: rule?.event || '',
    channel: rule?.channel ||  'EMAIL',
    templateKey: rule?.templateKey || '',
    isActive: rule?.isActive ?? true
  })

  const filteredTemplates = useMemo(() => {
    return templates.filter(
      (template) => template.channel === form.channel && template.isActive
    )
  }, [templates, form.channel])

//   useEffect(() => {
//     const matchedTemplate = filteredTemplates.find(
//       (template) => template.key === form.templateKey
//     )

//     if (!matchedTemplate) {
//       setForm((prev) => ({
//         ...prev,
//         templateKey: filteredTemplates[0]?.key ?? ''
//       }))
//     }
//   }, [filteredTemplates, form.templateKey])

  const handleSubmit = (): void => {
    if (mode === 'edit' && rule) {
      onSubmit({
        id: rule.id,
        templateKey: form.templateKey,
        isActive: form.isActive
      })
      return
    }
    onSubmit({
      id: '',
      event: form.event,
      channel: form.channel,
      templateKey: form.templateKey,
      isActive: form.isActive
    })
  }

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={modalStyle}>
        <Typography variant="h6" fontWeight={700} mb={3}>
          {mode === 'create' ? 'Create Notification Rule' : 'Edit Notification Rule'}
        </Typography>

        <Box display="flex" flexDirection="column" gap={2.5}>
          <FormControl fullWidth>
            <InputLabel>Event</InputLabel>
            <Select
              value={form.event}
              label="Event"
              disabled={mode === 'edit'}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  event: e.target.value
                }))
              }
            >
              {eventOptions.map((event) => (
                <MenuItem key={event} value={event}>
                  {event}
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Channel</InputLabel>
            <Select
              value={form.channel}
              label="Channel"
              disabled={mode === 'edit'}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  channel: e.target.value as NotificationChannel,
                  templateKey: ''
                }))
              }
            >
              <MenuItem value="EMAIL">EMAIL</MenuItem>
              <MenuItem value="IN_APP">IN_APP</MenuItem>
            </Select>
          </FormControl>

          <FormControl fullWidth>
            <InputLabel>Template</InputLabel>
            <Select
              value={form.templateKey}
              label="Template"
              disabled={mode === 'edit'}
              onChange={(e) =>
                setForm((prev) => ({
                  ...prev,
                  templateKey: e.target.value
                }))
              }
            >
              {filteredTemplates.map((template) => (
                <MenuItem key={template.id} value={template.key}>
                  {template.name} ({template.key})
                </MenuItem>
              ))}
            </Select>
          </FormControl>

          <FormControlLabel
            control={
              <Switch
                checked={form.isActive}
                onChange={(e) =>
                  setForm((prev) => ({
                    ...prev,
                    isActive: e.target.checked
                  }))
                }
              />
            }
            label="Active"
          />

          <Box display="flex" justifyContent="flex-end" gap={1.5}>
            <Button variant="contained" sx={{backgroundColor: '#5e0808'}} onClick={onClose}>
              Cancel
            </Button>
            <Button variant="contained" sx={{backgroundColor: "#4F3503"}} onClick={handleSubmit}>
              {mode === 'create' ? 'Create' : 'Update'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Modal>
  )
}

export default NotificationRuleModal