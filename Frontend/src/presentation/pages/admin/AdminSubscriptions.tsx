import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import { Edit2Icon, Plus } from 'lucide-react'
import type { PlanPayload, ModalMode, TargetType, SubscriptionPlan } from '../../../types/subscription'
import SubscriptionPlanModal from '../../components/modal/SubscriptionPlanModal'
import toast from 'react-hot-toast'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { createPlan, editPlan, getAllPlans, updateStatus } from '../../../redux/slices/features/subscription/subscription'
import { Box, Card, Divider, Pagination, Stack, Tab, Tabs, Typography } from '@mui/material'
import { Cancel, Check, CheckCircle } from '@mui/icons-material'
import Close from '@mui/icons-material/Close'
import ConfirmationModal from '../../components/modal/ConfirmationModal'

const targetType: TargetType[] = ['company', 'candidate']

const COMPANY_FEATURES = [
  { key: "canUseAdminQuestions", label: "Use admin questions", type: "boolean" },
  { key: "canCreateCustomQuestions", label: "Create custom questions", type: "boolean" },
  { key: "maxTestsPerMonth", label: (v: number | null) => v ? `Up to ${v} tests/month` : "Unlimited tests", type: "limit" },
  { key: "maxCandidates", label: (v: number | null) => v ? `Up to ${v} candidates` : "Unlimited candidates", type: "limit" },
  { key: "maxJobRolesPerMonth", label: (v: number | null) => v ? `${v} job roles/month` : "Unlimited job roles", type: "limit" },
  { key: "maxInterviewPerMonth", label: (v: number | null) => v ? `${v} interviews/month` : "Unlimited interviews", type: "limit" },
]

const CANDIDATE_FEATURES = [
  { key: "canAccessPremiumQuestions", label: "Access premium questions", type: "boolean" },
  { key: "hasDetailedFeedback", label: "Detailed feedback", type: "boolean" },
  { key: "maxPracticePerDay", label: (v: number | null) => v ? `${v} practices/day` : "Unlimited practice", type: "limit" },
]

