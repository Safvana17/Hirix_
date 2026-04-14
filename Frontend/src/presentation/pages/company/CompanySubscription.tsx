import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { Box, Card, Pagination, Stack, Tooltip, Typography } from '@mui/material'
import { Check, Close } from '@mui/icons-material'
import { getAllPlans } from '../../../redux/slices/features/subscription/subscriptionSlice'


const COMPANY_FEATURES = [
  { key: "canUseAdminQuestions", label: "Use admin questions", type: "boolean" },
  { key: "canCreateCustomQuestions", label: "Create custom questions", type: "boolean" },
  { key: "maxTestsPerMonth", label: (v: number | null) => v ? `Up to ${v} tests/month` : "Unlimited tests", type: "limit" },
  { key: "maxCandidates", label: (v: number | null) => v ? `Up to ${v} candidates` : "Unlimited candidates", type: "limit" },
  { key: "maxJobRolesPerMonth", label: (v: number | null) => v ? `${v} job roles/month` : "Unlimited job roles", type: "limit" },
  { key: "maxInterviewPerMonth", label: (v: number | null) => v ? `${v} interviews/month` : "Unlimited interviews", type: "limit" },
]
const CompanySubscription: React.FC= () => {

  const [page, setPage] = useState(1)
  const {plans, pagination} = useSelector((state: RootState) => state.subscription)
  const dispatch = useDispatch<AppDispatch>()

  useEffect(() => {
    dispatch(getAllPlans({target: 'company', page, limit: 6 }))
  }, [page, dispatch])
  console.log('plans from company: ', plans)
  
 const getFeaturesByTarget = () => {
   return COMPANY_FEATURES
  }
  return (
    <InternalLayout title='Subscription' subTitle='Manage you subscriptions and billings' sidebarItems={companySidebarItems}>
        <div>
          <div className='bg-white rounded-xl px-3 shadow-lg'>

          </div>
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
                      {getFeaturesByTarget().map((feature) => {
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

                    <Box display="flex" gap={1} mt={2}>
                      <Tooltip title='Edit plan'>
                      <button>
                      </button>
                      </Tooltip>
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

    </InternalLayout>
  )
}

export default CompanySubscription
