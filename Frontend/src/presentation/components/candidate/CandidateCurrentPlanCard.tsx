import React from 'react'
import { Box, Button, LinearProgress, Typography } from '@mui/material'
import type { CurrentPlan } from '../../../types/subscription'
// import ConfirmationModal from '../modal/ConfirmationModal'
// import { useDispatch } from 'react-redux'
// import type { AppDispatch } from '../../../redux/store'
// import { cancelSubscription } from '../../../redux/slices/features/subscription/subscriptionSlice'
// import toast from 'react-hot-toast'

interface CurrentPlanCardProps {
    currentPlan: CurrentPlan | null
}

const CandidateCurrentPlanCard: React.FC<CurrentPlanCardProps>= ({currentPlan}) => {
//   const dispatch = useDispatch<AppDispatch>()
//     const [modalConfig, setModalConfig] = useState<{
//         isOpen: boolean;
//         title: string;
//         message: string;
//         onConfirm: () => void;
//         type: 'danger' | 'warning' | 'info';
//     }>({
//         isOpen: false,
//         title: '',
//         message: '',
//         onConfirm: () => { },
//         type: 'warning'
//     })

  const getProgress = (used: number, limit: number | null) => {
    if (!limit) return 10 
    return Math.min((used / limit) * 100, 100)
  }

    // const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
    //     setModalConfig({...config, isOpen: true})
    // }

    // const closeModal = () => {
    //     setModalConfig(prev => ({...prev, isOpen: false}))
    // }


//   const handleCancelSubscription = (id: string) => {
//         openModal({
//             title: `Cancel Subscription`,
//             message: `Are you sure you wants to cancel your current subscription? You will be moved into free plan`,
//             type: 'danger',
//             onConfirm: async() => {
//                 try {   
//                   await dispatch(cancelSubscription({id})).unwrap()
//                   toast.success('Your subscription cancelled successfully')
//                   closeModal();
//                 } catch (error) {
//                   toast.error(typeof error === 'string' ? error : 'Failed to cancel subscription')
//                 }
//             }
//         })
//   }
  
  return (
    <div>
      <Box
        sx={{
          backgroundColor: "#fff",
          borderRadius: 3,
          p: 3,
          boxShadow: "0 4px 20px rgba(0,0,0,0.08)"
        }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="subtitle2" color="text.secondary">
            Current Plan
          </Typography>
          <Box
            sx={{
              px: 2,
              py: 0.5,
              borderRadius: "20px",
              backgroundColor: currentPlan?.status === "active" ? "#16694c" : "#999",
              color: "#fff",
              fontSize: 12
            }}
          >
            {currentPlan?.status}
          </Box>
        </Box>
        <Box mt={1}>
          <Typography variant="h5" fontWeight="bold">
            {currentPlan?.planName}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            ₹ {currentPlan?.price} / {currentPlan?.billingCycle}
          </Typography>
        </Box>
        <Box mt={1}>
          {currentPlan?.endDate && (
            <>
              <Typography variant="caption" color="text.secondary">
                Next billing date
              </Typography>
              <Typography variant="body2" fontWeight="bold">
                {new Date(currentPlan?.endDate).toLocaleDateString()}
              </Typography>
            </>
          )}
        </Box>
        {/* <Box mt={2}>
          <Typography variant="caption">Candidates this month</Typography>
            <LinearProgress
              variant="determinate"
              value={getProgress(4, currentPlan?.maxCandidates ?? null)}
              sx={{
                height: 6,
                borderRadius: 5,
                backgroundColor: "#eee",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#6B4705"
                }
              }}
            />
            <Typography variant="caption">
              {4} / {currentPlan?.maxCandidates ?? "unlimited"}
            </Typography>
        </Box> */}
        <Box mt={2}>
          <Typography variant="caption">Practice per day</Typography>
            <LinearProgress
              variant="determinate"
              value={getProgress(1, currentPlan?.maxPracticePerDay ?? null)}
              sx={{
                height: 6,
                borderRadius: 5,
                backgroundColor: "#eee",
                "& .MuiLinearProgress-bar": {
                  backgroundColor: "#6B4705"
                }
              }}
            />
          <Typography variant="caption">
            {1} / {currentPlan?.maxPracticePerDay ?? "unlimited"}
          </Typography>
        </Box> 
        <Box mt={3} display="flex" gap={2}>
          {/* <Button
              onClick={handleChangePlan}
              variant="contained"
              sx={{
                backgroundColor: "#0B3358",
                borderRadius: 5,
                textTransform: "none"
              }}
            >
              Change Plan
            </Button> */}
            {currentPlan?.price !== 0 &&(
              <Button
                // onClick={() => currentPlan && handleCancelSubscription(currentPlan.subscriptionId)}
                variant="contained"
                sx={{
                  backgroundColor: "#740303",
                  borderRadius: 5,
                  textTransform: "none"
                }}
              >
                Cancel Subscription
              </Button>
            )}
            </Box>
          </Box>
          {/* <ConfirmationModal 
            isOpen={modalConfig.isOpen}
            onClose={closeModal}
            onConfirm={modalConfig.onConfirm}
            title={modalConfig.title}
            message={modalConfig.message}
            type={modalConfig.type}
          /> */}
    </div>
  )
}

export default CandidateCurrentPlanCard
