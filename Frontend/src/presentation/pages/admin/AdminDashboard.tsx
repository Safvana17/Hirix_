import React from 'react'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import InternalLayout from '../../layouts/InternalLayout'


const AdminDashboard: React.FC= () => {
  return (
     <InternalLayout title="Dashboard" subTitle='' sidebarItems={adminSidebarItems}>
      <p>Welcome</p>
     </InternalLayout>
  )
}

export default AdminDashboard
