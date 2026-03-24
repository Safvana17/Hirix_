import { TrendingDown, TrendingUp, type LucideIcon } from 'lucide-react'
import React from 'react'


interface SummeryCardProps {
   label: string
   value: string | number
   icon: LucideIcon
   trend?: string
   color: string
   bg: string
}


const SummeryCard: React.FC<SummeryCardProps>= ({label, value, icon: Icon, trend, color, bg}) => {

    const isPositive = trend ?.startsWith('+')
return (
    <div className='bg-white rounded-xl p-6 shadow-sm hover:shadow-md transition-all duration-300'>
        <div className='flex justify-between items-start mb-4'>
            <div className={`${bg} ${color} p-3 rounded-xl shadow-inner`}>
              <Icon className='w-5 h-5' />
            </div>
            { trend && (
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${isPositive ? 'bg-green-50 text-green-600' : 'bg-red-50 text-red-600'} flex items-center gap-1 border ${isPositive ? 'border-green-500' : 'border-red-500'}`}>
                    {isPositive ? <TrendingUp className='w-3 h-3' /> : <TrendingDown className='w-3 h-3' />}
                    {trend}
                </span>
            )}
        </div>
       <h3 className='text-2xl font-bold text-gray-800 tracking-tight'>{value}</h3>
       <p className='text-gray-400 text-xs font-bold uppercase tracking-widest mt-.15'>{label}</p>
    </div>
  )
}

export default React.memo(SummeryCard)
