import { React, useState, useEffect } from 'react'
import PreviousQuestionEditor from '../components/PreviousQuestionEditor'
import { Box } from '@mui/system'
import { QuestionComponent } from '../components/QuestionComponent'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { useSelector } from 'react-redux'
import { selectUserid } from '../redux/UserSlice'
import Typography from 'antd/es/typography/Typography'

const PreviousQuestionPage = () => {
  const userid = useSelector(selectUserid)
  const { roomId } = useParams()
  console.log('room ID: ' + roomId)
  const [questionData, setQuestionData] = useState(null)
  const [programmingLanguage, setProgrammingLanguage] = useState('')
  const [code, setCode] = useState('')
  const [partnerId, setPartnerId] = useState('')

  const getPartnerId = (user1id, user2id) => {
    if (user1id !== userid) {
      return user1id
    } else {
      return user2id
    }
  }

  // Define an asynchronous function to fetch question data
  const getQuestionData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/room/getHistory/${roomId}`)
      console.log(response.data.roomInfo.language)

      if (response.data.roomInfo.language === '') {
        setProgrammingLanguage('none')
      } else {
        setProgrammingLanguage(response.data.roomInfo.language)
      }
      setQuestionData(response.data.roomInfo.questionData)
      setCode(response.data.roomInfo.code)
      setPartnerId(getPartnerId(response.data.roomInfo.user1id, response.data.roomInfo.user2id))
    } catch (error) {
      console.error(error)
    }
  }

  useEffect(() => {
    getQuestionData()
  }, [roomId]) // Re-run when roomId changes

  return (
    <Box display='flex' flexDirection='column' alignContent='flex-start'>
      <Navbar />
      <Box
        style={{ height: '70%', paddingTop: '1rem' }}
        display='flex'
        justifyContent='center'
        padding='2rem'
      >
        <Box
          display='flex'
          flexDirection='row'
          justifyContent='center'
          sx={{ p: 2, width: '80%' }}
        >
          <Box style={{ width: '50%' }} justifyContent='space-between'>
            <Box>
              {questionData && <QuestionComponent questionData={questionData} />}
              <Box marginBottom={1} marginTop={1}>
                <Typography variant='body2' component='body2'>
                  You completed this question with {partnerId}.
                </Typography>
              </Box>
            </Box>
          </Box>
          <Box
            display='flex'
            flexDirection='column'
            flex={1}
            alignContent='flex-end'
          >
            <Box margin={1} flex={1}>
              <PreviousQuestionEditor code={code} programmingLanguage={programmingLanguage} />
            </Box>

          </Box>
        </Box>
      </Box>
    </Box>
  )
}

export default PreviousQuestionPage
