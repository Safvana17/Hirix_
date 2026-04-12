import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { updateProfileSchema } from '../../../lib/validation/settingsValidator'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getCompanyProfile, updateProfile, uploadProfileImage } from '../../../redux/slices/features/settingsSlice/companySettingsSlice'
import { Building2, File, Upload } from 'lucide-react'
import toast from 'react-hot-toast'



type ProfileFormValues = z.infer<typeof updateProfileSchema>


const ProfileTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [documentFile, setDocumentFile] = useState<File | null>(null)

  const { company } = useSelector((state: RootState) => state.companySettings)
  const { user } = useSelector((state: RootState) => state.auth)
 
  useEffect(() => {
    if (user?.id) {
      console.log('Fetching company...')
      dispatch(getCompanyProfile({id: user.id}))
    }
  }, [user, dispatch])

  const handleDocumnetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file) return
    setDocumentFile(file)
  }
  const profileData = useMemo(() => ({
    name: company?.name || user?.name || '',
    email: company?.email || user?.email || '',
    legalName: company?.legalName || '',
    website: company?.website || '',
    domain: company?.domain || '',
    teamSize: company?.teamSize || undefined,
    about: company?.about || '',
    streetName: company?.streetName || '',
    city: company?.city || '',
    state: company?.state || '',
    country: company?.country || '',
    pinCode: company?.pinCode || '',
    primaryContactName: company?.primaryContactName || '',
    billingEmail: company?.billingEmail || '',
    phoneNumber: company?.phoneNumber || '',
    status: company?.status || 'Active',
    profileLogo: company?.profileLogo || '',
    certificateType: company?.certificateType || undefined,
    certificateNumber: company?.certificateNumber || '',
    certificate: company?.certificate || ''
  }), [company, user])

  const { register, handleSubmit,reset, watch, formState: {errors} } = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: profileData
  })

  useEffect(() => {
    if(company || user){
      reset(profileData)
    }
  }, [profileData, reset, company, user])

  const onSubmit = async(data: ProfileFormValues) => {
    if (!user?.id) return

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if(value !== undefined && value !== null){
          formData.append(key, String(value))
        }
      })

      if(documentFile){
        formData.append('certificateFile', documentFile)
      }
      await dispatch(updateProfile({ id: user.id, company: formData })).unwrap()

      toast.success('Your profile has been updated successfully. It is now under admin review.')
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to upload profile')
    }
  }

  const handleImageChange = async(e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if(!file || !user?.id) return

    const formData = new FormData()
    formData.append('profileLogo', file)

    try {
      await dispatch(uploadProfileImage({id: user.id, formData})).unwrap()
      toast.success('Profile image uploaded successfully')
    } catch (error) {
      toast.error(typeof error === 'string' ? error : 'Failed to upload profile pic')
    }
  }

  console.log('company: ', company)
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className='bg-white rounded-xl p-8'>
        <h2 className="text-xl font-bold text-gray-800 mb-4">Basic Information</h2>

        <div className="flex justify-center py-6">
          <div className="relative w-32 h-32">
            {company?.profileLogo?(
            <img
              src={company?.profileLogo}
              alt="Company Logo"
              className="w-full h-full object-cover rounded-full border"
            />): (
                <div className="w-full h-full flex items-center justify-center rounded-full border bg-gray-100">
                  <Building2 className='w-16 h-16 text-gray-400' />
                </div>
            )}

            <label className="absolute bottom-0 right-0 bg-[#C89A44] text-white p-2 rounded-full cursor-pointer hover:bg-[#634815]">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange}/>
               <Upload className='w-3 h-3' />
            </label>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">

          <div className="space-y-2">
            <label htmlFor="name">Company Name*</label>
            <input {...register('name')} id="name"
              className={`w-full bg-[#D9D9D9] rounded-md border px-3 py-2 text-sm ${errors.name && 'border-red-500'} focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]`}
              placeholder="Company Name"
            />
            {errors.name && <p className="text-red-500 text-sm">{errors.name.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="legalName">Legal Name</label>
            <input {...register('legalName')} id="legalName"
              className={`w-full bg-[#D9D9D9] rounded-md border border-gray-300 px-3 py-2 text-sm ${errors.legalName && 'border-red-500'} focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]`}
              placeholder="Legal Name"
            />
            {errors.legalName && <p className="text-red-500 text-sm">{errors.legalName.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="website">Website URL</label>
            <input {...register('website')} id="website"
              className="w-full bg-[#D9D9D9] rounded-md border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="https://example.com"
            />
            {errors.website && <p className="text-red-500 text-sm">{errors.website.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="domain">Industry / Domain</label>
            <input {...register('domain')} id="domain"
              className="w-full bg-[#D9D9D9] rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="e.g. Technology"
            />
            {errors.domain && <p className="text-red-500 text-sm">{errors.domain.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="teamSize">Team Size</label>
            <input {...register('teamSize', {
                valueAsNumber: true,
                setValueAs: (v) => v === '' ? undefined : Number(v)
              })} id="teamSize" type="number"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="e.g. 50"
            />
            {errors.teamSize && <p className="text-red-500 text-sm">{errors.teamSize.message}</p>}
          </div>

        </div>
        <div className="space-y-2">
          <label htmlFor="about">About</label>
          <input {...register('about')} id="about"
            className="w-full rounded-md h-20 border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
            placeholder="Something about your company"
          />
          {errors.about && <p className="text-red-500 text-sm">{errors.about.message}</p>}
        </div>
      </div>

      <div className="bg-white rounded-2xl p-8 shadow-sm border">
        <h2 className="text-xl font-semibold text-gray-800 mb-6">Documents</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium text-gray-600">Document Type</label>
            <select
              {...register('certificateType')}
              className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#7c5a1a] outline-none"
            >
              <option value="">Select document type</option>
              <option value="GST">GST Certificate</option>
              <option value="COI">Certificate of Incorporation</option>
            </select>
            {errors.certificateType && (
              <p className="text-red-500 text-sm">{errors.certificateType.message}</p>
            )}
          </div>

          {/* GST Number */}
          {watch('certificateType') === 'GST' && (
            <div className="space-y-2">
              <label className="text-sm font-medium text-gray-600">GST Number</label>
              <input
                {...register('certificateNumber')}
                className="w-full border border-gray-200 bg-gray-50 px-3 py-2 rounded-lg focus:ring-2 focus:ring-[#7c5a1a] outline-none"
                placeholder="Enter GST number"
              />
              {errors.certificateNumber && (
                <p className="text-red-500 text-sm">{errors.certificateNumber.message}</p>
              )}
            </div>
          )}
        </div>

        {/* Upload Area */}
        <div className="mt-6">
          <label className="text-sm font-medium text-gray-600">Upload Document</label>

          <div className="mt-2 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center hover:border-[#7c5a1a] transition cursor-pointer">
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={handleDocumnetChange}
              className="hidden"
              id="certificateUpload"
            />

            <label htmlFor="certificateUpload" className="cursor-pointer flex flex-col items-center gap-2">
              <Upload className="w-6 h-6 text-gray-400" />
              <p className="text-sm text-gray-600">
                Click to upload or drag & drop
              </p>
              <p className="text-xs text-gray-400">
                PDF or Image (Max 5MB)
              </p>
            </label>
          </div>

          {/* Selected File Preview */}
          {documentFile && (
            <div className="mt-3 flex items-center justify-between bg-gray-50 border rounded-lg px-3 py-2">
              <span className="text-sm text-gray-700 truncate">
                {documentFile.name}
              </span>
              <button
                type="button"
                onClick={() => setDocumentFile(null)}
                className="text-red-500 text-xs hover:underline"
              >
                Remove
              </button>
            </div>
          )}
        </div>
        {company?.certificate && (
          <div className="mt-6">
            <label className="text-sm font-medium text-gray-600">Current Document</label>

            <div className="mt-2 flex items-center justify-between bg-green-50 border border-green-200 rounded-lg px-4 py-3">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 p-2 rounded-lg">
                  <File className='w-3 h-3' />
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-800">
                    Uploaded Document
                  </p>
                  <p className="text-xs text-gray-500">
                    Click below to view
                  </p>
                </div>
              </div>

              <a
                href={company.certificate}
                target="_blank"
                rel="noopener noreferrer"
                className="text-sm text-blue-600 hover:underline font-medium"
              >
                View
              </a>
            </div>
          </div>
        )}
      </div>

      <div className='bg-white rounded-xl p-8'>
        <h2 className="text-xl font-bold text-gray-800 pt-4 mb-5">Address Details</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label htmlFor="streetName">Street Address</label>
            <input {...register('streetName')} id="streetName"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="123 Tech Lane"
            />
            {errors.streetName && <p className="text-red-500 text-sm">{errors.streetName.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="city">City</label>
            <input {...register('city')} id="city"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="City"
            />
            {errors.city && <p className="text-red-500 text-sm">{errors.city.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="state">State / Province</label>
            <input {...register('state')} id="state"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="State"
            />
            {errors.state && <p className="text-red-500 text-sm">{errors.state.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="country">Country</label>
            <input {...register('country')} id="country"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="Country"
            />
            {errors.country && <p className="text-red-500 text-sm">{errors.country.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="pinCode">Zip / Postal Code</label>
            <input {...register('pinCode')} id="pinCode"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="94105"
            />
            {errors.pinCode && <p className="text-red-500 text-sm">{errors.pinCode.message}</p>}
          </div>

        </div>
      </div>

      <div className='bg-white rounded-xl p-8'>
        <h2 className="text-xl font-bold text-gray-800 pt-4">Contact Information</h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

          <div className="space-y-2">
            <label htmlFor="PrimaryContactName">Primary Contact Name</label>
            <input {...register('primaryContactName')} id="PrimaryContactName"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="Jane Doe"
            />
            {errors.primaryContactName && <p className="text-red-500 text-sm">{errors.primaryContactName.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="email">Primary Contact Email</label>
            <input {...register('email')} id="email"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="jane@example.com"
            />
            {errors.email && <p className="text-red-500 text-sm">{errors.email.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="billingEmail">Billing Email</label>
            <input {...register('billingEmail')} id="billingEmail"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="billing@example.com"
            />
            {errors.billingEmail && <p className="text-red-500 text-sm">{errors.billingEmail.message}</p>}
          </div>

          <div className="space-y-2">
            <label htmlFor="phoneNumber">Phone Number</label>
            <input {...register('phoneNumber')} id="phoneNumber"
              className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
              placeholder="+1 234 567 8900"
            />
            {errors.phoneNumber && <p className="text-red-500 text-sm">{errors.phoneNumber.message}</p>}
          </div>

        </div>
      </div>

    <div className='bg-white rounded-xl p-8'>
    <h2 className="text-xl font-bold text-gray-800 pt-4">Subscription & Limits</h2>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">

        <div className="space-y-2">
        <label htmlFor="subscriptionPlan">Subscription Plan</label>
        <input
            value={company?.subscriptionPlan || 'Free'}
            id="subscriptionPlan"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
            disabled
        />
        </div>

        <div className="space-y-2">
        <label htmlFor="maxCandidates">Maximum Candidates per Test</label>
        <input
            value={10}
            id="maxCandidates"
            type="number"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
            disabled
        />
        </div>

        <div className="space-y-2">
        <label htmlFor="maxTestPerMonth">Maximum Test per Month</label>
        <input
            value={10}
            id="maxTestPerMonth"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
            disabled
        />
        </div>

        <div className="space-y-2">
        <label htmlFor="status">Status</label>
        <input
            value={profileData.status}
            id="status"
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#7c5a1a]"
            disabled
        />
        </div>

    </div>
    </div>

      <div className="pt-6 flex justify-end">
        <button
          type="submit"
          className="bg-[#7c5a1a] hover:bg-[#634815] text-white px-4 py-2 rounded-md font-medium text-sm transition-colors"
        >
          Save Changes
        </button>
      </div>

    </form>
  )
}

export default ProfileTab