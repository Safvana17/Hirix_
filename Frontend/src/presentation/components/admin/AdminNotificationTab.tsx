import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'

import type { AppDispatch, RootState } from '../../../redux/store'
import NotificationRuleModal from '../modal/NotificationRuleModal'
import type { CreateNotificationRulePayload, NotificationRule, UpdateNotificationRulePayload } from '../../../types/notification'
import {
  createNotificationRule,
  editNotificationRule,
  getAllRules,
  getAllTemplates,
} from '../../../redux/slices/features/settingsSlice/adminSettings'

const NOTIFICATION_EVENTS: string[] = [
  'REGISTER_OTP_REQUESTED',
  'COMPANY_PROFILE_UPDATED',
  'COMPANY_APPROVED',
  'COMPANY_REJECTED',
  'RESET_PASSWORD_OTP_REQUESTED',
  'SUBSCRIPTION_REMINDER',
  'ACCOUNT_DELETED',
  'ACCOUNT_RESTORE',
]

const actionButtonSx = {
  backgroundColor: '#4F3503',
  borderRadius: 4,
  textTransform: 'none',
  '&:hover': { backgroundColor: '#3d2902' },
}

export default function AdminNotificationTab() {
  const dispatch = useDispatch<AppDispatch>()
  const { notificationRules, templates } = useSelector(
    (state: RootState) => state.AdminSettings
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null)

  useEffect(() => {
    dispatch(getAllTemplates({ params: {} }))
    dispatch(getAllRules())
  }, [dispatch])

  const handleCreateRule = (): void => {
    setSelectedRule(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleOpenEdit = (rule:NotificationRule): void => {
    setSelectedRule(rule)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  // const handleOpenView = (rule: any): void => {
  //   setSelectedRule(rule)
  //   setModalMode('view')
  //   setIsModalOpen(true)
  // }

  const handleSubmit = async (
    payload: CreateNotificationRulePayload | UpdateNotificationRulePayload
  ): Promise<void> => {
    try {
      if (modalMode === 'create') {
        if('event' in payload && 'channel' in payload){
          await dispatch(createNotificationRule(payload)).unwrap()
          toast.success('Notification rule created successfully')
        }else{
          toast.error('Invalid create payload')
        }
      }

      if (modalMode === 'edit' && selectedRule) {
        await dispatch(
          editNotificationRule(payload)
        ).unwrap()
        toast.success('Notification rule updated successfully')
      }

      setIsModalOpen(false)
      await dispatch(getAllRules())
    } catch (error) {
      toast.error(typeof error === 'string' ? error : error instanceof Error ? error.message : 'Operation failed')
    }
  }

  const getTemplateName = (key: string) => {
    const template = templates.find((t) => t.key === key)
    return template?.name || key
  }

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          onClick={handleCreateRule}
          sx={actionButtonSx}
        >
          Add Rule
        </Button>
      </Box>

      {notificationRules.length === 0 ? (
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
            bgcolor: '#fff',
          }}
        >
          <Typography variant="h6" fontWeight={700}>
            No rules available
          </Typography>
          <Typography variant="body2" color="text.secondary">
            Click "Add Rule" to create one
          </Typography>
        </Box>
      ) : (
        <Paper sx={{ borderRadius: 3, overflow: 'hidden' }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>
                  <strong>Event</strong>
                </TableCell>
                <TableCell>
                  <strong>Channel</strong>
                </TableCell>
                <TableCell>
                  <strong>Template</strong>
                </TableCell>
                <TableCell>
                  <strong>Status</strong>
                </TableCell>
                <TableCell align="right">
                  <strong>Actions</strong>
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {notificationRules.map((rule) => (
                <TableRow key={rule.id} hover>
                  <TableCell>{rule.event}</TableCell>

                  <TableCell>
                    <Chip
                      sx={{backgroundColor: '#0B3358', color: '#fff'}}
                      label={rule.channel}
                      // color={rule.channel === 'EMAIL' ? '' : 'secondary'}
                      size="small"
                    />
                  </TableCell>

                  <TableCell>{getTemplateName(rule.templateKey)}</TableCell>

                  <TableCell>
                    <Chip
                      label={rule.isActive ? 'Active' : 'Inactive'}
                      color={rule.isActive ? 'success' : 'default'}
                      size="small"
                    />
                  </TableCell>

                  <TableCell align="right">
                    <Box display="flex" justifyContent="flex-end" gap={1}>
                      {/* <Button
                        variant="outlined"
                        size="small"
                        onClick={() => handleOpenView(rule)}
                      >
                        View
                      </Button> */}
                      <Button
                        sx={{backgroundColor:'#6B4705'}}
                        variant="contained"
                        size="small"
                        onClick={() => handleOpenEdit(rule)}
                      >
                        Edit
                      </Button>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </Paper>
      )}

      <NotificationRuleModal
        key={selectedRule?.id ?? modalMode}
        open={isModalOpen}
        mode={modalMode}
        eventOptions={NOTIFICATION_EVENTS}
        templates={templates}
        rule={selectedRule}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}