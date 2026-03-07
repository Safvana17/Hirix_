import React from 'react'

const InternalFooter: React.FC= () => {
  return (
    <footer className='py-6 px-8 border-t border-white bg-[#f5f0e8] text-center'>
        <div className='flex flex-col justify-between items-center gap-4 text-xs font-medium tracking-wide'>
            <p>© 2026 HIRIX PLATFORM. ALL RIGHTS RESERVED.</p>
            <div className='flex gap-6'>
                <button className="hover:text-gray-600 transition-colors">PRIVACY POLICY</button>
                <button className="hover:text-gray-600 transition-colors">TERMS & CONDITIONS</button>
                <button className="hover:text-gray-600 transition-colors">HELP</button>
            </div>
        </div>
    </footer>
  )
}

export default InternalFooter
