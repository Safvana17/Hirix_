import React from 'react'
import HirixLogo from '../../../assets/images/Logo.jpeg'
import { Link } from 'react-router-dom'

// const Footer: React.FC = () => {
//   return (
//     <footer className='bg-black text-white py-16 px-12'>

//       <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
//           <div className="space-y-6">
//             <div className='flex items-center gap-2 mr-5'>
//               <div>
//                 <img src={HirixLogo} alt="hirix_logo" className='w-10 h-10 rounded-md'/>
//               </div>
//               <span className='font-irish text-white text-4xl font-bold tracking-[0.15em]'>HiriX</span>
//             </div>
//           </div>

//           <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
          
//           <div>

//             <h4 className='font-bold mb-6 text-sm uppercase tracking-wider'>Company</h4>
//             <ul className='space-y-4 text-gray-500 text-sm'>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//             </ul>

//           </div>

//           <div>

//             <h4 className='font-bold mb-6 text-sm uppercase tracking-wider'>Company</h4>
//             <ul className='space-y-4 text-gray-500 text-sm'>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//             </ul>

//           </div>

//           <div>

//             <h4 className='font-bold mb-6 text-sm uppercase tracking-wider'>Company</h4>
//             <ul className='space-y-4 text-gray-500 text-sm'>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//             </ul>

//           </div>

//           <div>

//             <h4 className='font-bold mb-6 text-sm uppercase tracking-wider'>Company</h4>
//             <ul className='space-y-4 text-gray-500 text-sm'>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//               <li><Link to='/about' className='hover:text-white transition'>About</Link></li>
//             </ul>

//           </div>
//         </div>

//       </div>

//       <div className="pt-8 border-t border-gray-900 flex flex-col md:flex-row justify-center items-center gap-4 text-gray-600 text-xs">
//          <p>© 2026 HiriX. All rights reserved.</p>
//       </div>

//     </footer>
//   )
// }

// export default Footer


const Footer: React.FC = () => {
  return (
    <footer className="bg-black text-white py-16 px-12">

      <div className="max-w-7xl mx-auto">

        {/* Top Section */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-12 mb-12">

          {/* Logo */}
          <div>
            <div className="flex items-center gap-2">
              <img
                src={HirixLogo}
                alt="hirix_logo"
                className="w-10 h-10 rounded-md"
              />
              <span className="font-irish text-3xl tracking-[0.15em]">
                HiriX
              </span>
            </div>
          </div>

          {/* Column 1 */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">
              Company
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/about" className="hover:text-white transition">About Us</Link></li>
              <li><Link to="/" className="hover:text-white transition">How It Works</Link></li>
              <li><Link to="/" className="hover:text-white transition">Careers</Link></li>
              <li><Link to="/" className="hover:text-white transition">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 2 */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">
              For Clients
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white transition">Find Freelancers</Link></li>
              <li><Link to="/" className="hover:text-white transition">Post a Job</Link></li>
              <li><Link to="/" className="hover:text-white transition">Employers Dashboard</Link></li>
            </ul>
          </div>

          {/* Column 3 */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">
              For Candidates
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white transition">Find Work</Link></li>
              <li><Link to="/" className="hover:text-white transition">Freelancers</Link></li>
              <li><Link to="/" className="hover:text-white transition">Featured Jobs</Link></li>
            </ul>
          </div>

          {/* Column 4 */}
          <div>
            <h4 className="font-bold mb-6 text-sm uppercase tracking-wider">
              Resources
            </h4>
            <ul className="space-y-4 text-gray-400 text-sm">
              <li><Link to="/" className="hover:text-white transition">Help & Support</Link></li>
              <li><Link to="/" className="hover:text-white transition">Terms & Conditions</Link></li>
              <li><Link to="/" className="hover:text-white transition">Privacy Policy</Link></li>
              <li><Link to="/" className="hover:text-white transition">FAQ</Link></li>
            </ul>
          </div>

        </div>

        {/* Bottom Section */}
        <div className="pt-8 border-t border-gray-800 text-center text-gray-500 text-xs">
          © 2026 HiriX. All rights reserved.
        </div>

      </div>
    </footer>
  );
};

export default Footer;