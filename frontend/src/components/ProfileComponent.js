import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import { Typography } from '@mui/material'
import Card from '@mui/material/Card'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice'
import { selectUserid, selectDisplayname, selectEmail, selectPreferredLanguages, setPreferredLanguages } from '../redux/UserSlice'

function Profile () {
  const dispatch = useDispatch()
  const userid = useSelector(selectUserid)
  const email = useSelector(selectEmail)
  const displayName = useSelector(selectDisplayname)
  const preferredLanguages = useSelector(selectPreferredLanguages)

  useEffect(() => {
    axios.get(`http://localhost:3001/user/getLanguage/${userid}`)
      .then((response) => {
          console.log(response)
          const userLanguages = response.data.languages
          dispatch(setPreferredLanguages(userLanguages))
        }).catch((error) => {
          dispatch(setErrorMessage(error.message))
          dispatch(setShowError(true))
        })
  }, [])

  return (
    <>
      <Card>
        <Typography>
          Name: {displayName}
        </Typography>
        <Typography>
          UserId: {userid}
        </Typography>
        <Typography>
          Email: {email}
        </Typography>
        <Typography>
          Preferred Languages:
        </Typography>
        { preferredLanguages && preferredLanguages.map((language) => {
          return (
            <>
              <Typography>
                {language}
              </Typography>
            </>
          )
          })
        }
      </Card>
    </>
  )
}

export default Profile
