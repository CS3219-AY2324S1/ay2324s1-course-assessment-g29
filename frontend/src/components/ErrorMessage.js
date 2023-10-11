import { Alert } from '@mui/material'
import { useSelector, useDispatch } from 'react-redux'
import { selectShowError, selectErrorMessage, setShowError, setErrorMessage } from '../redux/ErrorSlice.js'

function ErrorMessage () {
  const dispatch = useDispatch()
  const showErrorAlert = useSelector(selectShowError)
  const errorMessage = useSelector(selectErrorMessage)

  const closeErrorAlert = () => {
    dispatch(setShowError(false))
    dispatch(setErrorMessage(''))
  }

  return (
    <>
      {showErrorAlert &&
        <Alert severity='error' onClose={closeErrorAlert}>Error: {errorMessage}</Alert>}
    </>
  )
}

export default ErrorMessage
