import React from 'react'
import InternalLayout from '../../layouts/InternalLayout'
import { companySidebarItems } from '../../../constants/sidebarItems'

const CompanyDashboard: React.FC = () => {

  return (
    <InternalLayout title='dashboard' subTitle='' sidebarItems={companySidebarItems}>
      <p>Welcom company</p>
    </InternalLayout>
  )
}

export default CompanyDashboard
