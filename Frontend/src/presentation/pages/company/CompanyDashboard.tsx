import React from 'react'
import {
  LayoutDashboard,
  Building2,
  Users,
  FolderTree,
  HelpCircle,
  Library,
  CreditCard,
  DollarSign,
  BarChart3,
  Settings
} from 'lucide-react'
import InternalLayout from '../../layouts/InternalLayout'

const CompanyDashboard: React.FC = () => {

    const companySidebarItems = [
    {label: 'Dashboard', icon: LayoutDashboard, path: 'admin/dashboard'},
    {label: 'Companies', icon: Building2, path: 'admin/companies'},
    {label: 'Users', icon: Users, path: 'admin/users'},
    {label: 'Categories', icon: FolderTree, path: 'admin/categories'},
    {label: 'Questions', icon: HelpCircle, path: 'admin/questions'},
    {label: 'Practice Library', icon: Library, path: 'admin/practicelibrary'},
    {label: 'Subscriptions', icon: CreditCard, path: 'admin/subscriptions'},
    {label: 'Revenue', icon: DollarSign, path: 'admin/revenue'},
    {label: 'Reports', icon: BarChart3, path: 'admin/report'},
    {label: 'Settings', icon: Settings, path: 'admin/settings'},
  ]
  return (
    <InternalLayout title='dashboard' sidebarItems={companySidebarItems}>
      <p>Welcom company</p>
    </InternalLayout>
  )
}

export default CompanyDashboard
