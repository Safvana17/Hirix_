import React, { useState } from 'react'
import type { ModalMode, PlanPayload, TargetType, BillingCycle } from '../../../types/subscription'
import { ZodError } from 'zod'
import { createSubscriptionPlanSchema } from '../../../lib/validation/subcriptionPlanValidator'




interface Props {
  isOpen: boolean
  initialData: PlanPayload | null
  onClose: () => void
  onSubmit: (data: PlanPayload) => void
  mode: ModalMode
}

const SubscriptionPlanModal: React.FC<Props> = ({ isOpen, onClose,initialData, onSubmit, mode }) => {

  const [formData, setFormData] = useState<PlanPayload>({
    id: initialData?.id || '',
    planName: initialData?.planName || '',
    target: initialData?.target || 'company',
    price: initialData?.price || 0,
    billingCycle: initialData?.billingCycle || 'monthly',

    canCreateCustomQuestions: initialData?.canCreateCustomQuestions|| false,
    canUseAdminQuestions: initialData?.canUseAdminQuestions || true,
    maxTestsPerMonth: initialData?.maxTestsPerMonth || null,
    maxCandidates: initialData?.maxCandidates || null,
    maxInterviewPerMonth: initialData?.maxInterviewPerMonth || null,
    maxJobRolesPerMonth: initialData?.maxJobRolesPerMonth || null,

    canAccessPremiumQuestions: initialData?.canAccessPremiumQuestions || false,
    maxPracticePerDay: initialData?.maxPracticePerDay || null,
    hasDetailedFeedback: initialData?.hasDetailedFeedback || false,
    isTrialEnabled: initialData?.isTrialEnabled || false,
    trialDays: initialData?.trialDays || 0
  })

  const [localError, setLocalError] = useState<Record<string, string>>({})

  const validate = (data: PlanPayload) => {
    try {
      createSubscriptionPlanSchema.parse(data)
      setLocalError({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: Record<string, string> = {}
        error.issues.forEach((issue) => {
          const field = issue.path[0]
          if (typeof field === 'string') {
            errors[field] = issue.message
          }
        })
        setLocalError(errors)
      }
      return false
    }
  }

  if (!isOpen) return null

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()

    const payload: PlanPayload = {
      ...formData,
      planName: formData.planName.trim(),
    }

    console.log('payload: ', payload)
    if (!validate(payload)){
       console.log('validation failed', localError)
       return
    }
    onSubmit(payload)
  }

  return (
    <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
      <div className="bg-white w-[720px] rounded-2xl p-6 shadow-xl">

        <h2 className="text-xl font-semibold mb-5">
          {mode === "edit" ? "Edit Plan" : "Create Plan"}
        </h2>
        <div className="grid grid-cols-2 gap-4 mb-5">

          <div>
            <label className="text-sm font-medium mb-1 block">Plan Name</label>
            <input
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={formData.planName}
              onChange={(e) =>
                setFormData({ ...formData, planName: e.target.value })
              }
            />
            {localError.planName && <p className="text-red-500 text-xs">{localError.planName}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Price</label>
            <input
              type="number"
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={formData.price}
              onChange={(e) =>
                setFormData({ ...formData, price: Number(e.target.value) })
              }
            />
            {localError.price && <p className="text-red-500 text-xs">{localError.price}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Target</label>
            <select
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={formData.target}
              onChange={(e) =>
                setFormData({ ...formData, target: e.target.value as TargetType })
              }
            >
              <option value="company">Company</option>
              <option value="candidate">Candidate</option>
            </select>
            {localError.target && <p className="text-red-500 text-xs">{localError.target}</p>}
          </div>

          <div>
            <label className="text-sm font-medium mb-1 block">Billing Cycle</label>
            <select
              className="border border-gray-300 p-2 rounded-lg w-full"
              value={formData.billingCycle}
              onChange={(e) =>
                setFormData({ ...formData, billingCycle: e.target.value as BillingCycle })
              }
            >
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
              <option value="forever">Forever</option>
            </select>
            {localError.billingCycle && <p className="text-red-500 text-xs">{localError.billingCycle}</p>}
          </div>
        </div>

        {formData.target === 'company' && (
          <div className="mb-5">
            <h3 className="font-semibold mb-3">Company Capabilities</h3>

            <label className="flex items-center gap-2 mb-2 text-sm">
              <input
                type="checkbox"
                checked={formData.canCreateCustomQuestions}
                onChange={(e) =>
                  setFormData({ ...formData, canCreateCustomQuestions: e.target.checked })
                }
              />
              Allow custom question creation
            </label>

            <label className="flex items-center gap-2 mb-2 text-sm">
              <input
                type="checkbox"
                checked={formData.canUseAdminQuestions}
                onChange={(e) =>
                  setFormData({ ...formData, canUseAdminQuestions: e.target.checked })
                }
              />
              Use admin question bank
            </label>

            <div className="grid grid-cols-2 gap-4 mt-3">
              <div>
                <label className="text-sm font-medium mb-1 block">Max Tests / Month</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={formData.maxTestsPerMonth ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxTestsPerMonth: e.target.value ? Number(e.target.value) : null
                    })
                  }
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited</p>
              </div>

              <div>
                <label className="text-sm font-medium mb-1 block">Max Candidates</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={formData.maxCandidates ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxCandidates: e.target.value ? Number(e.target.value) : null
                    })
                  }
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Max Job Roles</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={formData.maxJobRolesPerMonth ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxJobRolesPerMonth: e.target.value ? Number(e.target.value) : null
                    })
                  }
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited</p>
              </div>
              <div>
                <label className="text-sm font-medium mb-1 block">Max Interviews</label>
                <input
                  type="number"
                  className="border border-gray-300 p-2 rounded-lg w-full"
                  value={formData.maxInterviewPerMonth ?? ''}
                  onChange={(e) =>
                    setFormData({
                      ...formData,
                      maxInterviewPerMonth: e.target.value ? Number(e.target.value) : null
                    })
                  }
                />
                <p className="text-xs text-gray-500">Leave empty for unlimited</p>
              </div>
            </div>
          </div>
        )}

        {formData.target === 'candidate' && (
          <div className="mb-5">
            <h3 className="font-semibold mb-3">Candidate Capabilities</h3>

            <label className="flex items-center gap-2 mb-2 text-sm">
              <input
                type="checkbox"
                checked={formData.canAccessPremiumQuestions}
                onChange={(e) =>
                  setFormData({ ...formData, canAccessPremiumQuestions: e.target.checked })
                }
              />
              Access premium questions
            </label>

            <div className="mt-3">
              <label className="text-sm font-medium mb-1 block">Max Practice / Day</label>
              <input
                type="number"
                className="border border-gray-300 p-2 rounded-lg w-full"
                value={formData.maxPracticePerDay ?? ''}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    maxPracticePerDay: e.target.value ? Number(e.target.value) : null
                  })
                }
              />
              <p className="text-xs text-gray-500">Leave empty for unlimited</p>
            </div>

            <label className="flex items-center gap-2 mt-3 text-sm">
              <input
                type="checkbox"
                checked={formData.hasDetailedFeedback}
                onChange={(e) =>
                  setFormData({ ...formData, hasDetailedFeedback: e.target.checked })
                }
              />
              Provide detailed feedback
            </label>
          </div>
        )}
        <div className="mb-5">
          <label className="flex items-center gap-2 text-sm font-medium">
            <input
              type="checkbox"
              checked={formData.isTrialEnabled}
              onChange={(e) =>
                setFormData({
                  ...formData,
                  isTrialEnabled: e.target.checked,
                  trialDays: e.target.checked ? formData.trialDays : 0,
                })
              }
            />
            Enable Free Trial
          </label>

          {formData.isTrialEnabled && (
            <div className="mt-3">
              <label className="text-sm font-medium mb-1 block">Trial Days</label>
              <input
                type="number"
                className="border border-gray-300 p-2 rounded-lg w-full"
                value={formData.trialDays}
                onChange={(e) =>
                  setFormData({
                    ...formData,
                    trialDays: Number(e.target.value),
                  })
                }
              />
              {localError.trialDays && (
                <p className="text-red-500 text-xs">{localError.trialDays}</p>
              )}
            </div>
          )}
        </div>
        <div className="flex justify-end gap-3 mt-3">
          <button
            className="px-4 py-2 bg-[#65051C] text-white rounded-lg"
            onClick={onClose}
          >
            Cancel
          </button>

          <button
            className="px-4 py-2 bg-[#0B3358] text-white rounded-lg"
            onClick={handleSubmit}
          >
            {mode === "edit" ? "Save Changes" : "Create Plan"}
          </button>
        </div>

      </div>
    </div>
  )
}

export default SubscriptionPlanModal