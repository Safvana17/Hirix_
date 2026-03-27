import React, { useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'
import ProfileTab from '../../components/company/ProfileTab'
import { useNavigate } from 'react-router-dom'




type TabType = 'profile'| 'notifications'| 'change-Password'| 'delete-Account'


const CompanyProfile: React.FC = () => {

   const [activeTab, setActiveTab] = useState('profile')
   const navigate = useNavigate()

   const tabs: {id: TabType, label: string} [] = [
    {id: 'profile', label: 'Profile'},
    {id: 'notifications', label: 'Notifications'},
    {id: 'change-Password', label: 'Change Password'},
    {id: 'delete-Account', label: 'Delete Account'}
   ]


  return (
     <InternalLayout title='Settings' subTitle='Manage company profile' sidebarItems={companySidebarItems}>
        <div>
            <div className='flex bg-white w-full rounded-2xl p-2 gap-2 shadow-sm'>
              {tabs.map((tab) => (
               <button 
                key={tab.id}
                onClick={() => {
                  if(tab.id === 'change-Password'){
                    navigate('/company/password')
                  }else{
                    setActiveTab(tab.id)
                  }
                }}
                className={`px-4 py-2 rounded-xl transition ${activeTab === tab.id 
                  ? 'bg-[#6B4705] text-white font-bold'
                  : 'bg-white text-black'
                }`}>
                  {tab.label}
               </button>
              ))}
            </div>
            <div className='p-8 mt-5'>
              {activeTab === 'profile' && <ProfileTab />}
            </div>
          </div>
     </InternalLayout>
  )
}

export default CompanyProfile
