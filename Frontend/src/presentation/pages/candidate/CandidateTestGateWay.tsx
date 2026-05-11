import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getTestByToken } from '../../../redux/slices/features/test/CandidateTestSlice'
import type { CandidateTestGateStep } from '../../../types/test'
import TestNotStartedPage from '../../components/candidate/test/TestNotStartedPage'
import TestExpiredPage from '../../components/candidate/test/TestExpiredPage'
import TestStartPage from '../../components/candidate/test/TestStartPage'
import TestCandidateInstructions from './TestCandidateInstructions'
import TestQuestion from './TestQuestions'


const CandidateTestGateway: React.FC = () => {
    const { token } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const { test, loading, candidate } = useSelector((state: RootState) => state.candidateTest )

    useEffect(() => {
        if (token) {
            dispatch(getTestByToken({ token }))
        }
    }, [dispatch, token])

    const step: CandidateTestGateStep = useMemo(() => {
        if (loading || !test || !candidate) return 'LOADING'
        const now = new Date()
        const startTime = new Date(test.startTime)
        const endTime = new Date(test.endTime)
        if (now < startTime) return 'NOT_STARTED'
        if (now > endTime && candidate.candidateTestStatus !== 'SUBMITTED') return 'EXPIRED'

        switch(candidate.candidateTestStatus){
            case 'INVITED': 
                return 'READY'
            case 'VERIFIED':
                return 'INSTRUCTIONS'
            case 'IN_PROGRESS': 
                return 'QUESTIONS'
            case 'TERMINATED': 
                return 'TERMINATED'
            case 'DISQUALIFIED': 
                return 'DISQUALIFIED'
            case 'SUBMITTED': 
                return 'SUBMITTED'
            case 'EXPIRED': 
                return 'EXPIRED'
            default:
                return 'READY'
                
        }
    }, [loading, test, candidate])
    if(step === 'NOT_STARTED'){
        return <TestNotStartedPage test={test} />
    }
    if(step === 'EXPIRED'){
        return <TestExpiredPage test={test} />
    }
    if(step === 'READY'){
        return <TestStartPage test={test} />
    }
    // if(step === 'LOGIN') {
    //     return <TestCandidateLogin />
    // }
    if(step === 'INSTRUCTIONS') {
        return <TestCandidateInstructions />
    }
    if (step === 'QUESTIONS') {
        if (!test || !candidate) {
            return (
                <div className="flex h-screen items-center justify-center">
                    <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
                </div>
            )
        }
        return <TestQuestion test={test} candidate={candidate} />
    }
    if(step === 'SUBMITTED') {
        return <p>submitted</p>
    }
    if(step === 'TERMINATED') {
        return <p>terminated</p>
    }
    if(step === 'DISQUALIFIED'){
        return <p>disqualified</p>
    }
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
    )
}

export default CandidateTestGateway