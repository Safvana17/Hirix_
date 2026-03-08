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
    <div className='flex flex-col min-h-screen bg-[#f5f0e8] font-sans overflow-hidden'>
        <InternalHeader />
        <div className='flex flex-1 overflow-hidden'>
            <InternalSidebar items={sidebarItems} />

                <main className='flex-1 overflow-y-auto p-4 md:p-8'>
                    <h1 className='text-3xl tracking-wide font-bayon mb-2'>{title}</h1>
                    <div className='max-w-7xl mx-auto space-y-8'>
                        {children}
                    </div>
                </main>
        </div> 
        <InternalFooter />   
    </div>
  )
}

export default InternalLayout
