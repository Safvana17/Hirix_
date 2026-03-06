import React from 'react'
import HirixLogo from '../../assets/images/Logo.jpeg'

interface AuthLayoutProps {
  children: React.ReactNode
  title: string
  subtitle: string
}

const AuthLayout: React.FC <AuthLayoutProps> = ({children, title, subtitle}) => {
  return (
    <div className='min-h-screen bg-[#E6DECF] text-white flex items-center justify-center p-6'>
      <div className='max-w-5xl'>
        <div className='text-center mb-8'>
            <div className="flex items-center justify-center gap-2">
              <img
                src={HirixLogo}
                alt="hirix_logo"
                className="w-12 h-12 rounded-md"
              />
              <span className="font-irish text-6xl text-black">
                HiriX
              </span>
            </div>
              <h2 className='text-lg text-gray-600 font-medium'>{title}</h2>
              <p className='text-gray-400 mb-5'>{subtitle}</p>
          </div>

            <div className="bg-[#9A6605] rounded-md overflow-hidden shadow-xl">
               {children}
            </div>
        <div className="pt-8 text-center text-gray-500 text-xs">
          © 2026 HiriX. All rights reserved.
        </div>
      </div>
    </div>
  )
}

export default AuthLayout
