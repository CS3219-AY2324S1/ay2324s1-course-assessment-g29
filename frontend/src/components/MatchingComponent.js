import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { setRoomId, setQuestionData } from '../redux/MatchingSlice'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice'
import axios from 'axios'
import Grid from '@mui/material/Grid'
import { Box } from '@mui/material'
import Button from '@mui/material/Button'
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import { selectPreferredLanguages, selectUserid } from '../redux/UserSlice'
import Card from '@mui/material/Card'

function MatchingComponent () {
  const dispatch = useDispatch()
  const navigate = useNavigate()
  const userid = useSelector(selectUserid)
  const preferredLanguages = useSelector(selectPreferredLanguages)
  const [difficulty, setDifficulty] = useState('')

  const handleChange = (event) => {
    setDifficulty(event.target.value);
  };

  const joinQueue = async () => {
    if (difficulty === '') {
      dispatch(setErrorMessage('Choose a difficulty first'))
      dispatch(setShowError(true))
      return
    }
    try {
      console.log('Try Matching')
      const response = await axios.post('http://localhost:4000/match/', {
        userid,
        difficulty,
        programmingLanguages: preferredLanguages
      })
      dispatch(setRoomId(response.data.roomId))
      dispatch(setQuestionData(response.data.questionData.question))
      navigate('/collab')
    } catch (error) {
      dispatch(setErrorMessage(error.message))
      dispatch(setShowError(true))
    }
  }
  
  return (
    <>
      <Grid mt={2}>
        <Card>
          <Box sx={{ minWidth: 120 }}>
            <FormControl fullWidth>
              <InputLabel id="difficultyForm">Difficulty</InputLabel>
              <Select
              labelId="difficultySelect-label"
              id="difficultySelect"
              value={difficulty}
              label="Difficulty"
              onChange={handleChange}
              >
              <MenuItem value={'Easy'}>Easy</MenuItem>
              <MenuItem value={'Normal'}>Normal</MenuItem>
              <MenuItem value={'Hard'}>Hard</MenuItem>
              </Select>
            </FormControl>
          </Box>
          <Box mt={2}>
            <Button variant='contained' onClick={joinQueue}>Start Match</Button>
          </Box>
        </Card>
      </Grid>
    </>
  )
}

export default MatchingComponent
