import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar'
import HomePage from './pages/HomePage';
import CollabPage from './pages/CollabPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Container>
          <Routes>
            <Route path="/home" exact element={<HomePage />} />
            <Route path="/collab" exact element={<CollabPage/>}/>
          </Routes>
      </Container>
      </BrowserRouter>
    </>
    
  );
}

  export default App;
