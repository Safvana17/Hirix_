import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import { Plus, Search } from 'lucide-react'
import { Box, FormControl, InputAdornment, InputLabel, MenuItem, Pagination, Paper, Select, Stack, TextField, Typography } from '@mui/material'
import { Filter } from '@mui/icons-material'
import type { Interview, InterviewStatus, ModalMode, ScheduleInterviewPayload } from '../../../types/interview'
import { useDebounce } from '../../../hooks/useDebounce'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getAllInterview, scheduleInterview } from '../../../redux/slices/features/interview/CompanyInterviewSlice'
import InterviewCard from '../../components/company/interview/CompanyInterviewCard'
import { useNavigate } from 'react-router-dom'
import InterviewModal from '../../components/modal/InterviewModal'
import toast from 'react-hot-toast'

const interviewStatus: InterviewStatus[] = ['SCHEDULED', 'RESCHEDULED', 'CANCELLED', 'COMPLETED']

const CompanyInterviews: React.FC = () => {
    const [statusfilter, setstatusFilter] = useState<InterviewStatus | "">("")
    const [search, setSearch] = useState('')
    const [currentPage, setCurrentPage] = useState(1)
    const [interviewModalMode, setInterviewModalMode] = useState<ModalMode>('create')
    const [isModalOpen, setIsModalOpen] = useState(false)
    const [interview, setInterview] = useState<Interview | null>(null)
    const searchTerm = useDebounce(search, 500)
    const dispatch = useDispatch<AppDispatch>()
    const navigate = useNavigate()
    const {interviews, pagination} = useSelector((state: RootState) => state.companyInterview)

    useEffect(() => {
        dispatch(getAllInterview({params: { search: searchTerm || undefined, status: statusfilter || undefined, page: currentPage, limit: 10}}))
    }, [dispatch, searchTerm, statusfilter, currentPage])


    const handleCancelInterview = (interviewId: string) => {
        navigate(`/company/interview/${interviewId}/cancel`)
    }

    const handleRescheduleInterview = (interviewId: string) => {
        navigate(`/company/interview/${interviewId}/reschedule`)
    }

    const handleScheduleNextRound = (interview: Interview) => {
        setInterview(interview)
        setInterviewModalMode('create')
        setIsModalOpen(true)
    }

  const handleInterviewSubmit = async(data: ScheduleInterviewPayload) => {
    try {
      await dispatch(scheduleInterview({data})).unwrap()
      toast.success('Interview scheduled successfully')
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to schedule interview')
    }
  }

  const handleViewDetails = (interviewId: string) => {
    navigate(`/company/interview/${interviewId}`)
  } 
  return (
    <InternalLayout title='Interviews' subTitle='Manage multi-round interview process' sidebarItems={companySidebarItems}>
        <div>
            <div className='flex justify-end mb-5'>
                <button className='bg-[#795003] rounded-xl font-bold text-white p-3 flex items-center gap-2'>
                    <Plus className='w-4 h-4' />
                    Schedule Interview
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
                    onCancel={handleCancelInterview}
                    onReschedule={handleRescheduleInterview}
                    onViewDetails={handleViewDetails}
                    onEdit={() => console.log('Editing...')}
                    onScheduleNextRound={handleScheduleNextRound}
                    onSendOfferLetter={() => console.log('sending...')}
                    onUpdateResult={() => console.log('updating...')}
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
        <InterviewModal 
            isOpen={isModalOpen}
            mode={interviewModalMode}
            onClose={() => setIsModalOpen(false)}
            defaultData={{
                testCandidateId: interview?.testCandidateId,
                candidateName: interview?.candidateName,
                candidateEmail: interview?.candidateEmail,
                testId: interview?.testId,
                round: interview ? interview.round + 1 : 1, 
                jobRoleId: interview?.jobRoleId
            }}
            onSave={handleInterviewSubmit}
        />
    </InternalLayout>
  )
}

export default CompanyInterviews
