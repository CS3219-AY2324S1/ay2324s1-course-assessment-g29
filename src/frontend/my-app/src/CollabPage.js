import React from "react";
import Container from '@mui/material/Container';
import CircularProgress from '@mui/material/CircularProgress';
import { Typography } from '@mui/material';


function CollabPage () {
    return (
        <>
            <Container>
                <Typography variant="h3" component="h2">
                    Awaiting Match
                </Typography>
                <CircularProgress/>
            </Container>
        
        </>
    )
    
}

export default CollabPage;