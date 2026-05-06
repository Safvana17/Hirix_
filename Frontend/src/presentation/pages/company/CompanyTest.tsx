import React, { useEffect, useState } from "react"
import InternalLayout from "../../layouts/InternalLayout"
import { companySidebarItems } from "../../../constants/sidebarItems"
import {
  CalendarClock,
  Edit2Icon,
  Eye,
  Plus,
  Send,
  Trash2,
  XCircle,
} from "lucide-react"
import { useNavigate } from "react-router-dom"
import { useDispatch, useSelector } from "react-redux"
import type { AppDispatch, RootState } from "../../../redux/store"
import { deleteTest, getAllTests, publishTest } from "../../../redux/slices/features/test/companyTestSlice"
import { useDebounce } from "../../../hooks/useDebounce"
import type { CompanyTestList, TestStatus } from "../../../types/test"
import DataTable from "../../components/ui/DataTable"
import type { Column } from "../../../types/table"
import {
  Box,
  Button,
  Chip,
  FormControl,
  InputAdornment,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material"
import { Search, Filter } from "lucide-react"
import toast from "react-hot-toast"
import ConfirmationModal from "../../components/modal/ConfirmationModal"

const testStatuses: TestStatus[] = ["DRAFT", "PUBLISHED", "COMPLETED", "CANCELLED"]

const statusColorMap: Record<
  TestStatus,
  "success" | "warning" | "info" | "error"
> = {
  PUBLISHED: "success",
  DRAFT: "warning",
  COMPLETED: "info",
  CANCELLED: "error",
  DELETED: "error"
}

type TestAction = {
  label: string
  icon: React.ElementType
  color: "success" | "primary" | "warning" | "secondary" | "error"
  onClick: () => void
}
export type ModalMode = 'create' | 'edit'

const CompanyTest: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState("")
  const [statusFilter, setStatusFilter] = useState<TestStatus | "">("")
  const [currentPage, setCurrentPage] = useState(1)
  const { testList, pagination, loading, featureLocked } = useSelector((state: RootState) => state.companyTest )
  const dispatch = useDispatch<AppDispatch>()
  const navigate = useNavigate()
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
    dispatch(
      getAllTests({params: {search: debouncedSearchTerm || undefined,status: statusFilter || undefined,page: currentPage,limit: 10,}}))
  }, [dispatch, debouncedSearchTerm, statusFilter, currentPage])

  const openModal = (config: Omit<typeof modalConfig, 'isOpen'>) => {
    setModalConfig({...config, isOpen: true})
  }
  const closeModal = () => {
    setModalConfig(prev => ({...prev, isOpen: false}))
  }

  console.log("test: ", testList)

  const handleCreateTest = () => {
    navigate("/company/test/create")
  }

  const handlePublishTest = async(id: string) => {
    try {
      await dispatch(publishTest({id})).unwrap()
      toast.success('Test published successfully')
      await dispatch(getAllTests({params: {search: debouncedSearchTerm || undefined,status: statusFilter || undefined,page: currentPage,limit: 10,}}))
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to publish test')
    }
  }

  const getStatusColor = (status: TestStatus) => {
    return statusColorMap[status] ?? "default"
  }
  const hasTestStarted = (startTime: string | Date) => {
    return new Date(startTime).getTime() <= Date.now()
  }
  const handleDeleteTest = (id: string) => {
    openModal({
      title: 'Delete Test',
      message: 'Are you sure you want to delete this test?',
      type: 'danger',
      onConfirm: async() => {
        try {
          await dispatch(deleteTest({ id }))
          toast.success('Test deleted successfully')
          dispatch(getAllTests({params: {search: debouncedSearchTerm || undefined,status: statusFilter || undefined,page: currentPage,limit: 10,}}))
        } catch (error: unknown) {
          if(error instanceof Error)
            toast.error('Failed to delete test')
        } finally {
          closeModal()
        }
      }
    })
  }

  const getTestActions = (test: CompanyTestList): TestAction[] => {
    const commonActions: TestAction[] = [
      {
        label: "View",
        icon: Eye,
        color: "success",
        onClick: () => navigate(`/company/test/${test.id}`),
      },
    ]

    if (test.testStatus === "DRAFT") {
      return [
        ...commonActions,
        {
          label: "Edit",
          icon: Edit2Icon,
          color: "primary",
          onClick: () => navigate(`/company/test/edit/${test.id}`),
        },
        {
          label: "Publish",
          icon: Send,
          color: "warning",
          onClick: () => { handlePublishTest(test.id) }
        },
        {
          label: "Delete",
          icon: Trash2,
          color: "error",
          onClick: () => { handleDeleteTest(test.id)},
        },
      ]
    }

    if (test.testStatus === "PUBLISHED") {
      if (hasTestStarted(test.startTime)) {
        return commonActions
      }

      return [
        ...commonActions,
        {
          label: "Edit",
          icon: Edit2Icon,
          color: "primary",
          onClick: () => navigate(`/company/test/edit/${test.id}`),
        },
        {
          label: "Reschedule",
          icon: CalendarClock,
          color: "warning",
          onClick: () => navigate(`/company/test/reschedule`, {state: test}),
        },
        {
          label: "Cancel",
          icon: XCircle,
          color: "secondary",
          onClick: () => navigate(`/company/test/${test.id}/cancel`),
        },
      ]
    }

    return commonActions
  }

  const columns: Column<CompanyTestList>[] = [
    {
      header: "Name",
      key: "name",
      render: (val) => (
        <Typography fontWeight={700} color="text.primary">
          {val.toString()}
        </Typography>
      ),
    },
    {
      header: "Job Role",
      key: "jobRole",
      render: (val) => (
        <Typography fontWeight={600} color="text.secondary">
          {val.toString()}
        </Typography>
      ),
    },
    {
      header: "Invited Candidates",
      key: "candidatesCount",
      render: (val) => (
        <Typography fontWeight={600} color="text.secondary">
          {val.toString()}
        </Typography>
      ),
    },
    {
      header: "Duration",
      key: "durationInMinutes",
      render: (val) => (
        <Typography fontSize={13} fontWeight={700}>
          {val.toString()} Minutes
        </Typography>
      ),
    },
    {
      header: "Start Time",
      key: "startTime",
      render: (val) => {
        const date = new Date(val.toLocaleString())
        return (
        <Typography fontSize={13} fontWeight={700}>
          {date.toLocaleString()}
        </Typography>
      )}
    },
    {
      header: "Status",
      key: "testStatus",
      render: (val) => (
        <Chip
          label={val.toString()}
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
      render: (_, row) => {
        const actions = getTestActions(row)

        return (
          <Box display="flex" alignItems="center" gap={1}>
            {actions.map((action) => {
              const Icon = action.icon

              return (
                <Button
                  key={action.label}
                  size="small"
                  color={action.color}
                  onClick={action.onClick}
                  title={action.label}
                >
                  <Icon size={16} />
                </Button>
              )
            })}
          </Box>
        )
      },
    },
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
            disabled={featureLocked}
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
        <ConfirmationModal 
          isOpen={modalConfig.isOpen}
          onClose={closeModal}
          onConfirm={modalConfig.onConfirm}
          title={modalConfig.title}
          message={modalConfig.message}
          type={modalConfig.type}
        />
      </Box>
    </InternalLayout>
  )
}

export default CompanyTest