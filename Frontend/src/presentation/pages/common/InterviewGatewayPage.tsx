import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getInterviewAccess } from '../../../redux/slices/features/interview/CompanyInterviewSlice'
import InterviewReadyPage from '../../components/company/interview/InterviewReadyPage'
import InterviewErrorPage from '../../components/company/interview/InterviewErrorPage'
import InterviewRoomPage from '../../components/company/interview/InterviewRoomPages'
import InterviewCompletedPage from '../../components/company/interview/interviewCompletedPage'

const InterviewGateWayPage: React.FC = () => {
    const { token } = useParams()
    const { roomId } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const { accessInterview } = useSelector((state: RootState) => state.companyInterview )

    useEffect(() => {
        if (token && roomId ) {
            dispatch(getInterviewAccess({ token, roomId }))
        }
    }, [dispatch, token, roomId])

    // const step: InterviewJoinStatus = useMemo(() => {
    //     if (loading || !accessInterview) return 'LOADING'
    //     const now = new Date()
    //     const startTime = new Date(accessInterview.startTime)
    //     const endTime = new Date(accessInterview.endTime)
    //     if (now < startTime) return 'NOT_STARTED'
    //     if (now > endTime && accessInterview.status === 'EXPIRED') return 'EXPIRED'
    //     // console.log("Gateway candidate status:", candidate?.candidateTestStatus)
    //     switch(accessInterview.status){
    //         case 'WAITING': 
    //             return ''
    //         case 'VERIFIED':
    //             return 'INSTRUCTIONS'
    //         case 'IN_PROGRESS': 
    //             return 'QUESTIONS'
    //         case 'TERMINATED': 
    //             return 'TERMINATED'
    //         case 'DISQUALIFIED': 
    //             return 'DISQUALIFIED'
    //         case 'SUBMITTED': 
    //             return 'SUBMITTED'
    //         case 'EXPIRED': 
    //             return 'EXPIRED'
    //         default:
    //             return 'READY'
                
    //     }
    // }, [loading, accessInterview])

    if(!accessInterview){
        console.log('not found')
        return
    }
    if(accessInterview.status === 'WAITING'){
        return <InterviewReadyPage interview={accessInterview} />
    }
    if(accessInterview.status === 'EXPIRED'){
        return <InterviewErrorPage />
    }
    if(accessInterview.status === 'LIVE'){
        return <InterviewRoomPage />
    }
    if(accessInterview.status === 'COMPLETED') {
        return <InterviewCompletedPage />
    }
    if(accessInterview.status === 'CANCELLD'){
        return <InterviewErrorPage />
    }
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
    )
}

export default InterviewGateWayPage