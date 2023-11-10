import { Alert } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import {
  selectShowSuccess,
  selectSuccessMessage,
  setShowSuccess,
  setSucessMessage
} from '../redux/ErrorSlice.js'

function SuccessMessageAlert () {
  const dispatch = useDispatch()
  const showSuccessAlert = useSelector(selectShowSuccess)
  const successMessage = useSelector(selectSuccessMessage)

  const closeErrorAlert = () => {
    dispatch(setShowSuccess(false))
    dispatch(setSucessMessage(''))
  }

  return (
    <>
      {showSuccessAlert && (
        <Alert severity='error' onClose={closeErrorAlert}>
          {successMessage}
        </Alert>
      )}
    </>
  )
}

export default SuccessMessageAlert
