import React from 'react'
import type { LucideIcon } from 'lucide-react'
import { NavLink } from 'react-router-dom';

export interface SidebarItems {
    label: string;
    icon: LucideIcon;
    path: string
}
interface InternalSidebarProps {
    items: SidebarItems[]
}
const InternalSidebar: React.FC<InternalSidebarProps> = ({items}) => {

    
  return (
    <aside className='bg-[#6B4705] w-54 min-h-screen flex flex-col text-white shadow-2xl'>
        <div className='flex-1 py-4'>
            <nav className='space-y-1 px-5'>
                {items.map((item) => (
                    <NavLink 
                        key={item.path}
                        to={item.path}
                        className={({isActive}) => 
                            `flex items-center gap-4 py-3 rounded-lg transition-all duration-200 group ${isActive 
                                ? 'bg-white text-[#6B4705] shadow-inner'
                                : 'hover:bg-white hover:text-[#6B4705]'
                            }`
                        }
                    >
                      <item.icon className='w-5 h-5  opacity-70 group-hover:opacity-100 transition-opacity' />
                      <span className='text-sm font-medium'>{item.label}</span>
                    </NavLink>
                ))}
            </nav>
        </div>
    </aside>
  )
}

export default InternalSidebar
