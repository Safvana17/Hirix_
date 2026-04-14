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
  BarChart3,
  ClipboardCheck,
  Briefcase
} from 'lucide-react'
  
  export const adminSidebarItems = [
    {label: 'Dashboard', icon: LayoutDashboard, path: '/admin/dashboard'},
    {label: 'Companies', icon: Building2, path: '/admin/companies'},
    {label: 'Users', icon: Users, path: '/admin/candidates'},
    {label: 'Categories', icon: FolderTree, path: '/admin/categories'},
    {label: 'Questions', icon: HelpCircle, path: '/admin/questions'},
    {label: 'Practice Library', icon: Library, path: '/admin/practicelibrary'},
    {label: 'Subscriptions', icon: CreditCard, path: '/admin/subscriptionS'},
    {label: 'Revenue', icon: DollarSign, path: '/admin/revenue'},
    {label: 'Reports', icon: BarChart3, path: '/admin/report'},
    {label: 'Settings', icon: Settings, path: '/admin/settings'},
  ]

  export const companySidebarItems = [
    {label: 'Dashboard', icon: LayoutDashboard, path: '/company/dashboard'},
    {label: 'Job Roles', icon: Briefcase, path: '/company/job-roles'},
    {label: 'Tests', icon: ClipboardCheck, path: '/company/tests'},
    {label: 'Questions', icon: HelpCircle, path: '/company/questions'},
    {label: 'Interviews', icon: Library, path: '/company/interviews'},
    {label: 'Subscriptions', icon: CreditCard, path: '/company/subscriptions'},
    {label: 'Settings', icon: Settings, path: '/company/settings'},
  ]