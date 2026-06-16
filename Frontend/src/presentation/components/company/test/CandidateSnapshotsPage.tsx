import { Box, Button, Card, CardContent, CardMedia, Container, Dialog, Grid, IconButton, Typography } from '@mui/material'
import React, { useEffect, useState } from 'react'
import type { AppDispatch, RootState } from '../../../../redux/store'
import { useDispatch, useSelector } from 'react-redux'
import { getSnapshots } from '../../../../redux/slices/features/test/companyTestSlice'
import { useNavigate, useParams } from 'react-router-dom'
import { ArrowBack, ChevronLeft, ChevronRight, Close } from '@mui/icons-material'


const CandidateSnapshotsPage: React.FC = () => {
  const [selectedIndex, setSelectedIndex] = useState<number | null>(null)
  const navigate = useNavigate()
  const dispatch = useDispatch<AppDispatch>()

  const { testId, candidateId } = useParams()

  const { snapshots, loading } = useSelector(
    (state: RootState) => state.companyTest
  )

  useEffect(() => {
    if (testId && candidateId) {
      dispatch(
        getSnapshots({
          testId,
          candidateId
        })
      )
    }
  }, [dispatch, testId, candidateId])

  if(loading){
        return (
            <div className="flex h-screen items-center justify-center">
                <div className="h-12 w-12 animate-spin rounded-full border-b-2 border-t-2 border-primary-600"></div>
            </div>
        )
  }

  return (
    <Box
    sx={{
      minHeight: "100vh",
      bgcolor: "#E6DECF",
      py: 4
    }}
  >
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Button
        startIcon={<ArrowBack />}
        onClick={() => navigate(-1)}
      >
        Back
      </Button>

      <Typography
        variant="h4"
        sx={{ mb: 3 }}
      >
        Candidate Snapshots
      </Typography>
      {snapshots.length === 0 ? (
        <Container maxWidth="md" sx={{ py: 6 }}>

        <Card sx={{ mt: 4, p: 4, textAlign: "center" }}>
            <Typography variant="h5" gutterBottom>
            No Snapshots Available
            </Typography>

            <Typography color="text.secondary">
            This candidate does not have any recorded snapshots.
            Snapshot capture may have been disabled for this test,
            or the candidate completed the test before snapshots were collected.
            </Typography>
        </Card>
        </Container>
       ): (
        <>
      <Grid container spacing={3}>
        {snapshots.map((snapshot, index) => (
          <Grid
            key={index}
            size={{
              xs: 12,
              sm: 6,
              md: 4
            }}
          >
            <Card>
                <CardMedia
                component="img"
                image={snapshot.url}
                height="250"
                sx={{
                    cursor: "pointer"
                }}
                onClick={() => setSelectedIndex(index)}
                />

              <CardContent>
                <Typography variant="body2">
                  {new Date(
                    snapshot.capturedAt
                  ).toLocaleString()}
                </Typography>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
<Dialog
  open={selectedIndex !== null}
  maxWidth="xl"
  fullWidth
  onClose={() => setSelectedIndex(null)}
>
  {selectedIndex !== null && (
    <Box
      sx={{
        position: "relative",
        bgcolor: "black",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "80vh"
      }}
    >
      <IconButton
        onClick={() => setSelectedIndex(null)}
        sx={{
          position: "absolute",
          top: 10,
          right: 10,
          color: "white",
          zIndex: 10
        }}
      >
        <Close />
      </IconButton>

      {snapshots.length > 1 && (
        <IconButton
          onClick={() =>
            setSelectedIndex(
              selectedIndex === 0
                ? snapshots.length - 1
                : selectedIndex - 1
            )
          }
          sx={{
            position: "absolute",
            left: 10,
            color: "white"
          }}
        >
          <ChevronLeft fontSize="large" />
        </IconButton>
      )}

      <img
        src={snapshots[selectedIndex].url}
        alt="Snapshot"
        style={{
          maxWidth: "100%",
          maxHeight: "85vh",
          objectFit: "contain"
        }}
      />

      {snapshots.length > 1 && (
        <IconButton
          onClick={() =>
            setSelectedIndex(
              selectedIndex === snapshots.length - 1
                ? 0
                : selectedIndex + 1
            )
          }
          sx={{
            position: "absolute",
            right: 10,
            color: "white"
          }}
        >
          <ChevronRight fontSize="large" />
        </IconButton>
      )}

      <Typography
        sx={{
          position: "absolute",
          bottom: 20,
          color: "white"
        }}
      >
        {new Date(
          snapshots[selectedIndex].capturedAt
        ).toLocaleString()}
      </Typography>
    </Box>
  )}
</Dialog>
</>
       )}
    </Container>
    </Box>
  )
}

export default CandidateSnapshotsPage
