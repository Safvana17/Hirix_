// import React from "react";
// import {
//   Box,
//   Button,
//   Card,
//   TextField,
//   Typography,
//   Divider,
// } from "@mui/material";
// import { useLocation, useNavigate } from "react-router-dom";
// import toast from "react-hot-toast";

// const CompanyPayment: React.FC = () => {
//   const { state } = useLocation();
//   const navigate = useNavigate();

//   const { planName, amount } = state || {};

//   const handlePayment = async () => {
//     try {
//       // simulate success
//       toast.success("Payment successful");

//       // TODO: call backend confirm API

//       navigate("/company/subscription");
//     } catch (err) {
//       toast.error(typeof err === 'string' ? err :"Payment failed");
//     }
//   };

//   return (
//     <Box
//       display="grid"
//       gridTemplateColumns={{ xs: "1fr", md: "1fr 1fr" }}
//       minHeight="100vh"
//     >
//       {/* LEFT SIDE (SUMMARY) */}
//  <Box
//   sx={{
//     backgroundColor: "#0f172a",
//     color: "#fff",
//     p: 5,
//     display: "flex",
//     flexDirection: "column",
//     justifyContent: "center",
//   }}
// >
//   <Typography variant="h6" gutterBottom color="gray">
//     Subscription Summary
//   </Typography>

//   <Typography variant="h4" fontWeight="bold">
//     {planName}
//   </Typography>

//   <Typography mt={1} fontSize={14} color="gray">
//     Billed monthly
//   </Typography>

//   <Divider sx={{ my: 3, borderColor: "#333" }} />

//   {/* FEATURES */}
//   <Box display="flex" flexDirection="column" gap={1}>
//     <Typography variant="body2">✔ Premium features access</Typography>
//     <Typography variant="body2">✔ Priority support</Typography>
//     <Typography variant="body2">✔ Advanced analytics</Typography>
//   </Box>

//   <Divider sx={{ my: 3, borderColor: "#333" }} />

//   {/* BILLING BREAKDOWN */}
//   <Box display="flex" justifyContent="space-between">
//     <Typography color="gray">Subtotal</Typography>
//     <Typography>₹{amount}</Typography>
//   </Box>

//   <Box display="flex" justifyContent="space-between" mt={1}>
//     <Typography color="gray">Tax</Typography>
//     <Typography>₹0</Typography>
//   </Box>

//   <Divider sx={{ my: 2, borderColor: "#333" }} />

//   <Box display="flex" justifyContent="space-between">
//     <Typography fontWeight="bold">Total</Typography>
//     <Typography fontWeight="bold" fontSize={18}>
//       ₹{amount}
//     </Typography>
//   </Box>

//   <Typography mt={2} fontSize={12} color="gray">
//     Secure payment powered by Razorpay
//   </Typography>
// </Box>

//       {/* RIGHT SIDE (FORM) */}
//       <Box
//         display="flex"
//         justifyContent="center"
//         alignItems="center"
//         p={3}
//       >
// <Card sx={{ p: 4, width: "100%", maxWidth: 420 }}>
//   <Typography variant="h6">Complete Payment</Typography>

//   <Typography variant="body2" mt={2} color="text.secondary">
//     Click below to securely complete your payment using Razorpay.
//   </Typography>

//   <Button
//     fullWidth
//     variant="contained"
//     sx={{
//       mt: 3,
//       backgroundColor: "#6B4705",
//       borderRadius: 2,
//       textTransform: "none",
//       fontWeight: "bold",
//     }}
//     onClick={handlePayment}
//   >
//     Pay ₹{amount}
//   </Button>

//   <Button
//     fullWidth
//     sx={{ mt: 1 }}
//     onClick={() => navigate("/company/subscription")}
//   >
//     Cancel
//   </Button>
// </Card>
//       </Box>
//     </Box>
//   );
// };

// export default CompanyPayment;