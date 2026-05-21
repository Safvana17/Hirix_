import {
    Box,
    Button,
    Checkbox,
    Divider,
    Stack,
    Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import type { AppDispatch, RootState } from '../../../redux/store'
import toast from 'react-hot-toast'
import { startTest } from '../../../redux/slices/features/test/CandidateTestSlice'
import { useNavigate, useParams } from 'react-router-dom'
// import { useFullScreenMonitor } from '../../../hooks/useFullScreenMonitor'

const TestCandidateInstructions: React.FC = () => {
    const [accepted, setAccepted] = useState(false)
    const { test } = useSelector((state: RootState) => state.candidateTest)
    const dispatch = useDispatch<AppDispatch>()
    const { token } = useParams()
    const navigate = useNavigate()

    // const { enterFullScreen } = useFullScreenMonitor({
    //     enforceFullScreen: test?.rules.behavior.enforceFullScreen ?? false,
    //     onExit: () => {}
    // })

    if (!test?.rules) {
        return <div>Loading instructions...</div>
    }
    const { timing, navigation, proctoring, behavior, autoSave, warning } = test.rules

    const timingRules = [
        timing.autoSubmitOnTimeEnd &&
            'The test will be automatically submitted when time ends.',

        timing.warningBeforeEndInMinutes > 0 &&
            `You will receive a warning ${timing.warningBeforeEndInMinutes} minutes before the test ends.`,
    ].filter(Boolean) as string[]

    const navigationRules = [
        navigation.allowTabSwitch
            ?  'Tab switching is allowed.'
            : 'Tab switching or minimizing the window is not allowed.',

        navigation.shuffleQuestions &&
            'Questions will be shown in random order.',

        navigation.shuffleOptions &&
            'Options will be shown in random order.',

        navigation.allowBackNavigation
            ? 'You can go back to previous questions.'
            : 'You cannot go back to previous questions after moving forward.',
    ].filter(Boolean) as string[]

    const proctoringRules = [
        proctoring.enableCamera &&
            'Your camera must remain enabled throughout the assessment.',

        proctoring.enableCamera &&
            'Ensure your face is clearly visible during the entire test.',

        proctoring.captureSnapshots &&
            proctoring.snapshotIntervalSeconds > 0 &&
            `Snapshots may be captured every ${proctoring.snapshotIntervalSeconds} seconds for monitoring purposes.`,

        proctoring.detectNoFace &&
            'Warnings may be triggered if your face is not detected by the camera.',

        proctoring.detectMultipleFaces &&
            'Multiple face detection may trigger warnings or disqualification.',

        proctoring.detectMultipleFaces &&
            'No other person should appear in front of the camera during the assessment.',

        proctoring.enableCamera &&
            'Avoid poor lighting or covering your camera during the assessment.',

        proctoring.enableCamera &&
            'Suspicious activities may be logged and reviewed by the administrator.',
    ].filter(Boolean) as string[]

    const behaviorRules = [
        behavior.enforceFullScreen &&
            'Fullscreen mode is required during the test.',

        behavior.allowCopyPaste
            ? 'Copy and paste is allowed.'
            : 'Copy and paste is disabled.',

        behavior.allowRightClick
            ? 'Right click is allowed.'
            : 'Right click is disabled.',

        behavior.allowKeyboardShortcuts
            ? 'Keyboard shortcuts are allowed.'
            : 'Keyboard shortcuts are disabled during the test.',
    ].filter(Boolean) as string[]

    const warningRules = [
        warning.maxWarningCount > 0 &&
            `Maximum warnings allowed: ${warning.maxWarningCount}.`,

        warning.autoSubmitOnMaxWarnings &&
            'The assessment may be automatically submitted after exceeding the maximum warning limit.',
    ].filter(Boolean) as string[]

    const autoSaveRules = [
        autoSave?.enabled &&
            autoSave.intervalInSeconds > 0 &&
            `Your answers will be auto-saved every ${autoSave.intervalInSeconds} seconds.`,

        autoSave?.saveOnEveryAnswer &&
            'Your answer will be saved whenever you answer a question.',
    ].filter(Boolean) as string[]

    const handleStartTest = async() => {
        if (!accepted) {
            toast.error('Please mark that you accepted the rules')
            return
        }
        if(!token){
            toast.error("Invalid test link")
            return
        }
        try {
            if(test.rules.behavior.enforceFullScreen && !document.fullscreenElement){
                await document.documentElement.requestFullscreen()
            }

            const result = await dispatch(startTest({token})).unwrap()
            console.log("Start result status:", result.candidate.candidateTestStatus)
            navigate(`/candidate/test/${token}`)

        } catch (error) {
            toast.error(typeof error === 'string' ? error : 'Failed to start test')
        }
    }

    return (
        <Box
            sx={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                background:
                    'radial-gradient(circle at top, #123B63 0%, #02182C 42%, #050505 100%)',
                px: 2,
                py: 5,
            }}
        >
            <Box
                sx={{
                    width: '100%',
                    maxWidth: 760,
                    borderRadius: 5,
                    overflow: 'hidden',
                    bgcolor: '#FFFFFF',
                    boxShadow: '0 30px 90px rgba(0,0,0,0.45)',
                }}
            >
                <Box
                    sx={{
                        px: { xs: 3, sm: 5 },
                        py: 4,
                        color: '#fff',
                        background:
                            'linear-gradient(135deg, #02182C 0%, #0A2E4E 55%, #155A91 100%)',
                    }}
                >
                    <Typography
                        sx={{
                            fontSize: { xs: 28, sm: 38 },
                            fontWeight: 700,
                            lineHeight: 1.2,
                        }}
                    >
                        Test Instructions
                    </Typography>

                    <Typography
                        sx={{
                            mt: 1.5,
                            color: 'rgba(234,244,255,0.82)',
                            fontSize: 16,
                        }}
                    >
                        Please read all instructions carefully before starting the test.
                    </Typography>

                    <Typography
                        sx={{
                            mt: 2,
                            color: '#EAF4FF',
                            fontSize: 15,
                            fontWeight: 600,
                        }}
                    >
                        {test.name} • {test.questions?.length ?? 0} Questions
                    </Typography>
                </Box>

                <Box sx={{ px: { xs: 3, sm: 5 }, py: 4 }}>
                    <Stack spacing={4}>
                        <RuleSection title="Timing Rules" rules={timingRules} />

                        <RuleSection
                            title="Navigation Rules"
                            rules={navigationRules}
                        />

                        <RuleSection
                            title="Proctoring Rules"
                            rules={proctoringRules}
                        />

                        <RuleSection
                            title="Behavior Rules"
                            rules={behaviorRules}
                        />

                        <RuleSection
                            title="Warning Rules"
                            rules={warningRules}
                        />

                        <RuleSection
                            title="Auto-save Rules"
                            rules={autoSaveRules}
                        />

                        <Divider />

                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'flex-start',
                                gap: 1,
                                p: 2,
                                borderRadius: 3,
                                bgcolor: '#F8FAFC',
                                border: '1px solid #E5E7EB',
                            }}
                        >
                            <Checkbox
                                checked={accepted}
                                onChange={(event) =>
                                    setAccepted(event.target.checked)
                                }
                                sx={{ mt: -0.5 }}
                            />

                            <Typography
                                sx={{
                                    fontSize: 14.5,
                                    color: '#374151',
                                    lineHeight: 1.7,
                                }}
                            >
                                I have read and understood all the instructions,
                                rules, and monitoring policies. I agree to follow
                                them during the test.
                            </Typography>
                        </Box>

                        <Button
                            variant="contained"
                            disabled={!accepted}
                            onClick={handleStartTest}
                            sx={{
                                py: 1.5,
                                borderRadius: 999,
                                textTransform: 'none',
                                fontWeight: 700,
                                bgcolor: '#025614',
                                boxShadow: '0 10px 24px rgba(2,86,20,0.25)',
                                '&:hover': {
                                    bgcolor: '#087A27',
                                },
                                '&.Mui-disabled': {
                                    bgcolor: '#9CA3AF',
                                    color: '#fff',
                                },
                            }}
                        >
                            Start Test
                        </Button>
                    </Stack>
                </Box>
            </Box>
        </Box>
    )
}

interface RuleSectionProps {
    title: string
    rules: string[]
}

const RuleSection: React.FC<RuleSectionProps> = ({ title, rules }) => {
    if (rules.length === 0) return null

    return (
        <Box>
            <Typography
                sx={{
                    fontWeight: 700,
                    fontSize: 18,
                    mb: 2,
                    color: '#111827',
                }}
            >
                {title}
            </Typography>

            <Stack spacing={1.3}>
                {rules.map((rule, index) => (
                    <Typography
                        key={index}
                        sx={{
                            fontSize: 14.5,
                            color: '#4B5563',
                            lineHeight: 1.7,
                        }}
                    >
                        • {rule}
                    </Typography>
                ))}
            </Stack>
        </Box>
    )
}

export default TestCandidateInstructions