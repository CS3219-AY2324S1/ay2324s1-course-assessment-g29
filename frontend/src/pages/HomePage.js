import Navbar from "../components/Navbar";
import Container from '@mui/material/Container'
import Profile from '../components/ProfileComponent'
import MatchingComponent from '../components/MatchingComponent'

function HomePage () {
  return (
    <>
      <Navbar />
      <Container>
        <Profile />
        <MatchingComponent />
      </Container>
    </>
  );
}

export default HomePage
