import React from "react";
import { Box, Button, Card, Typography, Divider } from "@mui/material";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { Check } from "@mui/icons-material";
import HirixLogo from '../../../assets/images/Logo.jpeg'
import { confirmPayment, makePayment, markFailure } from "../../../redux/slices/features/subscription/subscriptionSlice";


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

const PaymentPage: React.FC = () => {
  const navigate = useNavigate();
  const { selectedPlan } = useSelector((state: RootState) => state.subscription)
  const { user } = useSelector((state: RootState) => state.auth)
  const dispatch = useDispatch<AppDispatch>()


  const getFeatures = () => {
    if (selectedPlan?.target === "company") return COMPANY_FEATURES
    if (selectedPlan?.target === "candidate") return CANDIDATE_FEATURES
    return []
  }
  const handlePayment = async (planId: string) => {
    try {
      if(!planId || !user) return
      const order = await dispatch(makePayment({planId, role: user.role })).unwrap()

      const options = {
        key: import.meta.env.VITE_RAZORPAY_KEY,
        amount: order.amount,
        currency: order.currency,
        name: 'Hirix',
        description: selectedPlan?.planName,
        order_id: order.orderId,

        handler: async (response: {
          razorpay_order_id: string
          razorpay_payment_id: string
          razorpay_signature: string
          planId: string
        }) => {
          try {
            if(!selectedPlan) {
              console.log('not selected plan')
              return
            }
            await dispatch(confirmPayment({
              data:{
                orderId: response.razorpay_order_id,
                paymentId: response.razorpay_payment_id,
                signature: response.razorpay_signature,
                planId: selectedPlan.id
              }, 
              role: user.role
            })).unwrap()
            toast.success('Payment confirmation success')
            navigate("/payment-status?status=success", {state: user.role})
          } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Payment verification failed')
          }
        },
        theme: {
          color: "#6B4705"
        }
      }
      const rzp = new window.Razorpay(options)
      rzp.on('payment.failed', async(response) => {
        const orderId = response.error?.metadata?.order_id
        if(orderId){
          await dispatch(markFailure({orderId})).unwrap()
          toast.error('Payment failed')
          navigate("/payment-status?status=failed")
        }
      })
      rzp.open()
    } catch (err) {
      toast.error(typeof err === 'string' ? err :"Payment failed");
    }
  };

  return (
    <Box
      display="grid"
      gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
      minHeight="100vh"
    >
      <Box
        sx={{
          backgroundColor: "#0f172a",
          color: "#fff",
          p: 5,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
        }}
      >
        <Typography variant="h5" gutterBottom color="gray">
          Subscription Summary
        </Typography>

        <Typography variant="h4" fontWeight="bold">
          {selectedPlan?.planName}
        </Typography>

        <Typography mt={1} fontSize={14} color="gray">
          Billed {selectedPlan?.billingCycle}
        </Typography>

        <Divider sx={{ my: 3, borderColor: "#333" }} />

        <Box display="flex" flexDirection="column" gap={1}>
          {getFeatures().map((feature) => {
            const value = selectedPlan?.[feature.key as keyof typeof selectedPlan]
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
            return null
          })}
        </Box>

        <Divider sx={{ my: 3, borderColor: "#333" }} />
        <Box display="flex" justifyContent="space-between">
          <Typography color="gray">Subtotal</Typography>
          <Typography>₹{selectedPlan?.price}</Typography>
        </Box>
        <Divider sx={{ my: 2, borderColor: "#333" }} />
        <Box display="flex" justifyContent="space-between">
          <Typography fontWeight="bold">Total</Typography>
          <Typography fontWeight="bold" fontSize={18}>
            ₹{selectedPlan?.price}
          </Typography>
        </Box>
        <Typography mt={2} fontSize={12} color="gray">
          Secure payment powered by Razorpay
        </Typography>
      </Box>

      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        p={3}
      >
        <Box
          display='flex'
          flexDirection='column'
          alignItems='center'
          gap={2}
          width="100%"
          maxWidth={420}
        >
          <Box display='flex' alignItems='center' gap={1} mb={5}>
            <img
              src={HirixLogo}
              alt="hirix_logo"
              className="w-12 h-12 rounded-md"
            />
            <Typography fontSize={28} fontWeight='bold'>
              HiriX
            </Typography>
          </Box>
          <Card sx={{ p: 4, width: "100%", maxWidth: 420 }}>
            <Typography variant="h6">Complete Payment</Typography>
            <Typography variant="body2" mt={2} color="text.secondary">
              Click below to securely complete your payment using Razorpay.
            </Typography>
            <Button
              fullWidth
              variant="contained"
              sx={{
                mt: 3,
                backgroundColor: "#6B4705",
                borderRadius: 2,
                textTransform: "none",
                fontWeight: "bold",
              }}
              onClick={() => selectedPlan && handlePayment(selectedPlan.id)}
            >
              Confirm Payment
            </Button>
            <Button
              fullWidth
              sx={{ mt: 1 }}
              onClick={() => navigate(-1)}
            >
              Cancel
            </Button>
          </Card>
        </Box>
      </Box>
    </Box>
  );
};

export default PaymentPage;