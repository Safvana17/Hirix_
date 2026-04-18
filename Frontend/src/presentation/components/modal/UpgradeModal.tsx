import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material"
import { useNavigate } from "react-router-dom"

interface Props {
  open: boolean
  onClose: () => void
}

const UpgradeModal: React.FC<Props> = ({ open, onClose }) => {
  const navigate = useNavigate()

  return (
    <Dialog sx={{background: '#fff'}} open={open} onClose={onClose}>
      <DialogTitle sx={{fontWeight: 'bold'}}>Upgrade Required</DialogTitle>

      <DialogContent>
        You are on a free plan. Upgrade your subscription to access this feature.
      </DialogContent>

      <DialogActions>
        <Button onClick={onClose}>Close</Button>
        <Button
          sx={{
            backgroundColor: '#654b03'
          }}
          variant="contained"
          onClick={() => {
            navigate("/subscription")
            onClose()
          }}
        >
          Upgrade
        </Button>
      </DialogActions>
    </Dialog>
  )
}

export default UpgradeModal