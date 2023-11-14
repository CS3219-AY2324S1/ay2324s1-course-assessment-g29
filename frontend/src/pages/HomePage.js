import Navbar from '../components/Navbar'
import { Box } from '@mui/material'
import Profile from '../components/ProfileComponent'
import MatchingComponent from '../components/MatchingComponent'
import MetricComponent from '../components/MetricComponent'
import PreviousQuestionsDone from '../components/PreviousQuestionsDone'

function HomePage () {
  return (
    <Box
      display='flex'
      flexDirection='column'
      flex={1}
      justifyContent='center'
    >
      <Navbar />
      <Box
        display='flex'
        flexDirection='row'
        justifyContent='center'
        flex={1}
      >
        <Box width='25%'>
          <Profile />
        </Box>
        <Box display='flex' flexDirection='column' width='60%'>
          <Box display='flex' flexDirection='row'>
            <MetricComponent />
            <MatchingComponent />
          </Box>
          <PreviousQuestionsDone />
        </Box>
      </Box>
    </Box>
  )
}

export default HomePage
