import React, { useEffect, useRef, useState } from 'react'
import AuthLayout from '../../layouts/AuthLayout'
import { useLocation, useNavigate } from 'react-router-dom'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import { clearError, resendOtp, verifyOtp, verifyOtpForForgotPassword } from '../../../redux/slices/features/auth/authSlice'
import toast from 'react-hot-toast'

const VerifyOtp: React.FC = () => {

    const [otp, setOtp] = useState<string[]>(Array(6).fill(''))
    const [timeLeft, setTimeLeft] = useState(120)
    const inputRef = useRef<(HTMLInputElement | null)[]>([])
    const { loading, error } = useSelector((state: RootState) => state.auth)
    const dispatch = useDispatch<AppDispatch>()
    const location = useLocation()
    const navigate = useNavigate()

    const email = location.state?.email
    const role = location.state?.role
    const type = location.state?.type
  

    useEffect(() => {
        if(!email){
            navigate('/signup')
        }
        return () => {
            dispatch(clearError())
        }
    }, [email, navigate, dispatch])


    useEffect(() => {
        if(timeLeft <= 0) return
        const timer = setInterval(() => {
            setTimeLeft(prev => prev - 1)
        }, 1000)

        return () => clearInterval(timer)
    }, [timeLeft])

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds/ 60)
        const remainingSeconds = Math.floor(seconds % 60)
        return `0${minutes} :${remainingSeconds < 10 ? ' 0' : ' '}${remainingSeconds} `
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
        
        const value = e.target.value
        if(isNaN(Number(value))) return false

        const newOtp = [...otp]
        newOtp[index] = value
        setOtp(newOtp)
    
        // setOtp([...otp.map((value, idx) => idx === index ? e.value : value)])
        
        if(index < 5 && value){
            inputRef.current[index+1]?.focus()
        }
    }

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number): void => {
        
        if(e.key === 'Backspace'){
            if(otp[index]){
                const newOtp = [...otp]
                newOtp[index] = ''
                setOtp(newOtp)
            }else if(index > 0){
                inputRef.current[index - 1]?.focus()
            }
        }
    }


    const handleSubmit = async(e: React.FormEvent) => {
        e.preventDefault()
        const otpValue = otp.join('')
        
        if(type === 'forgotpassword'){
            const result = await dispatch(verifyOtpForForgotPassword({role, email, otp: otpValue}))
            if(verifyOtpForForgotPassword.fulfilled.match(result)){
                toast.success('OTP Verified, please reset your password')
                navigate(`/${role}/resetpassword`, {
                    state: {
                        email: result.payload.email,
                        resetToken: result.payload.resetToken
                    }
                })
            }else{
                toast.error(result.payload || 'Invalid OTP')
            }
        }else{
            const result = await dispatch(verifyOtp({role, otp: otpValue, email}))
            if(verifyOtp.fulfilled.match(result)){
               toast.success('Your OTP has been verified successfully, Please login.')
               navigate(`/login`)
            }else{
                toast.error(result.payload || 'Invalid OTP')
            }
        }
    }

    const handleResendOtp = async() => {
        const result = await dispatch(resendOtp({role, email}))
        if(resendOtp.fulfilled.match(result)){
            toast.success('OTP Sent successfully, Please check your Email.')
            setTimeLeft(120)
        }
    }

    const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
        const pasteData = e.clipboardData.getData('text').slice(0, 6)
        if(!/^\d+$/.test(pasteData)) return

        const newOtp = pasteData.split('')
        setOtp([...newOtp, ...Array(6 - newOtp.length).fill('')])

        inputRef.current[Math.min(pasteData.length, 5)]?.focus()
    }

    return (
    <AuthLayout title='Verify OTP' subtitle={`Enter the OTP sent to ${email}`}>
     <div className='flex justify-center'>
      <form onSubmit={handleSubmit} className='p-10 text-white space-y-8'>
        <div className='flex justify-between gap-3'>
         { otp.map((data, index) => (
            <input 
               key={index}
               ref={(el) => {inputRef.current[index] = el}}
               type='text'
               data-index={index}
               maxLength={1}
               value={data}
               onChange={(e) => handleChange(e, index)}
               onFocus={(e) => e.target.select()}
               onKeyDown={(e) => handleKeyDown(e, index)}
               onPaste={handlePaste}
               className='w-12 h-14 bg-white rounded-md text-center text-2xl font-bold text-black focus:outline-none transition focus:border-[#5C3C02]'
            />
         ))}
        </div>
        <div>
            <p className='text-gray-300'>Remaining Time: <span className='text-white font-bold text-xl'>{formatTime(timeLeft)}</span></p>
        </div>

        {error && <p className='text-[#FBBEBE] text-sm '>{error}</p>}
        <div className='text-center'> 
        <button type='submit' disabled={loading || otp.join('').length < 6} className='w-30 bg-[#E9C788] disabled:bg-gray-500 hover:bg-[#6B4705] text-white font-bold py-4 rounded-xl transition duration-200'>
            {loading ? 'Verifying...' : 'Verify OTP'}
        </button>
        </div>
        {timeLeft === 0 &&
            <div className="text-center text-sm text-gray-300">
                Didn't receive the code?{' '}
                <button type="button" onClick={handleResendOtp} className='text-white hover:underline font-medium disabled:opacity-30' disabled={timeLeft > 0}>
                    Resend OTP
                </button>
            </div>
}
      </form>
      </div>
    </AuthLayout>
  )
}

export default VerifyOtp
