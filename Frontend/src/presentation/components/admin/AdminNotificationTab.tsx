import React, { useEffect, useState } from 'react'
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
import type { CreateNotificationRulePayload } from '../../../types/notification'
import { createNotificationRule, getAllTemplates } from '../../../redux/slices/features/settingsSlice/adminSettings'

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

const emptyStateSx = {
  height: 300,
  border: '1px dashed #d1d5db',
  borderRadius: 4,
  display: 'flex',
  flexDirection: 'column',
  justifyContent: 'center',
  alignItems: 'center',
  gap: 1,
  bgcolor: '#fff',
}

const AdminNotificationTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const { notificationRules, templates } = useSelector(
    (state: RootState) => state.AdminSettings
  )

  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')

  const handleCreateRule = (): void => {
    setModalMode('create')
    setIsModalOpen(true)
  }

  useEffect(() => {
    dispatch(getAllTemplates({params: {}}))
  }, [dispatch])

  const handleSubmit = async (
    payload: CreateNotificationRulePayload
  ): Promise<void> => {
    try {
      if (modalMode === 'create') {
        await dispatch(createNotificationRule(payload)).unwrap()
        toast.success('Notification rule created successfully')
        setIsModalOpen(false)
      }
    } catch (error) {
      toast.error(
        typeof error === 'string' ? error : 'Failed to create rule'
      )
    }
  }

  const renderEmptyState = () => (
    <Box sx={emptyStateSx}>
      <Typography variant="h6" fontWeight={700}>
        No Rules available
      </Typography>
      <Typography variant="body2" color="text.secondary">
        Click "Add Rule" to create one
      </Typography>
    </Box>
  )

  const renderRulesTable = () => (
    <Box>
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        mb={3}
      >
        <Box>
          <Typography variant="h5" fontWeight={700}>
            Notification Rules
          </Typography>
          <Typography variant="body2" color="text.secondary" mt={0.5}>
            Configure which template should be used for each event and channel.
          </Typography>
        </Box>
      </Box>

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
            {filteredRules.map((rule) => (
              <TableRow key={rule.id} hover>
                <TableCell>{rule.event}</TableCell>

                <TableCell>
                  <Chip
                    label={rule.channel}
                    color={rule.channel === 'EMAIL' ? 'primary' : 'secondary'}
                    size="small"
                  />
                </TableCell>

                {/* <TableCell>
                  {getTemplateName(rule.templateKey, templates)}
                </TableCell> */}

                <TableCell>
                  <Chip
                    label={rule.isActive ? 'Active' : 'Inactive'}
                    color={rule.isActive ? 'success' : 'default'}
                    size="small"
                  />
                </TableCell>

                <TableCell align="right">
                  {/* <Box display="flex" justifyContent="flex-end" gap={1}>
                    <Button
                      variant="outlined"
                      size="small"
                      onClick={() => handleOpenView(rule)}
                    >
                      View
                    </Button>
                    <Button
                      variant="contained"
                      size="small"
                      onClick={() => handleOpenEdit(rule)}
                    >
                      Edit
                    </Button>
                  </Box> */}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
    </Box>
  )

  return (
    <Box p={3}>
      <Box display="flex" justifyContent="flex-end" mb={3}>
        <Button
          variant="contained"
          onClick={handleCreateRule}
          sx={actionButtonSx}
        >
          Add Template
        </Button>
      </Box>

      {notificationRules.length === 0 ? renderEmptyState() : renderRulesTable()}

      <NotificationRuleModal
        open={isModalOpen}
        mode={modalMode}
        eventOptions={NOTIFICATION_EVENTS}
        templates={templates}
        onClose={() => setIsModalOpen(false)}
        onSubmit={handleSubmit}
      />
    </Box>
  )
}

export default AdminNotificationTab