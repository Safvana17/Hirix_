import React from 'react'

type AuthRole = 'candidate' | 'company'

interface RoleSelectionProps {
    onSelect: (role: AuthRole) => void
    // mode: 'login' | 'signup'
}

const RoleSelection: React.FC<RoleSelectionProps> = ({onSelect}) => {
    
  return (
    <div className='space-y-6 m-8'>

        {/* <p className='text-white text-center mb-8'>
            Please select how would you like to {mode === 'login' ? 'sign in' : 'register'}
        </p> */}

        <div className='space-y-4 grid p-3'>
            <button 
               onClick={() => onSelect('candidate')}
               className='p-6 h-32 bg-white text-[#6B4705] rounded-xl border border-transparent hover:border-blue-500 transition text-left group mb-5'
            >
               <div className='flex items-center justify-between'>

                   <div>
                    <h3 className='text-xl font-bold group-hover:text-blue-400 transition'>Candidate</h3>
                    <p className='text-gray-400 text-sm'>Sign in as a professional looking for great opportunities </p>
                   </div>

                   <div className='text-2xl group-hover:translate-x-1 transition' >&rarr;</div>
               </div>

            </button>

            <button 
               onClick={() => onSelect('company')}
               className='p-6 bg-white h-32 text-[#6B4705] rounded-xl border border-transparent hover:border-blue-500 transition text-left group mb-5'
            >
               <div className='flex items-center justify-between'>

                   <div>
                    <h3 className='text-xl font-bold group-hover:text-blue-400 transition'>Company</h3>
                    <p className='text-gray-400 text-sm'>Sign in as a business looking for top talent. </p>
                   </div>

                   <div className='text-2xl group-hover:translate-x-1 transition' >&rarr;</div>
               </div>

            </button>

        </div>
      
    </div>
  )
}

export default RoleSelection
