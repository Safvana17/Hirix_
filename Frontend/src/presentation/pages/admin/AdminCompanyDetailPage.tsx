import React, { useEffect, useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import { ArrowLeft, Ban, Building2, CheckCircle, File } from 'lucide-react'
import { useNavigate, useParams } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import {approveCompany, getCompanyDetail, rejectCompany, updateUserStatus } from '../../../redux/slices/features/users/usersSlice'
import { ROLES } from '../../../constants/role'
import SummeryCard from '../../components/layout/SummeryCard'
import ConfirmationModal from '../../components/modal/ConfirmationModal'



type CardProps = {
  title: string
  children: React.ReactNode
}

type FieldProps = {
  label: string
  value?: string | number | null
}

const Card: React.FC<CardProps> = ({ title, children }) => (
  <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition">
    <h2 className="text-lg font-semibold text-gray-800 mb-5">{title}</h2>
    {children}
  </div>
)

const Field: React.FC<FieldProps> = ({ label, value }) => (
  <div className="space-y-1">
    <p className="text-xs text-gray-500">{label}</p>
    <p className="font-medium text-gray-800 break-words">
      {value ?? 'N/A'}
    </p>
  </div>
)


const AdminCompanyDetailPage: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()
  const dispatch = useDispatch<AppDispatch>()

  const { selectedCompany } = useSelector(
    (state: RootState) => state.userSlice
  )
  const [isReasonModalOpen, setIsReasonModalOpen] = useState(false)
  const [rejectReason, setRejectReason] = useState<string>('')

  useEffect(() => {
    if (id) dispatch(getCompanyDetail({ id }))
  }, [id, dispatch])

  const [modalConfig, setModalConfig] = useState<{
    isOpen: boolean
    title: string
    message: string
    onConfirm: () => void
    type: 'danger' | 'warning' | 'info'
    showInput?: boolean
  }>({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: () => {},
    type: 'warning',
  })

  const openModal = (
    config: Omit<typeof modalConfig, 'isOpen'>
  ) => {
    setModalConfig({ ...config, isOpen: true })
  }

  const closeModal = () => {
    setModalConfig((prev) => ({ ...prev, isOpen: false }))
    setRejectReason('')
  }

  const handleUpdateStatus = (
    companyId: string,
    currentStatus: string
  ) => {
    const newStatus =
      currentStatus === 'active' ? 'blocked' : 'active'

    openModal({
      title:
        newStatus === 'blocked'
          ? 'Block Company'
          : 'Unblock Company',
      message: `Are you sure you want to ${newStatus}?`,
      type: newStatus === 'blocked' ? 'danger' : 'warning',
      onConfirm: () => {
        dispatch(
          updateUserStatus({
            id: companyId,
            status: newStatus,
            role: ROLES.COMPANY,
          })
        )
        closeModal()
      },
    })
  }

  const handleApproveCompany = (id: string) => {
    openModal({
      title: 'Approve Company',
      message: 'Approve this company?',
      type: 'info',
      onConfirm: () => {
        dispatch(approveCompany({ id: id!, action: 'APPROVE'}))
        closeModal()
      },
    })
  }
  console.log('selectedCompany: ', selectedCompany)

  if (!selectedCompany) {
    return (
      <InternalLayout title="" subTitle="" sidebarItems={adminSidebarItems}>
        <div className="flex justify-center py-10">
          <p>Loading company details...</p>
        </div>
      </InternalLayout>
    )
  }
  return (
    <InternalLayout title="" subTitle="" sidebarItems={adminSidebarItems}>
      <button
        onClick={() => navigate(-1)}
        className="flex items-center gap-2 text-gray-500 hover:text-[#6B4705] mb-6"
      >
        <ArrowLeft className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-widest">
          Back to List
        </span>
      </button>

      <div className="flex flex-col lg:flex-row justify-between items-center gap-6 mb-8">
        <div className="flex items-center gap-4">
          {selectedCompany.profileLogo ? (
            <img
              src={selectedCompany.profileLogo}
              className="w-20 h-20 rounded-xl object-cover border"
            />
          ) : (
            <div className="w-20 h-20 bg-[#E7D4B0] rounded-xl flex items-center justify-center">
              <Building2 className="w-10 h-10 text-[#6B4705]" />
            </div>
          )}

          <div>
            <h1 className="text-2xl font-bold text-[#4F3503]">
              {selectedCompany.name}
            </h1>
            <p className="text-gray-500">{selectedCompany.email}</p>
          </div>
        </div>
        <div className="flex gap-3 flex-wrap">
          {selectedCompany.status === 'pending' && (
            <>
              <button
                className="bg-[#6B4705] text-white px-5 py-2 rounded-lg hover:bg-[#C89A44]"
                onClick={() => handleApproveCompany(id!)}
              >
                Approve
              </button>

              <button
                className="bg-[#AA0101] text-white px-5 py-2 rounded-lg hover:bg-red-700"
                onClick={() => setIsReasonModalOpen(true)}
              >
                Reject
              </button>
            </>
          )}

          {selectedCompany.status === 'rejected' && (
            <button
              className="bg-[#6B4705] text-white px-5 py-2 rounded-lg hover:bg-[#C89A44]"
              onClick={() =>
                openModal({
                  title: 'Approve Company',
                  message: 'Approve this rejected company?',
                  type: 'info',
                  onConfirm: () => {
                    dispatch(approveCompany({ id: id!, action: 'APPROVE'}))
                    closeModal()
                  },
                })
              }
            >
              Approve
            </button>
          )}

          {(selectedCompany.status === 'active' ||
            selectedCompany.status === 'blocked') && (
            <button
              className="bg-[#6B4705] text-white px-5 py-2 rounded-lg hover:bg-[#4F3503]"
              onClick={() =>
                handleUpdateStatus(id!, selectedCompany.status)
              }
            >
              {selectedCompany.status === 'active'
                ? 'Block'
                : 'Unblock'}
            </button>
          )}
        </div>
      </div>

      {/* STATUS */}
      <div className="mb-6">
        <SummeryCard
          label="Status"
          value={selectedCompany.status}
          icon={
            selectedCompany.status === 'active'
              ? CheckCircle
              : Ban
          }
          bg={
            selectedCompany.status === 'active'
              ? 'bg-green-100'
              : 'bg-red-100'
          }
          color={
            selectedCompany.status === 'active'
              ? 'text-green-600'
              : 'text-red-600'
          }
        />
      </div>

      {/* GRID */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

        <Card title="Basic Information">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Name" value={selectedCompany.name} />
            <Field label="Legal Name" value={selectedCompany.legalName} />
            <Field label="Website" value={selectedCompany.website} />
            <Field label="Domain" value={selectedCompany.domain} />
            <Field label="Team Size" value={selectedCompany.teamSize} />
            <Field label="About" value={selectedCompany.about} />
          </div>
        </Card>

        <Card title="Address">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Street" value={selectedCompany.streetName} />
            <Field label="City" value={selectedCompany.city} />
            <Field label="State" value={selectedCompany.state} />
            <Field label="Country" value={selectedCompany.country} />
            <Field label="Pin Code" value={selectedCompany.pinCode} />
          </div>
        </Card>

        <Card title='Certificates'>
          <div className='grid grid-cols-2 gap-5'>
            <Field label='Certificate Type' value={selectedCompany.certificateType} />
            <Field label='Certificate Number' value={selectedCompany.certificateNumber} />
            {selectedCompany?.certificate && (
              <div className="mt-6">
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
                    href={selectedCompany.certificate}
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
        </Card>

        <Card title="Contact">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Email" value={selectedCompany.email} />
            <Field label="Phone" value={selectedCompany.phoneNumber} />
            <Field label="Primary Contact" value={selectedCompany.primaryContactName} />
            <Field label="Billing Email" value={selectedCompany.billingEmail} />
          </div>
        </Card>

        <Card title="Subscription">
          <div className="grid grid-cols-2 gap-5">
            <Field label="Plan" value={selectedCompany.subscriptionPlan} />
            <Field label="Max Candidates" value={selectedCompany.maxCandidates} />
            <Field label="Tests / Month" value={selectedCompany.maxTestPerMonth} />
          </div>
        </Card>
      </div>

      <ConfirmationModal
        isOpen={modalConfig.isOpen}
        onClose={closeModal}
        onConfirm={modalConfig.onConfirm}
        title={modalConfig.title}
        message={modalConfig.message}
        type={modalConfig.type}
      />

{isReasonModalOpen && (
  <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">
    <div className="bg-white rounded-xl w-full max-w-md p-6 shadow-lg">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">
        Enter Rejection Reason
      </h2>

      <textarea
        className="w-full border rounded-lg p-3 text-sm focus:outline-none focus:ring-2 focus:ring-red-400"
        rows={4}
        placeholder="Type reason..."
        value={rejectReason}
        onChange={(e) => setRejectReason(e.target.value)}
      />

      <div className="flex justify-end gap-3 mt-5">
        <button
          onClick={() => {
            setIsReasonModalOpen(false)
            setRejectReason('')
          }}
          className="px-4 py-2 rounded-md border text-gray-600"
        >
          Cancel
        </button>

        <button
          onClick={() => {
            if (!rejectReason.trim()) return

            setIsReasonModalOpen(false)

            // OPEN CONFIRMATION MODAL WITH REASON
            openModal({
              title: 'Confirm Rejection',
              message: `Are you sure you want to reject?\n\nReason:\n${rejectReason}`,
              type: 'danger',
              onConfirm: () => {
                dispatch(rejectCompany({
                  id: id!,
                  reason: rejectReason.trim(),
                  action: 'REJECT'
                }))
                setRejectReason('')
                closeModal()
              }
            })
          }}
          className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
        >
          Continue
        </button>
      </div>
    </div>
  </div>
)}
    </InternalLayout>
  )
}

export default AdminCompanyDetailPage