import React from 'react'
import InternalSidebar, { type SidebarItems } from '../components/layout/InternalSidebar'
import InternalHeader from '../components/layout/InternalHeader'
import InternalFooter from '../components/layout/InternalFooter'

interface InternalLayoutProps {
   title: string
   sidebarItems: SidebarItems[]
   children: React.ReactNode
}
const InternalLayout: React.FC<InternalLayoutProps>= ({title, sidebarItems, children}) => {
  return (
    <div className='flex min-h-screen bg-[#f5f0e8] font-sans'>
        <InternalSidebar items={sidebarItems} />
        <div className='flex-1 flex flex-col min-w-0'>
            <InternalHeader />
            <main className='flex-1 overflow-y-auto p-4 md:p-8'>
                <h1>{title}</h1>
                <div className='max-w-7xl mx-auto space-y-8'>
                    {children}
                </div>
            </main>
           <InternalFooter />
        </div>    
    </div>
  )
}

export default InternalLayout
