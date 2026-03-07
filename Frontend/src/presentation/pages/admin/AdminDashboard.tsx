import React from 'react'
import {
  LayoutDashboard,
  Building2,
  HelpCircle,
  FolderTree,
  Library,
  CreditCard,
  DollarSign,
  Users,
  Settings,
  BarChart3
} from 'lucide-react'
import InternalLayout from '../../layouts/InternalLayout'
// import { useDispatch } from 'react-redux'
// import { AppDispatch } from '../../../redux/store'

const AdminDashboard: React.FC= () => {

  // const dispatch = useDispatch<AppDispatch>()

  const adminSidebarItems = [
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
     <InternalLayout title="Dashboard" sidebarItems={adminSidebarItems}>
      <p>Welcome</p>
     </InternalLayout>
  )
}

export default AdminDashboard
