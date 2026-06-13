import React, { useEffect, useState } from "react";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import type { AppDispatch, RootState } from "../../../redux/store";
import { getTestHistory } from "../../../redux/slices/features/analytics/adminAnalysticsSlice";
import type { Column } from "../../../types/table";
import type { TestHistory } from "../../../types/analytics";
import DataTable from "../../components/ui/DataTable";
import { NotebookIcon } from "lucide-react";

const CandidateTestHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  const [page, setPage] = useState(1);

  const { testHistory, pagination, loading } = useSelector(
    (state: RootState) => state.adminAnalytics
  );

  useEffect(() => {
    dispatch(
      getTestHistory({
        params: {
          page,
          limit: 10,
        },
      })
    );
  }, [dispatch, page]);

  const columns: Column<TestHistory>[] = [
    {
      header: "Company",
      key: "company",
      render: (val) => (
        <span className="font-semibold text-gray-800">
          {val}
        </span>
      ),
    },
    {
      header: "Test",
      key: "testName",
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
          Test History
        </h2>

        <p className="text-gray-500 mt-1">
          View all assessments you've attended.
        </p>
      </div>

     {testHistory.length === 0 && !loading ? (
  <div className="flex flex-col items-center justify-center py-20">
    <div className="text-6xl mb-4"><NotebookIcon /> </div>

    <h3 className="text-2xl font-bold text-gray-800 mb-2">
      No Tests Yet
    </h3>

    <p className="text-gray-500 text-center max-w-md">
      You haven't attended any tests yet. Once you complete an assessment,
      your test history will appear here.
    </p>
  </div>
) : (
  <DataTable
    columns={columns}
    data={testHistory}
    isLoading={loading}
    emptyMessage="No test history available"
    pagination={{
      currentPage: page,
      totalPages: pagination.test.totalPages,
      totalCount: pagination.test.totalCount,
      onPageChange: (page) => setPage(page),
    }}
  />
)}
    </div>
  );
};

export default CandidateTestHistory;