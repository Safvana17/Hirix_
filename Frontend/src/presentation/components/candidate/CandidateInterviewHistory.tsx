import React, { useEffect, useState } from 'react'
import DataTable from '../ui/DataTable';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { getInterviewHistory } from '../../../redux/slices/features/settingsSlice/candidateSettingsSlice';
import type { Column } from '../../../types/table';
import type { InterviewHistory } from '../../../types/candidate';
import moment from 'moment';
import { QuestionMarkOutlined } from '@mui/icons-material';

const CandidateInterviewHistory: React.FC = () => {
 const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(1);

  const { interviewHistory, pagination, loading } = useSelector((state: RootState) => state.candidateSettings)

  useEffect(() => {
    dispatch(
      getInterviewHistory({
        params: {
          page,
          limit: 10,
        },
      })
    );
  }, [dispatch, page]);

  const columns: Column<InterviewHistory>[] = [
    {
      header: "Company",
      key: 'companyName',
      render: (val) => (
        <span className="font-semibold text-gray-800">
          {val}
        </span>
      ),
    },
    {
      header: "Interview",
      key: 'interviewName',
      render: (val) => (
        <span className="font-semibold text-gray-800">
          {val}
        </span>
      ),
    },
    {
      header: "Job Role",
      key: "jobRole",
      render: (val) => (
        <span className="font-semibold text-gray-800">
          {val}
        </span>
      ),
    },
    {
      header: "Interviewer",
      key: 'interviewerName',
      render: (val) => (
        <span className="font-semibold text-gray-800">
          {val}
        </span>
      ),
    },
    {
      header: "Date",
      key: "date",
      render: (val) => (
        <span className="font-semibold text-gray-800">
          {moment(val).format("DD MMM YYYY hh:mm A")}
        </span>
      ),
    },
    {
      header: "Status",
      key: "status",
      render: (val) => (
        <span
          className={`px-3 py-1 rounded-full text-xs font-bold uppercase border ${
            val === "success"
              ? "bg-green-50 text-green-600 border-green-200"
              : "bg-red-50 text-red-600 border-red-200"
          }`}
        >
          {val}
        </span>
      ),
    },
  ];

  return (
    <div className="bg-white rounded-2xl shadow-md p-6 mt-4">
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-[#021A30]">
          Interview History
        </h2>

        <p className="text-gray-500 mt-1">
          View all interviews you've attended.
        </p>
      </div>

     {interviewHistory.length === 0 && !loading ? (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="text-6xl mb-4"><QuestionMarkOutlined /> </div>

    <h3 className="text-2xl font-bold text-gray-800 mb-2">
      No Interviews Yet
    </h3>

    <p className="text-gray-500 text-center max-w-md">
      You haven't attended any interview yet. Once you complete an interview,
      your interview history will appear here.
    </p>
  </div>
) : (
    <DataTable
      columns={columns}
      data={interviewHistory}
      isLoading={loading}
      emptyMessage="No interview history available"
      pagination={{
        currentPage: page,
        totalPages: pagination.history.totalPages,
        totalCount: pagination.history.totalCount,
        onPageChange: (page) => setPage(page),
      }}
    />
  )}
  </div>
  );

}

export default CandidateInterviewHistory
