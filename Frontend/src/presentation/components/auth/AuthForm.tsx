import React, { useState } from 'react'
import { useGoogleLogin } from '@react-oauth/google'
import type { UserRole } from '../../../constants/role'
import LoginImage from '../../../assets/images/LoginImage.jpg'
import signupImage from '../../../assets/images/SignupImage.jpg'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { Link, useNavigate } from 'react-router-dom'
import { loginUser, registerUser, googleLogin } from '../../../redux/slices/features/auth/authSlice'
import toast from 'react-hot-toast'
import { loginSchema, registerSchema } from '../../../lib/validation/authValidation'
import { ZodError } from 'zod'
import { requestRestoreAccountEmail } from '../../../redux/slices/features/settingsSlice.ts/companySettingsSlice'



interface AuthFormProps {
    mode: 'login' | 'signup'
    role: UserRole
    onBack: () => void
}

const AuthForm: React.FC<AuthFormProps> = ({mode, role}) => {

    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    })

    const [error, setError] = useState<Record<string, string>>({})
    const dispatch = useDispatch<AppDispatch>()
    const {loading} = useSelector((state: RootState) => state.auth)
    const navigate = useNavigate()

    const validate = () => {
        try {
            if(mode === 'signup'){
                registerSchema.parse(formData)
            }else{
                loginSchema.parse({email: formData.email, password: formData.password })
            }
            setError({})
            return true
        } catch (error) {
            if(error instanceof ZodError){
                const errors: Record<string, string> = {}
                error.issues.forEach((issue) => {
                    const field = issue.path[0] 
                    if(typeof field === 'string' ||typeof field === 'number')
                       errors[field] = issue.message
                })
                setError(errors)
            }
            return false
        }
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()

        if(!validate()) return

        if(mode === 'signup'){
            const result = await dispatch(registerUser({
                role,
                data: {
                    name: formData.name,
                    email: formData.email,
                    password: formData.password,
                    confirmPassword: formData.confirmPassword
                }
            }))

            if(registerUser.fulfilled.match(result)){
                if(role === 'company') {
                    toast.success('Registration submitted! Please wait for admin approval. You will get emil once approved.', {duration: 6000})
                }else{
                    toast.success('Registration successful. Please verify your OTP')
                    navigate(`/${role}/verifyotp`, {state: {email: formData.email, role}})
                }
            }else{
                toast.error(result.payload || 'Registarion failed')
            }
        }else{
            const result = await dispatch(loginUser({
                role,
                data: {
                    email: formData.email,
                    password: formData.password
                }
            }))

            if(loginUser.fulfilled.match(result)){
                toast.success('Welcome Back!')
                navigate(`/${role}/dashboard`)
            }else{
                const errorMsg = result.payload as string;
                console.log("Full Error Message:", errorMsg);
                if (errorMsg.includes('pending admin verification')) {
                    toast.error('Your account is pending admin approval. We will notify you via email.');
                }else if(errorMsg.toLowerCase().includes('deactivated')){
                    toast.error('Your account is deactivated. We have sent a restore link to your email.');
                    const Role = role === 'company' ? 'Company' : 'Candidate'
                    dispatch(requestRestoreAccountEmail({email: formData.email, role: Role}))
                }else if (errorMsg.includes('rejected')) {
                    toast.error('Your registration was rejected by the admin.');
                } else if (errorMsg.includes('blocked')) {
                    toast.error('Your account has been blocked. Please contact support.');
                } else if (errorMsg.includes('Email verification required')) {
                    toast.error('Email verification required. Check your inbox for the link.');
                } else {
                    toast.error(errorMsg || 'Login failed');
                }
            }
        }
    }

    const googleAuth = useGoogleLogin({
        flow: "implicit",
        onSuccess: async (tokenResponse) => {
            const result = await dispatch(googleLogin({
                role,
                token: tokenResponse.access_token
            }))

            if(googleLogin.fulfilled.match(result)){
                toast.success('Google Login Successfull')
                navigate(`/${role}/dashboard`)
            }else{
                    const errorMsg = result.payload as string;
                if (errorMsg.includes('pending admin verification')) {
                    toast.error('Your account is pending admin approval. We will notify you via email.');
                } else if (errorMsg.includes('rejected')) {
                    toast.error('Your registration was rejected by the admin.');
                } else if (errorMsg.includes('blocked')) {
                    toast.error('Your account has been blocked. Please contact support.');
                } else if (errorMsg.includes('Email verification required')) {
                    toast.error('Email verification required. Check your inbox for the link.');
                } else {
                    toast.error(errorMsg || 'Login failed');
                }
            }
        },
        onError: () => {
            toast.error('Google Login Failed')
        }
    })

    const AuthImage = mode === 'login' ? LoginImage : signupImage
    const accentColor = role === 'candidate' ? 'blue' : 'indigo';
    // const accentClass = role === 'candidate' ? 'border-blue-500 focus:border-blue-500 bg-blue-600 hover:bg-blue-700' : 'border-indigo-500 focus:border-indigo-500 bg-indigo-600 hover:bg-indigo-700';
    const textAccentClass = role === 'candidate' ? 'text-blue-400' : 'text-indigo-400';
  return (
    <div className='grid grid-cols-1 md:grid-cols-2 min-h-[600px]'>
        {/* Left section */}
       <div className='relative'>
         <img src={AuthImage} alt="Auth image" className='w-full md:h-full object-cover'/>
         <div className="absolute inset-0 bg-[#9A6605] opacity-50" />
       </div>

       {/* Right section */}
       <div className='bg-[#9A6605] p-8 md:p-12 flex flex-col justify-center'>

         {/* Google button */}
         <button onClick={() => googleAuth()} className='cursor-pointer bg-[#D9D9D9] hover:bg-white rounded-full text-black py-4 px-4 flex items-center justify-center gap-3 font-medium text-xl mb-6 hover:shadow-lg transition'>
            <img src="https://www.svgrepo.com/show/475656/google-color.svg" alt="google" className='w-5 h-5' />
            Continue with Google
         </button>
         <div className='flex items-center gap-3 mb-6'>
           <div className='flex-1 h-px bg-white/40' />
           <span className='text-white text-sm'>Or</span>
           <div className='flex-1 h-px bg-white/40' />
         </div>

         {/* Form */}
         <form className='space-y-4' onSubmit={handleSubmit}>

            {mode === 'signup' && (
                <div>
                    <label className='block text-sm font-medium text-white mb-1'>
                        {role === 'company' ? 'Company Name' : 'Full Name'}
                    </label>
                    <input 
                       type='text'
                       className={`w-full bg-[#EDE0E0] border ${error.name ? 'border-red-500' : 'border-white'} rounded-xl px-4 py-3 text-black focus:outline-none transition focus:border-${accentColor} -500`} 
                       placeholder={role === 'company' ? 'Company name' : 'Candidate name'}
                       onChange={(e) => setFormData({...formData, name: e.target.value})}
                       />
                       {error.name && <p className='text-[#FBBEBE] text-xs mt-1'>{error.name}</p>}
                </div>
            )}

            <div>
                <label className='block text-sm font-medium text-white mb-1'>
                    {role === 'company' ? 'Business Email' : 'Email Address'}
                </label>
                <input 
                    type="email" 
                    className={`w-full bg-[#EDE0E0] border ${error.email ? 'border-red-500' : 'border-white'} rounded-xl px-4 py-3 text-black focus:outline-none transition focus:border-${accentColor}-500`}
                    placeholder={role === 'company' ? 'example@company.com' : 'example@candidate.com'}
                    onChange={(e) => setFormData({...formData, email: e.target.value})} 
                    />

                    {error.email && <p className='text-[#FBBEBE] text-xs mt-1'>{error.email}</p>}
            </div>

            <div>
                <label className='block text-sm font-medium text-white mb-1'>
                    Password
                </label>
                <input 
                    type="password" 
                    className={`w-full bg-[#EDE0E0] border ${error.password ? 'border-red-500' : 'border-white'} rounded-xl px-4 py-3 text-black focus:outline-none transition focus:border-${accentColor}-500`}
                    placeholder="••••••••"
                    onChange={(e) => setFormData({...formData, password: e.target.value})} 
                    />

                    {error.password && <p className='text-[#FBBEBE] text-xs mt-1'>{error.password}</p>}
            </div>

            {mode === 'signup' && (
                <div>
                    <label className='block text-sm font-medium text-white mb-1'>
                        Confirm Password
                    </label>
                    <input 
                        type="password" 
                        className={`w-full bg-[#EDE0E0] border ${error.confirmPassword ? 'border-red-500' : 'border-white'} rounded-xl px-4 py-3 text-black focus:outline-none transition focus:border-${accentColor}-500`}
                        placeholder="••••••••"
                        onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})} 
                    />

                    {error.confirmPassword && <p className='text-[#FBBEBE] text-xs mt-1'>{error.confirmPassword}</p>}
                </div>
            )}

            <button 
                type='submit'
                disabled={loading}
                className={`cursor-pointer w-full bg-[#E9C788] hover:bg-[#6B4705] text-white font-bold py-3 rounded-xl mt-4 transition duration-200 disabled:opacity-50 shadow-lg shadow-blue-900/20`}
                >
                {loading ? (mode === 'login' ? 'Loggin in...' : 'Processing...') : (mode === 'login' ? 'Sign In' : 'Register Account')}
            </button>

            <div className='text-center text-sm text-gray-400 mt-6'>
                {mode === 'login' ? (
                    <>
                       New to Hirix? {' '}
                       <Link to="/signup" className={`${textAccentClass} hover:underline font-medium`}>
                         Create Account
                       </Link> 
                    </>
                ): (
                    <>
                      Already have an account? {' '}
                      <Link to="/login" className={`${textAccentClass} hover:underline font-medium`}>
                        Sign In
                      </Link>
                    </>
                )}
            </div>

            {mode === 'login' && (
                <div className='text-center text-sm'>
                    <Link to={`/${role}/forgotpassword`} state={role} className='text-white hover:text-gray-500 transition'>
                       Forgot Password
                    </Link>
                </div>
            )}
         </form>
       </div>
    </div>
  )
}

export default AuthForm
