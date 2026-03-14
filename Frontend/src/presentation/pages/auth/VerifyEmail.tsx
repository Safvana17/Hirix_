import React, { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import AuthLayout from '../../layouts/AuthLayout';
import { toast } from 'react-hot-toast';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../../redux/store';
import { verifyEmail } from '../../../redux/slices/features/auth/authSlice';

const VerifyCompanyEmail: React.FC = () => {
    const [searchParams] = useSearchParams();
    const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
    const [message, setMessage] = useState('Verifying your email...');
    const token = searchParams.get('token');
    const dispatch = useDispatch<AppDispatch>()

    useEffect(() => {
        const verify = async () => {
            if (!token) {
                setStatus('error');
                setMessage('Missing verification token.');
                return;
            }

            try {
                const response = await dispatch(verifyEmail({token})).unwrap()
                setStatus('success')
                setMessage(response || 'Email verified successfully')
                toast.success('Verification successfull')
            } catch (error) {
                setStatus('error')
                setMessage(typeof error === 'string' ? error: 'Verification failed')
                toast.error('Verification failed')
            }
        };

        verify();
    }, [token, dispatch]);

    return (
        <AuthLayout title="Email Verification" subtitle="Securing your Hirix account">
            <div className="bg-gray-800/50 backdrop-blur-xl border border-gray-700/50 rounded-3xl p-8 text-center space-y-6">
                {status === 'loading' && (
                    <div className="flex flex-col items-center gap-4">
                        <Loader2 className="w-12 h-12 text-indigo-500 animate-spin" />
                        <p className="text-gray-300 font-medium">{message}</p>
                    </div>
                )}

                {status === 'success' && (
                    <div className="flex flex-col items-center gap-4">
                        <CheckCircle className="w-16 h-16 text-emerald-500" />
                        <h3 className="text-xl font-bold text-white">Verified!</h3>
                        <p className="text-gray-400">{message}</p>
                        <Link 
                            to="/login" 
                            className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 rounded-xl transition mt-4 inline-block"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}

                {status === 'error' && (
                    <div className="flex flex-col items-center gap-4">
                        <XCircle className="w-16 h-16 text-rose-500" />
                        <h3 className="text-xl font-bold text-white">Oops!</h3>
                        <p className="text-gray-400">{message}</p>
                        <Link 
                            to="/login" 
                            className="w-full bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 rounded-xl transition mt-4 inline-block"
                        >
                            Back to Login
                        </Link>
                    </div>
                )}
            </div>
        </AuthLayout>
    );
};

export default VerifyCompanyEmail;
