import React from 'react'
import { adminSidebarItems } from '../../../constants/sidebarItems'
import InternalLayout from '../../layouts/InternalLayout'


const AdminDashboard: React.FC= () => {
  return (
     <InternalLayout title="Dashboard" sidebarItems={adminSidebarItems}>
      <p>Welcome</p>
     </InternalLayout>
  )
}

export default AdminDashboard
