import { PieChart } from '@mui/x-charts/PieChart'
import { Box, Card, Typography } from '@mui/material'
import { styled } from '@mui/material/styles'
import { useDrawingArea } from '@mui/x-charts/hooks'
import { useSelector} from 'react-redux'
import {
  selectPreviousQuestions,
} from '../redux/UserSlice'
import { useEffect } from 'react'

const MetricComponent = () => {
  const previousQuestions = useSelector(selectPreviousQuestions)

  const hasQuestionDone = () => {
    if (previousQuestions === undefined) { 
      return false
    } else {
      return true
    }
  }

  const getEasyQuestion = () => {
    if (previousQuestions === undefined) { 
      return 0
    }
    console.log(previousQuestions)
    return previousQuestions
      .filter(attemptData => attemptData && attemptData.attempt)
      .filter((question) => question.attempt.questionData.difficulty === 'Easy').length;
  }

  const getNormalQuestion = () => {
    if (previousQuestions === undefined) { 
      return 0
    }
    return previousQuestions
      .filter(attemptData => attemptData && attemptData.attempt)
      .filter((question) => question.attempt.questionData.difficulty === 'Medium').length;
  }

  const getHardQuestion = () => { 
    if (previousQuestions === undefined) { 
      return 0
    }
    return previousQuestions
      .filter(attemptData => attemptData && attemptData.attempt)
      .filter((question) => question.attempt.questionData.difficulty === 'Hard').length;
  }

  const getTotalQuestions = () => { 
    if (previousQuestions === undefined) {
      return 0
    }
    return previousQuestions
      .filter(attemptData => attemptData && attemptData.attempt)
      .length;
  }

  return (
    <Box
      component='span'
      sx={{ p: 2, width: '50%', textAlign: 'left', height: '50%' }}
      flex={1}
    >
      <Card
        flex={1}
        variant='outlined'
        sx={{ p: 2, marginLeft: 0, textAlign: 'left' }}
      >
        <Typography variant='body' marginBottom='0.5rem' fontWeight='bold'>
          Questions done by difficulty
        </Typography>
        {getTotalQuestions() > 0
          ? (
            <Box display='flex' flex={1} justifyContent='flex-start' sx={{ paddingTop: '3%' }}>
              <PieChart
                series={[
                  {
                    data: [
                      { id: 0, value: getEasyQuestion(), label: 'Easy' },
                      { id: 1, value: getNormalQuestion(), label: 'Medium' },
                      {
                        id: 2,
                        value: getHardQuestion(),
                        label: 'Hard',
                        color: '#FF0000'
                      }
                    ],
                    innerRadius: 55
                  }
                ]}
                width={300}
                height={140}
              >
                <PieCenterLabel>{`Total: ${getTotalQuestions()}`}</PieCenterLabel>
              </PieChart>
            </Box>
            )
          : (
            <Typography
              variant='body2'
              marginBottom='0.5rem'
              fontWeight='bold'
            >
              No question done yet, get started today!{' '}
            </Typography>
            )}
      </Card>
    </Box>
  )
}

const StyledText = styled('text')(({ theme }) => ({
  fill: theme.palette.text.primary,
  textAnchor: 'middle',
  dominantBaseline: 'central',
  fontSize: 14
}))

function PieCenterLabel ({ children }) {
  const { width, height, left, top } = useDrawingArea()
  return (
    <StyledText x={left + width / 2} y={top + height / 2}>
      {children}
    </StyledText>
  )
}

export default MetricComponent
