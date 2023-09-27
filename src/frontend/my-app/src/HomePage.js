import { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom';
import { setRoomId, setUserId } from './MatchingSlice'
import axios from 'axios';
import Alert from '@mui/material/Alert';
import Box from '@mui/material/Container';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Container from '@mui/material/Container';

function HomePage(props) {
    const [showErrorAlert, setShowErrorAlert] = useState(false);
    const [showSuccessAlert, setShowSuccessAlert] = useState(false);
    const [successMessage, setSuccessMessage] = useState('');
    const [errorMessage, setErrorMessage] = useState('');
    const [userId, setUserId] = useState('');
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const joinQueue = async () => {
        if (!userId) {
            setErrorMessage('Enter a user id first')
            setShowErrorAlert(true);
            return;
        }
        console.log("hel")
        try {
            console.log("Try Matching")
            const response = await axios.post('http://localhost:4000/match/', {
                user1id: userId,
            });

            dispatch(setRoomId(response.data.roomId))
            dispatch(setUserId(userId));
            setSuccessMessage(response.data.message);
            setShowSuccessAlert(true);
            navigate('/collab')
            
        } catch (error) {
            setErrorMessage(error.message)
            setShowErrorAlert(true);
            return;
        }
    }

    return (
        <>
            <Container>
                { showSuccessAlert ? (
                    <Alert onClose={() => setShowSuccessAlert(false)}>{successMessage}</Alert>
                ) : (<></>)}
                { showErrorAlert ? (
                    <Alert severity="error" onClose={() => setShowErrorAlert(false)}>Error: {errorMessage}</Alert>
                ) : (<></>)}
                
                <Box mt={2}>
                <TextField value={userId} onChange={(e) => setUserId(e.target.value)} id="outlined-basic" label="UserId" variant="outlined" />
                <Button variant="contained" onClick={joinQueue}>Start Match</Button>
                </Box>
            </Container>
        </>
    );

}

export default HomePage;