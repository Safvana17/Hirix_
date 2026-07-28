import React from 'react'
import type { FieldErrors, UseFormRegister } from 'react-hook-form'
import type { z } from 'zod'

import { updateProfileSchema } from '../../../../lib/validation/settingsValidator'

type ProfileFormValues = z.infer<typeof updateProfileSchema>

interface CompanyBasicInformationProps {
  register: UseFormRegister<ProfileFormValues>
  errors: FieldErrors<ProfileFormValues>
}

const CompanyBasicInformation: React.FC<CompanyBasicInformationProps> = ({ register, errors }) => {
  return (
    <div className="bg-white rounded-xl p-8">
      <h2 className="text-xl font-bold text-gray-800 mb-4">
        Basic Information
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <label htmlFor="name">Company Name *</label>

          <input
            {...register('name')}
            id="name"
            placeholder="Company Name"
            className={`w-full bg-[#D9D9D9] rounded-md border px-3 py-2 text-sm ${
              errors.name ? 'border-red-500' : ''
            } focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]`}
          />

          {errors.name && (
            <p className="text-red-500 text-sm">
              {errors.name.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="legalName">Legal Name</label>

          <input
            {...register('legalName')}
            id="legalName"
            placeholder="Legal Name"
            className={`w-full bg-[#D9D9D9] rounded-md border px-3 py-2 text-sm ${
              errors.legalName ? 'border-red-500' : ''
            } focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]`}
          />

          {errors.legalName && (
            <p className="text-red-500 text-sm">
              {errors.legalName.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="website">Website URL</label>

          <input
            {...register('website')}
            id="website"
            placeholder="https://example.com"
            className="w-full bg-[#D9D9D9] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.website && (
            <p className="text-red-500 text-sm">
              {errors.website.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="domain">Industry / Domain</label>

          <input
            {...register('domain')}
            id="domain"
            placeholder="e.g. Technology"
            className="w-full bg-[#D9D9D9] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.domain && (
            <p className="text-red-500 text-sm">
              {errors.domain.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <label htmlFor="teamSize">Team Size</label>

          <input
            {...register('teamSize', {
              valueAsNumber: true,
              setValueAs: (v) =>
                v === '' ? undefined : Number(v),
            })}
            id="teamSize"
            type="number"
            placeholder="e.g. 50"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.teamSize && (
            <p className="text-red-500 text-sm">
              {errors.teamSize.message}
            </p>
          )}
        </div>

        <div className="space-y-2 md:col-span-2">
          <label htmlFor="about">About</label>

          <textarea
            {...register('about')}
            id="about"
            rows={4}
            placeholder="Something about your company"
            className="w-full rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
          />

          {errors.about && (
            <p className="text-red-500 text-sm">
              {errors.about.message}
            </p>
          )}
        </div>
      </div>
    </div>
  )
}

export default CompanyBasicInformation