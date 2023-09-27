import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'
import HomePage from './HomePage';
import CollabPage from './CollabPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar/>
        <Container>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/collab" exact element={<CollabPage/>}/>
          </Routes>
      </Container>
      </BrowserRouter>
    </>
    
  );
}

  export default App;
