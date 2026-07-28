import React, { useEffect, useMemo, useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useDispatch, useSelector } from 'react-redux'
import { z } from 'zod'
import { updateProfileSchema } from '../../../../lib/validation/settingsValidator'
import type { AppDispatch, RootState } from '../../../../redux/store'
import { getCompanyProfile, updateProfile, uploadProfileImage } from '../../../../redux/slices/features/settingsSlice/companySettingsSlice'
import { Building2, Upload } from 'lucide-react'
import toast from 'react-hot-toast'
import { Country } from 'country-state-city'
import CompanyBasicInformation from './CompanyBasicInformation'
import CompanySubscriptionDetails from './CompanySubscriptionDetails'
import CompanyAddressInformation from './CompanyAddressInformation'
import CompanyContactInformation from './CompanyContactInformation'
import CompanyCertificates from './CompanyCertificates'
import type { Certificate } from '../../../../types/company'

 type ProfileFormValues = z.input<typeof updateProfileSchema>;

const ProfileTab: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>()
  const [certificates, setCertificates] = useState<Certificate[]>([
    {
      id: "",
      key: "",
      fileName: "",
      contentType: "",

      certificateType: "GST",
      certificateNumber: "",
      certificateFile: null,
      fileUrl: ""
    }
  ])
  // const [selectedCountry, setSelectedCountry] = useState('')

  const { company } = useSelector((state: RootState) => state.companySettings)
  const { user } = useSelector((state: RootState) => state.auth)
  const countries = useMemo(() => Country.getAllCountries(), [] )
  // const states = State.getAllStates()

  useEffect(() => {
    if (user?.id) {
      console.log('Fetching company...')
      dispatch(getCompanyProfile({id: user.id}))
    }
  }, [user, dispatch])

  // useEffect(() => {
  //   if(company?.country){
  //     const country = countries.find((c) => c.name === company.country)
  //     if(country){
  //       setSelectedCountry(country.isoCode)
  //     }
  //   }
  // }, [company, countries])

useEffect(() => {
  if (!company?.certificates) return

    setCertificates(
      company.certificates.map(cert => ({
        id: cert.id ?? "",
        key: cert.key ?? "",
        fileName: cert.fileName ?? "",
        contentType: cert.contentType ?? "",
        certificateType: cert.certificateType as "GST" | "COI",
        certificateNumber: cert.certificateNumber,
        certificateFile: null,
        fileUrl: cert.certificateUrl ?? ""
      }))
    )
}, [company])


  // const handleDocumnetChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const file = e.target.files?.[0]
  //   if(!file) return
  //   setDocumentFile(file)
  // }

  const handleAddCertificate = () => {
    setCertificates((prev) => [
      ...prev,
      {
        id: "",
        key: "",
        fileName: "",
        contentType: "",
        certificateType: "GST" as "GST" | "COI",
        certificateNumber: "",
        certificateFile: null,
        fileUrl: ""
      }
    ])
  }

  const handleRemoveCertificate = (index: number) => {
    setCertificates((prev) => prev.filter((_, i) => i !== index))
  }

const updateCertificate = (index: number, field: string, value: unknown) => {
  setCertificates(prev =>
    prev.map((cert, i) =>
      i === index
        ? { ...cert, [field]: value }
        : cert
    )
  )
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
    // certificateType: company?.certificateType || undefined,
    // certificateNumber: company?.certificateNumber || '',
    // certificateFile: company?.certificateFile || ''
  }), [company, user])

 
  const { register, handleSubmit,reset, watch, setValue, formState: {errors} } = useForm<ProfileFormValues>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: profileData
  })

  useEffect(() => {
    if(company || user){
      reset(profileData)
    }
  }, [profileData, reset, company, user])

  const selectedCountry =
  countries.find(c => c.name === watch("country"))?.isoCode ?? "";


  const onSubmit = async(data: ProfileFormValues) => {
    if (!user?.id) {
      console.log("no user id")
      return
    }

    try {
      const formData = new FormData()
      Object.entries(data).forEach(([key, value]) => {
        if(value !== undefined && value !== null){
          formData.append(key, String(value))
        }
      })

      certificates.forEach((cert, index) => {
        console.log(`Certificate ${index}:`, cert);
        formData.append(`certificates[${index}][certificateType]`, cert.certificateType)
        formData.append(`certificates[${index}][certificateNumber]`, cert.certificateNumber)
        if (cert.certificateFile) {
          formData.append(
            `certificates[${index}][certificateFile]`,
            cert.certificateFile
          )
        }
        formData.append(`certificates[${index}][id]`, cert?.id ?? "")
        formData.append( `certificates[${index}][key]`, cert.key ?? "" )
        formData.append( `certificates[${index}][fileName]`, cert.fileName ?? "")
        formData.append( `certificates[${index}][contentType]`, cert.contentType ?? "")
      })

      // if(documentFile){
      //   formData.append('certificateFile', documentFile)
      // }
      console.log("reached here...")
      await dispatch(updateProfile({ id: user.id, company: formData })).unwrap()
      toast.success('Your profile has been updated successfully. It is now under admin review.')
      dispatch(getCompanyProfile({id: user.id}))
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

  return (
    <form onSubmit={handleSubmit(onSubmit, (errors) => console.log("validation errors: ", errors))} className="space-y-6">
      <input type="hidden" {...register('country')} />
      <input type="hidden" {...register('state')} />
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

      
        <CompanyBasicInformation register={register} errors={errors} />
      </div>
      <CompanyCertificates
        certificates={certificates}
        handleAddCertificate={handleAddCertificate}
        handleRemoveCertificate={handleRemoveCertificate}
        updateCertificate={updateCertificate}
      />

      <CompanyAddressInformation
          register={register}
          errors={errors}
          countries={countries}
          selectedCountry={selectedCountry}
          setValue={setValue}
          watch={watch}
      />
      <CompanyContactInformation 
        register={register} 
        errors={errors} 
      />
      <CompanySubscriptionDetails 
        subscriptionPlan={company?.subscriptionPlan} 
        status="Active" 
      />
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