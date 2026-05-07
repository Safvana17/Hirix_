import React, { useEffect, useMemo } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getTestByToken } from '../../../redux/slices/features/test/CandidateTestSlice'
import type { CandidateTestGateStep } from '../../../types/test'
import TestNotStartedPage from '../../components/candidate/test/TestNotStartedPage'
import TestExpiredPage from '../../components/candidate/test/TestExpiredPage'
import TestStartPage from '../../components/candidate/test/TestStartPage'

const CandidateTestGateway: React.FC = () => {
    const { token } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const { test, loading } = useSelector((state: RootState) => state.candidateTest )

    console.log('token: ', token)
    useEffect(() => {
        if (token) {
            dispatch(getTestByToken({ token }))
        }
    }, [dispatch, token])

    const step: CandidateTestGateStep = useMemo(() => {
        if (loading || !test) return 'LOADING'
        const now = new Date()
        const startTime = new Date(test.startTime)
        const endTime = new Date(test.endTime)
        if (now < startTime) return 'NOT_STARTED'
        if (now > endTime) return 'EXPIRED'
        return 'READY'
    }, [loading, test])
    console.log('test from candidate: ', test)

    // if (step === 'LOADING') {
    //     return <div>Loading...</div>
    // }

    // if (step === 'NOT_STARTED') {
    //     return <TestNotStartedPage test={test} />
    // }

    // if (step === 'EXPIRED') {
    //     return <div>Test expired</div>
    // }

    return (
        <div className="min-h-screen">
            {step === 'NOT_STARTED' ? (
               <TestNotStartedPage test={test} />
            ): ( step === 'EXPIRED' ? (
                <TestExpiredPage test={test} />
            ): ( step === 'READY' ? (
                <TestStartPage test={test} />
            ): (
                <p>hi</p>
            )))}
        </div>
    )
}

export default CandidateTestGateway