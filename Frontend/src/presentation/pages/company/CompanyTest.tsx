import React, { useEffect, useState } from "react"
import InternalLayout from "../../layouts/InternalLayout"
import { companySidebarItems } from "../../../constants/sidebarItems"
import { CalendarClock, Edit2, Edit2Icon, Eye, Plus, Trash2, XCircle } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../redux/store"
import { getAllTests } from "../../../redux/slices/features/test/companyTestSlice"
import { useDebounce } from "../../../hooks/useDebounce"
import type { CompanyTestList, TestStatus } from "../../../types/test"
import DataTable from "../../components/ui/DataTable"
import type { Column } from "../../../types/table"

import {
  Box,
  Button,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
  InputAdornment,
} from "@mui/material"

import { Search, Filter } from "lucide-react"

const testStatuses: TestStatus[] = ["DRAFT", "ACTIVE", "COMPLETED", "CANCELLED"]

const CompanyTest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TestStatus | "">("")
  const [currentPage, setCurrentPage] = useState(1)

  const { testList, pagination, loading } = useSelector(
    (state: RootState) => state.companyTest
  )

  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()

  const debouncedSearchTerm = useDebounce(searchTerm, 500)

  useEffect(() => {
    dispatch(
      getAllTests({
        params: {
          search: debouncedSearchTerm || undefined,
          status: statusFilter || undefined,
          page: currentPage,
          limit: 10,
        },
      })
    )
  }, [dispatch, debouncedSearchTerm, statusFilter, currentPage])

  const handleCreateTest = () => {
    navigate("/company/test/create")
  }

  const getStatusColor = (status: TestStatus) => {
    switch (status) {
      case "ACTIVE":
        return "success"
      case "DRAFT":
        return "warning"
      case "COMPLETED":
        return "info"
      case "CANCELLED":
        return "error"
      default:
        return "default"
    }
  }

  const columns: Column<CompanyTestList>[] = [
    { header: "Name",key: "name",render: (val) => (
        <Typography fontWeight={700} color="text.primary">
          {val.toString()}
        </Typography>
    )},
    { header: "Job Role", key: "jobRole", render: (val) => (
        <Typography fontWeight={600} color="text.secondary">
          {val}
        </Typography>
    )},
    { header: "Invited Candidates", key: "candidatesCount", render: (val) => (
        <Typography fontWeight={600} color="text.secondary">
          {val}
        </Typography>
    )},
    { header: "Duration", key: "durationInMinutes", render: (val) => (
          <Typography fontSize={13} fontWeight={700}>
            {val} Minutes
          </Typography>
    )},
    {
      header: "Status",
      key: "testStatus",
      render: (val) => (
        <Chip
          label={val}
          color={getStatusColor(val as TestStatus)}
          size="small"
          sx={{
            fontWeight: 700,
            borderRadius: "10px",
          }}
        />
      ),
    },
    {
      header: "Actions",
      key: "id",
      render: (_, row) => (
        <Box display="flex" alignItems="center" gap={1}>
          <Button
            size="small"
            color="success"
            onClick={() => navigate(`/company/test/${row.id}`)}
          >
            <Eye size={16} />
          </Button>
          <Button
            size="small"
            color="primary"
            onClick={() => navigate(`/company/test/${row.id}`)}
          >
            <Edit2Icon size={16} />
          </Button>

          <Button
            size="small"
            color="warning"
            onClick={() => navigate(`/company/test/${row.id}/reschedule`)}
          >
            <CalendarClock size={16} />
          </Button>

          <Button
            size="small"
            color="secondary"
            // onClick={() => handleCancelTest(row.id)}
          >
            <XCircle size={16} />
          </Button>

          <Button
            size="small"
            color="error"
            // onClick={() => handleDeleteTest(row.id)}
          >
            <Trash2 size={16} />
          </Button>
        </Box>
      ),
    }
  ]

  return (
    <InternalLayout
      title="Test"
      subTitle="Manage your tests and candidate assessments"
      sidebarItems={companySidebarItems}
    >
      <Box>
        <Box display="flex" justifyContent="flex-end" mb={3}>
          <Button
            variant="contained"
            startIcon={<Plus size={18} />}
            onClick={handleCreateTest}
            sx={{
              backgroundColor: "#795003",
              borderRadius: "14px",
              fontWeight: 700,
              px: 3,
              py: 1.3,
              textTransform: "none",
              "&:hover": {
                backgroundColor: "#5f3d02",
              },
            }}
          >
            Create Test
          </Button>
        </Box>

        <Paper
          elevation={0}
          sx={{
            p: 3,
            borderRadius: 4,
            border: "1px solid #eee",
            mb: 3,
          }}
        >
          <Box
            display="flex"
            flexDirection={{ xs: "column", md: "row" }}
            gap={2}
            justifyContent="space-between"
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              fullWidth
              placeholder="Search tests by name..."
              value={searchTerm}
              onChange={(e) => {
                setSearchTerm(e.target.value)
                setCurrentPage(1)
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <Search size={18} />
                  </InputAdornment>
                ),
              }}
              sx={{
                maxWidth: { md: 520 },
                "& .MuiOutlinedInput-root": {
                  borderRadius: "16px",
                  backgroundColor: "#9A6605",
                  color: "#fff",
                  "& fieldset": {
                    border: "none",
                  },
                  "& input::placeholder": {
                    color: "#fff",
                    opacity: 0.9,
                  },
                  "& svg": {
                    color: "#fff",
                  },
                },
              }}
            />

            <FormControl sx={{ minWidth: 220 }}>
              <InputLabel>Status</InputLabel>
              <Select
                value={statusFilter}
                label="Status"
                onChange={(e) => {
                  setStatusFilter(e.target.value as TestStatus | "")
                  setCurrentPage(1)
                }}
                startAdornment={
                  <InputAdornment position="start">
                    <Filter size={16} />
                  </InputAdornment>
                }
                sx={{
                  borderRadius: "16px",
                  color: "#795003",
                  fontWeight: 600,
                  "& .MuiOutlinedInput-notchedOutline": {
                    borderColor: "#795003",
                  },
                }}
              >
                <MenuItem value="">All Status</MenuItem>

                {testStatuses.map((status) => (
                  <MenuItem key={status} value={status}>
                    {status}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </Paper>

        <DataTable
          columns={columns}
          isLoading={loading}
          data={testList}
          emptyMessage="No tests found matching your criteria"
          pagination={{
            currentPage,
            totalPages: pagination.test.totalPages,
            totalCount: pagination.test.totalCount,
            onPageChange: (page) => setCurrentPage(page),
          }}
        />
      </Box>
    </InternalLayout>
  )
}

export default CompanyTest