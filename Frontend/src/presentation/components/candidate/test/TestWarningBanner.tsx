import React from 'react'
import { Box, IconButton, Typography } from '@mui/material'
import CloseRoundedIcon from '@mui/icons-material/CloseRounded'
import WarningAmberRoundedIcon from '@mui/icons-material/WarningAmberRounded'

interface TestWarningBannerProps {
    warningCount: number
    maxWarningCount: number
    message: string
    onClose?: () => void
}

const TestWarningBanner: React.FC<TestWarningBannerProps> = ({
    warningCount,
    maxWarningCount,
    message,
    onClose,
}) => {
    const remainingWarnings = Math.max(maxWarningCount - warningCount, 0)

    return (
        <Box
            sx={{
                bgcolor: '#C90000',
                color: '#fff',
                px: { xs: 2, md: 5 },
                py: 2.5,
                mb: 3,
                borderRadius: 0,
                display: 'flex',
                alignItems: 'flex-start',
                gap: 2,
                boxShadow: '0 12px 30px rgba(0,0,0,0.25)',
            }}
        >
            <WarningAmberRoundedIcon sx={{ mt: 0.4 }} />

            <Box sx={{ flex: 1 }}>
                <Typography sx={{ fontSize: 22, fontWeight: 800 }}>
                    Warning {warningCount} of {maxWarningCount}
                </Typography>

                <Typography sx={{ mt: 0.5, fontSize: 14 }}>
                    {message}
                </Typography>

                <Typography sx={{ mt: 1, fontSize: 14 }}>
                    {remainingWarnings > 0
                        ? `${remainingWarnings} warning remaining before test termination`
                        : 'Maximum warnings reached. Test will be terminated.'}
                </Typography>
            </Box>

            {onClose && (
                <IconButton size="small" onClick={onClose} sx={{ color: '#fff' }}>
                    <CloseRoundedIcon fontSize="small" />
                </IconButton>
            )}
        </Box>
    )
}

export default TestWarningBanner