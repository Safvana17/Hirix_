import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Plus, Search } from 'lucide-react'
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Pagination, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import { Filter } from '@mui/icons-material'
import type { InterviewStatus } from '../../../types/interview'
import { useDebounce } from '../../../hooks/useDebounce'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllInterview } from '../../../redux/slices/features/interview/CompanyInterviewSlice'
import InterviewCard from '../../components/company/CompanyInterviewCard'

const interviewStatus: InterviewStatus[] = ['SCHEDULED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED']

const CompanyInterviews: React.FC = () => {
    const [statusfilter, setstatusFilter] = useState<InterviewStatus | "">("")
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const searchTerm = useDebounce(search, 500)
    const dispatch = useDispatch<AppDispatch>()
    const {interviews, pagination} = useSelector((state: RootState) => state.companyInterview)

    useEffect(() => {
        dispatch(getAllInterview({params: { search: searchTerm || undefined, status: statusfilter || undefined, page: currentPage, limit: 10}}))
    }, [dispatch, searchTerm, statusfilter, currentPage])


  return (
    <InternalLayout title='Interviews' subTitle='Manage multi-round interview process' sidebarItems={companySidebarItems}>
        <div>
            <div className='flex justify-end mb-5'>
                <button className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                    <Plus className='w-4 h-4' />
                    Add Question
                </button>
            </div>
        </div>
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
                    setSearch(e.target.value)
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
                    value={statusfilter}
                    label="Status"
                    onChange={(e) => {
                    setstatusFilter(e.target.value as InterviewStatus | "")
                    setCurrentPage(1)
                    }}
                    startAdornment={
                    <InputAdornment position="start">
                        <Filter  />
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

                    {interviewStatus.map((status) => (
                    <MenuItem key={status} value={status}>
                        {status}
                    </MenuItem>
                    ))}
                </Select>
                </FormControl>
            </Box>
        </Paper>
        {interviews.length > 0 ? (
        <>
            <Stack spacing={3}>
            {interviews.map((interview) => (
                <InterviewCard
                key={interview.id}
                interview={interview}
                onJoin={() => console.log('joining...')}
                onCancel={() => console.log('canceling...')}
                onReschedule={() => console.log('rescheduling...')}
                />
            ))}
            </Stack>

            <Box
            display="flex"
            justifyContent="space-between"
            alignItems="center"
            mt={4}
            flexWrap="wrap"
            gap={2}
            >
            {/* <Typography variant="body2" color="text.secondary">
                Page {pagination.currentPage} of {pagination.totalPages}
            </Typography> */}

            <Pagination
                page={currentPage}
                count={pagination.interview.totalPages}
                onChange={(_, value) => {
                setCurrentPage(value)
                }}
                shape="rounded"
                color="primary"
                sx={{
                '& .MuiPaginationItem-root': {
                    color: '#795003',
                    borderColor: '#795003'
                },
                '& .Mui-selected': {
                    backgroundColor: '#795003 !important',
                    color: '#fff'
                }
                }}
            />
            </Box>
        </>
        ) : (
        <Paper
            elevation={0}
            sx={{
            p: 6,
            borderRadius: 4,
            textAlign: 'center',
            border: '1px dashed #ccc'
            }}
        >
            <Typography variant="h6" color="text.secondary">
            No interviews found
            </Typography>
        </Paper>
        )}
    </InternalLayout>
  )
}

export default CompanyInterviews
