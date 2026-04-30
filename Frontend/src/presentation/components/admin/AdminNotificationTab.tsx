import { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Chip,
  InputAdornment,
  MenuItem,
  Pagination,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from '@mui/material'
import { useDispatch, useSelector } from 'react-redux'
import toast from 'react-hot-toast'
import type { AppDispatch, RootState } from '../../../redux/store'
import NotificationRuleModal from '../modal/NotificationRuleModal'
import type { CreateNotificationRulePayload, NotificationChannel, NotificationRule, UpdateNotificationRulePayload } from '../../../types/notification'
import { createNotificationRule, deleteNotificationRule, editNotificationRule, getAllRules, getAllTemplates } from '../../../redux/slices/features/settingsSlice/adminSettings'
import ConfirmationModal from '../modal/ConfirmationModal'
import { useDebounce } from '../../../hooks/useDebounce'
import { Search } from '@mui/icons-material'

const NOTIFICATION_EVENTS: string[] = [
  'REGISTER_OTP_REQUESTED',
  'COMPANY_PROFILE_UPDATED',
  'COMPANY_APPROVED',
  'COMPANY_REJECTED',
  'RESET_PASSWORD_OTP_REQUESTED',
  'SUBSCRIPTION_REMINDER',
  'ACCOUNT_DELETED',
  'ACCOUNT_RESTORE',
  'TEST_INVITE'
]

const notificationChannel: NotificationChannel[] = ['EMAIL', 'IN_APP']
const actionButtonSx = {
  backgroundColor: '#4F3503',
  borderRadius: 4,
  textTransform: 'none',
  '&:hover': { backgroundColor: '#3d2902' },
}

export default function AdminNotificationTab() {
  const dispatch = useDispatch<AppDispatch>()
  const { notificationRules, templates, pagination } = useSelector((state: RootState) => state.AdminSettings )
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [modalMode, setModalMode] = useState<'create' | 'edit' | 'view'>('create')
  const [selectedRule, setSelectedRule] = useState<NotificationRule | null>(null)
  const [page, setPage] = useState(1)
  const [searchTerm, setSearchTerm] = useState('')
  const [channel, setChannel] = useState<NotificationChannel | null>(null)
  const debouncedSearchTerm = useDebounce(searchTerm, 500)
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
    dispatch(getAllTemplates({ params: {} }))
    dispatch(getAllRules({params: {search: debouncedSearchTerm, channel: channel || undefined, page, limit: 6}}))
  }, [dispatch, debouncedSearchTerm, channel, page])

  const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
    setModalConfig({...config, isOpen: true})
  }

  const closeModal = () => {
    setModalConfig(prev => ({...prev, isOpen: false}))
  }

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

  const handleDeleteRule = (rule: NotificationRule) => {
    openModal({
      title: 'Delete Notification Rule',
      message: `Are you sure you want to delete this Notification rule?`,
      type: 'danger',
        onConfirm: async() => {
          try {
            await dispatch(deleteNotificationRule({id: rule.id})).unwrap()
            toast.success('Notification rule deleted successfully')
            closeModal()
            await dispatch(getAllRules({params: {search: debouncedSearchTerm, channel: channel || undefined, page, limit: 6}}))
          } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to delete notification rule')
          }
        }
    })
  }

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
      await dispatch(getAllRules({params: {search: debouncedSearchTerm, channel: channel || undefined, page, limit: 6}}))
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
                      <Button
                        sx={{backgroundColor: '#6d0505'}}
                        variant="contained"
                        size="small"
                        onClick={() => handleDeleteRule(rule)}
                      >
                        Delete
                      </Button>
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

      <Box display="flex" justifyContent="center" mt={3}>
        <Pagination count={pagination.rules.totalPages} page={page} onChange={(_, v) => setPage(v)} />
      </Box>
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