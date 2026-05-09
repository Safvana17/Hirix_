import React from "react"
import { Check, Circle, Flag } from "lucide-react"
import type { CandidateTest, TestQuestions } from "../../../../types/test"

type QuestionStatus = "answered" | "notAnswered" | "review"

interface CandidateTestSidebarProps {
  test: CandidateTest
  currentQuestionIndex: number
  answeredQuestionIds: string[]
  reviewQuestionIds: string[]
  onQuestionClick: (index: number) => void
}

const CandidateTestSidebar: React.FC<CandidateTestSidebarProps> = ({
  test,
  currentQuestionIndex,
  answeredQuestionIds,
  reviewQuestionIds,
  onQuestionClick,
}) => {
  const questions = test.questions ?? []
  const totalQuestions = questions.length
  const answeredCount = answeredQuestionIds.length
  const reviewCount = reviewQuestionIds.length
  const notAnsweredCount = totalQuestions - answeredCount
  const progressPercentage =totalQuestions > 0 ? Math.round((answeredCount / totalQuestions) * 100) : 0

  const getQuestionId = (question: TestQuestions): string => {
    return question.id || question.questionId || ""
  }

  const getQuestionStatus = (question: TestQuestions): QuestionStatus => {
    const questionId = getQuestionId(question)
    if (reviewQuestionIds.includes(questionId)) {
      return "review"
    }
    if (answeredQuestionIds.includes(questionId)) {
      return "answered"
    }
    return "notAnswered"
  }

  const getQuestionButtonClass = (
    status: QuestionStatus,
    isActive: boolean
  ): string => {
    if (isActive) {
      return "border border-[#756BFF] bg-white text-[#111827]"
    }

    if (status === "answered") {
      return "bg-[#86E7AD] text-[#064E3B]"
    }

    if (status === "review") {
      return "bg-[#F4BD82] text-[#7C2D12]"
    }

    return "bg-[#E5E5E5] text-[#333]"
  }

  return (
    <aside className="h-full w-[300px] rounded-md bg-white p-5 overflow-y-auto shadow-lg">
      <h2 className="text-sm font-bold text-[#222]">Test Progress</h2>

      <div className="mt-4">
        <div className="h-2 w-full rounded-full bg-[#B6AAAA]">
          <div
            className="h-2 rounded-full bg-[#021A30]"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>

        <p className="mt-3 text-xs font-semibold text-[#333]">
          {answeredCount} of {totalQuestions} answered
        </p>
      </div>

      <div className="my-5 border-t border-[#D8D8D8]" />

      <div className="space-y-3">
        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#86E7AD] text-[#15803D]">
            <Check size={20} />
          </div>
          <p className="text-sm font-bold text-[#333]">
            {answeredCount} Answered
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#E5E5E5] text-[#555]">
            <Circle size={18} />
          </div>
          <p className="text-sm font-bold text-[#333]">
            {notAnsweredCount} Not Answered
          </p>
        </div>

        <div className="flex items-center gap-4">
          <div className="flex h-9 w-9 items-center justify-center rounded-md bg-[#F4BD82] text-[#C2410C]">
            <Flag size={20} />
          </div>
          <p className="text-sm font-bold text-[#333]">
            {reviewCount} Marked for Review
          </p>
        </div>
      </div>

      <div className="my-6 border-t border-[#D8D8D8]" />

      <div className="grid grid-cols-5 gap-3">
        {questions.map((question, index) => {
          const status = getQuestionStatus(question)
          const isActive = index === currentQuestionIndex

          return (
            <button
              key={getQuestionId(question) || index}
              type="button"
              onClick={() => onQuestionClick(index)}
              className={`h-8 w-8 rounded-md text-sm font-bold transition hover:scale-105 ${getQuestionButtonClass(
                status,
                isActive
              )}`}
            >
              {index + 1}
            </button>
          )
        })}
      </div>
    </aside>
  )
}

export default CandidateTestSidebar