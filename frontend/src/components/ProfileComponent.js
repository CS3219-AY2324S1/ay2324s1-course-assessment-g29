import { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import axios from 'axios'
import {
  Typography,
  Box,
  Avatar,
  Dialog,
  Stack,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Chip,
  Checkbox
} from '@mui/material'
import Link from '@mui/material/Link'
import SentimentSatisfiedAltIcon from '@mui/icons-material/SentimentSatisfiedAlt'
import { blue } from '@mui/material/colors'
import Card from '@mui/material/Card'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice'
import DialogContent from '@mui/material/DialogContent'
import {
  selectUserid,
  selectDisplayname,
  selectEmail,
  selectPreferredLanguages,
  setPreferredLanguages,
  selectIdToken,
  selectIsAuthorized,
  setIsAuthorized
} from '../redux/UserSlice'

function Profile () {
  const dispatch = useDispatch()
  const userid = useSelector(selectUserid)
  const email = useSelector(selectEmail)
  const displayName = useSelector(selectDisplayname)
  const preferredLanguages = useSelector(selectPreferredLanguages)
  const idToken = useSelector(selectIdToken)
  const isAuthorized = useSelector(selectIsAuthorized)

  useEffect(() => {
    const config = {
      headers: { Authorization: `Bearer ${idToken}` }
    }

    axios
      .get(`http://34.125.231.246:3001/user/authorizeAdmin/${userid}`, config)
      .then((response) => {
        if (response.status === 200) {
          dispatch(setIsAuthorized(true))
        } else {
          dispatch(setIsAuthorized(false))
        }
      })
      .catch((error) => {
        console.error('Error checking authorization:', error)
        dispatch(setIsAuthorized(false))
      })
  }, [userid, idToken, dispatch])

  const ALL_LANGUAGES = ['Python', 'Java', 'C++']

  const [isLanguageChangeDialogOpen, setIsLanguageChangeDialogOpen] =
    useState(false)
  const [selectedLanguages, setSelectedLanguages] =
    useState(preferredLanguages)

  useEffect(() => {
    axios
      .get(`http://34.125.231.246:3001/user/getLanguage/${userid}`)
      .then((response) => {
        const userLanguages = response.data.languages
        dispatch(setPreferredLanguages(userLanguages))
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }, [dispatch, userid])

  const handleLanguageChange = () => {
    console.log(selectedLanguages)
    axios
      .post('http://34.125.231.246:3001/user/updateLanguage/', {
        uid: userid,
        languages: selectedLanguages
      })
      .then((response) => {
        console.log(response)
        dispatch(setPreferredLanguages(selectedLanguages))
        setIsLanguageChangeDialogOpen(false)
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target
    // Update the selectedLanguages state when a checkbox is checked or unchecked
    setSelectedLanguages((prevSelectedLanguages) =>
      checked
        ? [...prevSelectedLanguages, name]
        : prevSelectedLanguages.filter((lang) => lang !== name)
    )
  }

  return (
    <Box component='span' sx={{ p: 2 }} flex={1}>
      <Card flex={1} variant='outlined' sx={{ p: 2 }}>
        <Box display='flex' flexDirection='row' justifyContent='space-between' flex={1} flexWrap='wrap'>
          <Box flex={1}>
            <Typography
              variant='h5'
              marginBottom='0.5rem'
              fontWeight='bold'
              flexWrap='wrap'
            >
              {displayName}'s profile
            </Typography>
            <Box display='flex' flex={1} flexWrap='wrap'>
              <Typography
                variant='body2'
                marginBottom='0.5rem'
                fontWeight='bold'
              >
                UserId: &nbsp;
              </Typography>
              <Typography variant='body2' marginBottom='0.5rem'>
                {userid}
              </Typography>
            </Box>

            <Box display='flex' flex={1} flexWrap='wrap'>
              <Typography
                variant='body2'
                marginBottom='0.5rem'
                fontWeight='bold'
              >
                Email: &nbsp;
              </Typography>
              <Typography variant='body2' marginBottom='0.5rem'>
                {email}
              </Typography>
            </Box>

            <Typography
              variant='body2'
              marginBottom='0.5rem'
              fontWeight='bold'
              flex={1}
            >
              Preferred Languages:

            </Typography>
            <Stack display='flex' direction='row' spacing={1} flex={1} flexWrap='wrap'>
              {preferredLanguages &&
                  preferredLanguages.map((language, index) => {
                    return (
                      <Chip label={language} key={language} paddingLeft={0.5} />
                    )
                  })}
            </Stack>
            <Link
              onClick={() => setIsLanguageChangeDialogOpen(true)}
              underline='hover'
              flex={1}
            >
              <Typography variant='body2' marginBottom='0.5rem'>
                change preferred languages
              </Typography>
            </Link>

            {isAuthorized
              ? (<a href='/admin/questions'><Button variant='outlined'>Admin Console </Button></a>)
              : <></>}

            <Dialog
              open={isLanguageChangeDialogOpen}
              onClose={() => setIsLanguageChangeDialogOpen(false)}
            >
              <DialogContent>
                <Typography variant='body1'>
                  Check the languages you are the most comfortable with.
                </Typography>
                <FormGroup>
                  {ALL_LANGUAGES.map((language) => (
                    <FormControlLabel
                      key={language}
                      control={
                        <Checkbox
                          checked={selectedLanguages.includes(language)}
                          name={language}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={language}
                    />
                  ))}
                </FormGroup>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => handleLanguageChange()}>OK</Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Avatar sx={{ bgcolor: blue[500] }}>
            <SentimentSatisfiedAltIcon />
          </Avatar>
        </Box>
      </Card>
    </Box>
  )
}

export default Profile
