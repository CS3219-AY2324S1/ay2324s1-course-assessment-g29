import { React, useState, useEffect } from 'react'
import PreviousQuestionEditor from '../components/PreviousQuestionEditor'
import { Box } from '@mui/system'
import { QuestionComponent } from '../components/QuestionComponent'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import Navbar from '../components/Navbar'
import { PanelGroup, Panel, PanelResizeHandle } from 'react-resizable-panels'

const PreviousQuestionPage = () => {
  const { roomId } = useParams()
  console.log('room ID: ' + roomId)

  const [questionData, setQuestionData] = useState(null)
  const [programmingLanguage, setProgrammingLanguage] = useState('')
  const [code, setCode] = useState('')

  // Define an asynchronous function to fetch question data
  const getQuestionData = async () => {
    try {
      const response = await axios.get(`http://localhost:8000/room/getHistory/${roomId}`)
      setQuestionData(response.data.roomInfo.questionData)
      setProgrammingLanguage(response.data.roomInfo.language)
      setCode(response.data.roomInfo.code)
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