const AdminSubscriptions: React.FC = () => {

  const [modalMode, setModalMode] = useState<ModalMode>('create')
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedPlan, setSelectedPlan] = useState<PlanPayload | null>(null)
  const [target, setTarget] = useState<TargetType | ''>('')
  const [page, setPage] = useState(1)
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

  const dispatch = useDispatch<AppDispatch>()
  const { plans, pagination } = useSelector((state: RootState) => state.subscription)

  useEffect(() => {
    dispatch(getAllPlans({ target: target || undefined, page, limit: 6 }))
  }, [target, page, dispatch])

  const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
    setModalConfig({...config, isOpen: true})
  }

  const closeModal = () => {
    setModalConfig(prev => ({...prev, isOpen: false}))
  }

  const getFeaturesByTarget = (target: TargetType) => {
    if (target === "company") return COMPANY_FEATURES
    if (target === "candidate") return CANDIDATE_FEATURES
    return []
  }

  const handleAddPlan = () => {
    setSelectedPlan(null)
    setModalMode('create')
    setIsModalOpen(true)
  }

  const handleEditPlan = (item: PlanPayload) => {
    setSelectedPlan(item)
    setModalMode('edit')
    setIsModalOpen(true)
  }

  console.log('plans: ', plans)

  const handleSubmit = async (data: PlanPayload) => {
    try {
      if (modalMode === 'create') {
        await dispatch(createPlan({ data })).unwrap()
        toast.success('Plan created successfully')
        setIsModalOpen(false)
        await dispatch(getAllPlans({target: target || undefined, page, limit: 6}))
      }else if(modalMode === 'edit'){
        await dispatch(editPlan({data})).unwrap()
        toast.success('Plan edited successfully')
        setIsModalOpen(false)
        await dispatch(getAllPlans({target: target || undefined, page, limit: 6}))
      }
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to perform operation')
    }
  }

  const handleUpdateStatus = (plan: SubscriptionPlan) => {
    const planId = plan.id
    const newStatus = plan.isActive ? 'deactivate' : 'activate'
    const actionText = newStatus === 'deactivate' ? 'Deactivate' : 'Activate'

    openModal({
      title: `${actionText} Subscription Plan`,
      message: `Are you sure you want to ${actionText.toLowerCase()} this subscription plan? This will ${newStatus === 'deactivate' ? 'prevent users from accessing' : 'restore their access to'} the platform.`,
      type: newStatus === 'deactivate' ? 'danger' : 'warning',
      onConfirm: async() => {
        try {
          await dispatch(updateStatus({id: planId, status: newStatus})).unwrap();
          closeModal();
          toast.success('Plan status updated successfully')
        } catch (error) {
          toast.error(typeof error === 'string' ? error : 'Failedto update plan status')
        }
      }
    })
  }

  return (
    <InternalLayout
      title='Subscription'
      subTitle='Manage subscription plans and features'
      sidebarItems={adminSidebarItems}
    >
      <div>
        <div className='flex justify-end mb-5'>
          <button
            onClick={handleAddPlan}
            className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'
          >
            <Plus className='w-4 h-4' />
            Create Plan
          </button>
        </div>

        <div className='bg-white rounded-xl p-3 shadow-md'>

          <Tabs
            value={target}
            onChange={(_, v) => {
              setTarget(v)
              setPage(1)
            }}
            sx={{
              mb: 2,
              "& .MuiTabs-indicator": { display: "none" }
            }}
          >
            <Tab
              label="ALL"
              value=''
              sx={{
                textTransform: "none",
                borderRadius: 2,
                minHeight: 36,
                backgroundColor: target === "" ? "#6B4705" : "transparent",
                "&.Mui-selected": {
                  color: target === "" ? "#fff" : "#333"
                }
              }}
            />
            {targetType.map((t) => (
              <Tab
                key={t}
                label={t.toUpperCase()}
                value={t}
                sx={{
                  textTransform: "none",
                  borderRadius: 2,
                  minHeight: 36,
                  backgroundColor: target === t ? "#6B4705" : 'transparent',
                  "&.Mui-selected": {
                    color: target === t ? "#fff" : '#333'
                  }
                }}
              />
            ))}
          </Tabs>

          <Divider sx={{ borderColor: "#6B4705" }} />

          {plans.length > 0 ? (
            <>
              <Box
                display="grid"
                gridTemplateColumns="repeat(auto-fill, minmax(260px, 1fr))"
                gap={2}
                mt={2}
              >
                {plans.map((p) => (
                  <Card
                    key={p.id}
                    sx={{
                      p: 2,
                      borderRadius: 3,
                      backgroundColor: "#fff",
                      border: "1px solid #e0e0e0",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      minHeight: 260
                    }}
                  >
                    <Box display="flex" justifyContent="space-between" alignItems="center">
                      <Box
                        sx={{
                          fontSize: 10,
                          px: 1.2,
                          py: 0.3,
                          borderRadius: "20px",
                          backgroundColor: p.isActive ? '#91f580' : '#f66b6b',
                          color: "#fff"
                        }}
                      >
                        {p.isActive ? 'Active' : 'Deactivated'}
                      </Box>
                      <Typography fontWeight="bold">{p.planName}</Typography>

                      <Box
                        sx={{
                          fontSize: 11,
                          px: 1.2,
                          py: 0.3,
                          borderRadius: "20px",
                          backgroundColor: p.target === 'company' ?  "#6B4705" : '#0B3358',
                          color: "#fff",
                          textTransform: "capitalize"
                        }}
                      >
                        {p.target}
                      </Box>
                    </Box>

                    <Box mt={1}>
                      <Typography variant="h5" fontWeight="bold">
                        ₹{p.price}
                        <Typography component="span" variant="body2">
                          {" "} / {p.billingCycle}
                        </Typography>
                      </Typography>

                      <Typography variant="caption" color="text.secondary">
                        {p.durationDays} days
                      </Typography>
                    </Box>

                    <Stack spacing={0.5} mt={1}>
                      {getFeaturesByTarget(p.target).map((feature) => {
                        const value = p[feature.key as keyof typeof p]

                        if (feature.type === "boolean" && value) {
                          return (
                            <Typography key={feature.key} variant="body2">
                              <Check sx={{color: 'green'}} /> 
                              {typeof feature.label === "string" ? feature.label : ""}
                            </Typography>
                          )
                        }

                        if (feature.type === "limit") {
                          return (
                            <Typography key={feature.key} variant="body2">
                              <Check sx={{color: 'green'}} /> 
                               {typeof feature.label === "function"
                                ? feature.label(value as number | null)
                                : feature.label}
                            </Typography>
                          )
                        }

                        if (feature.type === "boolean" && !value) {
                          return (
                            <Typography key={feature.key} variant="body2">
                              <Close sx={{color: 'red'}} />
                              {typeof feature.label === "string" ? feature.label : ""}
                            </Typography>
                          )
                        }

                        return null
                      })}
                    </Stack>

                    <Box display="flex" justifyContent="space-between" mt={2}>
                      <button 
                        onClick={() => handleEditPlan(p)}
                        className="flex items-center gap-2 bg-[#0B3358] text-white px-3 py-1 rounded-lg text-sm"
                      >
                        <Edit2Icon className='w-3 h-3'/> Edit
                      </button>

                      <button 
                        onClick={() => handleUpdateStatus(p)}
                        className={`flex items-center gap-1 text-white px-3 py-1 rounded-lg text-sm ${p.isActive ? 'bg-[#840321]' : 'bg-[#014C0E]'}`}>
                        {p.isActive ? (
                            <>
                              <Cancel fontSize='small' />
                                Deactivate
                            </>
                          ):(
                            <>
                              <CheckCircle fontSize='small' />
                               Activate
                            </>
                          )}
                      </button>
                    </Box>
                  </Card>
                ))}
              </Box>

              <Box display="flex" justifyContent="center" mt={3}>
                <Pagination
                  count={pagination.plans.totalPages || 1}
                  page={page}
                  onChange={(_, v) => setPage(v)}
                  color="primary"
                />
              </Box>

              <Typography textAlign="center" mt={1} variant="caption">
                Page {page} of {pagination.plans.totalPages || 1}
              </Typography>
            </>
          ) : (
            <Box display='flex' justifyContent='center' py={10}>
              <Typography variant='h6'>
                No subscription plans available
              </Typography>
            </Box>
          )}
        </div>

        <SubscriptionPlanModal
          key={selectedPlan?.id || modalMode}
          isOpen={isModalOpen}
          mode={modalMode}
          initialData={selectedPlan}
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
      </div>
    </InternalLayout>
  )
}

export default AdminSubscriptions