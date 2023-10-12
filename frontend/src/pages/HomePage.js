import Container from '@mui/material/Container'
import Profile from '../components/ProfileComponent'
import MatchingComponent from '../components/MatchingComponent'

function HomePage () {
  return (
    <>
      <Container>
        <Profile />
        <MatchingComponent />
      </Container>
    </>
  )
}

export default HomePage
