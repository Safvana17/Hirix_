import React, { useState } from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import PlatformSettings from '../../components/admin/PlatformSettings'
import AdminEmailTemplate from '../../components/admin/AdminEmailTemplate'
import AdminNotificationTab from '../../components/admin/AdminNotificationTab'



type TabType = 'platform-settings'| 'email-template'| 'notifications'


const AdminSettings: React.FC= () => {
   const [activeTab, setActiveTab] = useState<TabType>('platform-settings')
   const tabs: {id: TabType, label: string} [] = [
        {id: 'platform-settings', label: 'Platform Settings'},
        {id: 'email-template', label: 'Email Templates'},
        {id: 'notifications', label: 'Notifications'},
   ]
  return (
    <InternalLayout title='Settings' subTitle='Configuere platform settings and prefernce' sidebarItems={adminSidebarItems}>
       <div>
            <div className='flex bg-white w-full rounded-2xl p-2 gap-2 shadow-sm'>
              {tabs.map((tab) => (
               <button 
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`px-4 py-2 rounded-xl transition ${activeTab === tab.id 
                  ? 'bg-[#6B4705] text-white font-bold'
                  : 'bg-white text-black'
                }`}>
                  {tab.label}
               </button>
              ))}
            </div>
            <div className='p-8 mt-5'>
              {activeTab === 'platform-settings' && <PlatformSettings />}
              {activeTab === 'email-template' && <AdminEmailTemplate />}
              {activeTab === 'notifications' && <AdminNotificationTab />}
            </div>
          </div>
    </InternalLayout>
  )
}

export default AdminSettings
