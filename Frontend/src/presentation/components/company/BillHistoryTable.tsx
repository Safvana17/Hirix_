// import React, { useEffect, useState } from "react";
// import { DataGrid } from "@mui/x-data-grid";
// import type { GridColDef, GridPaginationModel } from "@mui/x-data-grid";
// import Paper from "@mui/material/Paper";
// import { useDispatch } from "react-redux";
// import type { AppDispatch } from "../../../redux/store";
// import { getBillingHistory } from "../../../redux/slices/features/subscription/subscriptionSlice";

// /* =========================
//    TYPES
// ========================= */

// type PaymentStatus = "SUCCESS" | "FAILED" | "PENDING";

// interface Payment {
//   id: string;
//   orderId: string;
//   paymentId: string;
//   amount: number;
//   status: PaymentStatus;
//   createdAt: string;
//   description?: string;
// }

// interface BillingResponse {
//   payments: Payment[];
//   totalCount: number;
//   totalPages: number;
// }

// interface BillingRow {
//   id: string;
//   orderId: string;
//   paymentId: string;
//   amount: number;
//   status: PaymentStatus;
//   createdAt: string;
//   description: string;
// }

// /* =========================
//    COLUMNS
// ========================= */

// const paymentColumns: GridColDef<BillingRow>[] = [
//   {
//     field: "orderId",
//     headerName: "Order ID",
//     width: 180,
//   },
//   {
//     field: "paymentId",
//     headerName: "Payment ID",
//     width: 180,
//   },
//   {
//     field: "amount",
//     headerName: "Amount",
//     width: 120,
//     valueFormatter: (params) => `₹${params.value}`,
//   },
//   {
//     field: "status",
//     headerName: "Status",
//     width: 130,
//     renderCell: (params) => {
//       const color =
//         params.value === "SUCCESS"
//           ? "green"
//           : params.value === "FAILED"
//           ? "red"
//           : "orange";

//       return (
//         <span style={{ color, fontWeight: 600 }}>
//           {params.value}
//         </span>
//       );
//     },
//   },
//   {
//     field: "createdAt",
//     headerName: "Date",
//     width: 180,
//     valueGetter: (params) =>
//       new Date(params.value as string).toLocaleDateString(),
//   },
//   {
//     field: "description",
//     headerName: "Description",
//     width: 220,
//   },
// ];

// /* =========================
//    COMPONENT
// ========================= */

// const BillingTable: React.FC = () => {
//   const dispatch = useDispatch<AppDispatch>();

//   const [rows, setRows] = useState<BillingRow[]>([]);
//   const [rowCount, setRowCount] = useState<number>(0);

//   const [paginationModel, setPaginationModel] =
//     useState<GridPaginationModel>({
//       page: 0,
//       pageSize: 5,
//     });

//   const fetchData = async () => {
//     try {
//       const res: BillingResponse = await dispatch(
//         getBillingHistory({
//           page: paginationModel.page + 1, // backend is 1-based
//           limit: paginationModel.pageSize,
//         })
//       ).unwrap();

//       const mappedRows: BillingRow[] = res.payments.map((p) => ({
//         id: p.id,
//         orderId: p.orderId,
//         paymentId: p.paymentId,
//         amount: p.amount,
//         status: p.status,
//         createdAt: p.createdAt,
//         description: p.description ?? "-",
//       }));

//       setRows(mappedRows);
//       setRowCount(res.totalCount);
//     } catch (error) {
//       console.error("Billing fetch failed:", error);
//     }
//   };

//   useEffect(() => {
//     fetchData();
//   }, [paginationModel]);

//   return (
//     <Paper sx={{ height: 500, width: "100%" }}>
//       <DataGrid
//         rows={rows}
//         columns={paymentColumns}
//         paginationMode="server"
//         rowCount={rowCount}
//         pageSizeOptions={[5, 10, 20]}
//         paginationModel={paginationModel}
//         onPaginationModelChange={setPaginationModel}
//         disableRowSelectionOnClick
//         sx={{ border: 0 }}
//       />
//     </Paper>
//   );
// };

// export default BillingTable;