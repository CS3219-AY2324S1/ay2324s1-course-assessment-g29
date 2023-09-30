import { Container } from '@mui/material';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Navbar from './Navbar'
import HomePage from './HomePage';
import CollabPage from './CollabPage';
import CodeEditorPage from './components/CodeEditorPage';

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <Container>
          <Routes>
            <Route path="/" exact element={<HomePage />} />
            <Route path="/collab" exact element={<CollabPage />} />
            <Route path="/question" exact element={<CodeEditorPage />} />
          </Routes>
        </Container>
      </BrowserRouter>
    </>
  );
}

  export default App;
