import React from 'react'

interface CompanySubscriptionDetailsProps {
  subscriptionPlan?: string
  status: string
  maxCandidates?: number
  maxTestsPerMonth?: number
}

const CompanySubscriptionDetails: React.FC<CompanySubscriptionDetailsProps> = ({
  subscriptionPlan = 'Free',
  status,
  maxCandidates = 10,
  maxTestsPerMonth = 10,
}) => {
  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-xl font-bold text-gray-800 pt-4">
        Subscription & Limits
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-5">
        <div className="space-y-2">
          <label htmlFor="subscriptionPlan">Subscription Plan</label>
          <input
            id="subscriptionPlan"
            value={subscriptionPlan}
            disabled
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="maxCandidates">
            Maximum Candidates per Test
          </label>
          <input
            id="maxCandidates"
            type="number"
            value={maxCandidates}
            disabled
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="maxTestsPerMonth">
            Maximum Tests per Month
          </label>
          <input
            id="maxTestsPerMonth"
            value={maxTestsPerMonth}
            disabled
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
          />
        </div>

        <div className="space-y-2">
          <label htmlFor="status">Status</label>
          <input
            id="status"
            value={status}
            disabled
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm bg-gray-100"
          />
        </div>
      </div>
    </div>
  )
}

export default CompanySubscriptionDetails