import React, { useEffect, useState } from 'react';
import CandidateHeader from '../../components/layout/CandidateHeader';
import CandidatePracticeQuestions from '../../components/candidate/CandidatePracticeQuestions';
import { useDispatch, useSelector } from 'react-redux';
import type { AppDispatch, RootState } from '../../../redux/store';
import { getAllPracticeQuestions } from '../../../redux/slices/features/question/practiceQuestionSlice';
import { useDebounce } from '../../../hooks/useDebounce';
import type { QuestionType, QuestionDifficulty } from '../../../types/question';


const CandidateDashboard: React.FC = () => {
  const [type, setType] = useState<QuestionType | ''>('');
  const [difficulty, setDifficulty] = useState<QuestionDifficulty | ''>('');
  const [searchTerm, setSearchTerm] = useState('');
  const [currentPage, setCurrentPage] = useState(1); // Local current page

  const debouncedSearchTerm = useDebounce(searchTerm, 500);
  const { PracticeQuestions, pagination } = useSelector(
    (state: RootState) => state.practiceQuestion
  );
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(
      getAllPracticeQuestions({
        params: {
          search: debouncedSearchTerm,
          type: type || undefined,
          difficulty: difficulty || undefined,
          page: currentPage,
          limit: 10,
        },
        role: 'candidate',
      })
    );
  }, [debouncedSearchTerm, type, difficulty, currentPage, dispatch]);

  // Optional: Pagination handlers
  const handleNextPage = () => {
    if (currentPage < pagination.PracticeQuestion.totalPages) {
      setCurrentPage((prev) => prev + 1);
    }
  };
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage((prev) => prev - 1);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#021A30] to-[#0B0707]">
      <CandidateHeader />
      <CandidatePracticeQuestions
        questions={PracticeQuestions}
        type={type}
        setType={setType}
        difficulty={difficulty}
        setDifficulty={setDifficulty}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
      />

      {pagination.PracticeQuestion.totalPages > 1 && (
        <div className="flex justify-center gap-4 mt-4">
          <button
            onClick={handlePrevPage}
            disabled={currentPage === 1}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-white">
            Page {currentPage} of {pagination.PracticeQuestion.totalPages}
          </span>
          <button
            onClick={handleNextPage}
            disabled={currentPage === pagination.PracticeQuestion.totalPages}
            className="px-4 py-2 bg-gray-300 rounded disabled:opacity-50"
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default CandidateDashboard;