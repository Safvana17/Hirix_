import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useParams } from 'react-router-dom'
import type { AppDispatch, RootState } from '../../../redux/store'
import { getInterviewAccess } from '../../../redux/slices/features/interview/CompanyInterviewSlice'
import InterviewReadyPage from '../../components/common/InterviewReadyPage'
import InterviewErrorPage from '../../components/common/InterviewErrorPage'
import InterviewRoomPage from '../../components/common/InterviewRoomPages'
import InterviewCompletedPage from '../../components/common/interviewCompletedPage'

const InterviewGateWayPage: React.FC = () => {
    const { token } = useParams()
    const { roomId } = useParams()
    const dispatch = useDispatch<AppDispatch>()
    const { accessInterview, loading, error, canJoin } = useSelector((state: RootState) => state.companyInterview )

    useEffect(() => {
        if (token && roomId ) {
            dispatch(getInterviewAccess({ token, roomId }))
        }
    }, [dispatch, token, roomId])

    console.log('candidate reached here...')

    if (loading) {
        return (
            <div className="flex h-screen items-center justify-center text-black">
                Loading...
            </div>
        )
    }

    if (error) {
        return <InterviewErrorPage />
    }

    if (!accessInterview) {
        return (
            <div className="flex h-screen items-center justify-center">
                No interview found
            </div>
        )
    }

    if(canJoin){
        console.log("moving here...1")
        return <InterviewRoomPage interview={accessInterview} />
    }
    if(accessInterview.status === 'READY'){
        console.log("moving here...3")
        return <InterviewReadyPage interview={accessInterview} />
    }
    if(accessInterview.status === 'WAITING'){
        console.log("moving here...2")
        return <InterviewReadyPage interview={accessInterview} />
    }

    if(accessInterview.status === 'EXPIRED'){
        return <InterviewErrorPage />
    }
    if(accessInterview.status === 'LIVE'){
        return <InterviewReadyPage interview={accessInterview} />
    }
    if(accessInterview.status === 'COMPLETED') {
        return <InterviewCompletedPage />
    }
    if(accessInterview.status === 'CANCELLED'){
        return <InterviewErrorPage />
    }
    return (
        <div className="flex h-screen items-center justify-center">
            <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
        </div>
    )
}

export default InterviewGateWayPage