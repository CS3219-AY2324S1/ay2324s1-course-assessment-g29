import {
  Box,
  Button,
  TextField,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import LoginPageBanner from "../components/FrontPageBanner";

function ResetPasswordPage() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(""); 

  const handleResetPassword = async (e) => {
    e.preventDefault();
    setEmailError("we don't recognise this email address.");
  };

  return (
    <Box display={"flex"} flexDirection={"row"} height="100vh">
      <Box
        display={"flex"}
        flex={1}
        flexDirection="column"
        justifyContent="center"
      >
        <Box display={"flex"} flexDirection="column" padding="25%">
          <Typography variant={"h4"} marginBottom={"1rem"} fontWeight="bold">
            Reset Password
          </Typography>
          <Typography variant={"body2"} marginBottom={"2rem"}>
            <b>Please enter your details</b>
          </Typography>
          <form
            onSubmit={handleResetPassword}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              label="Email"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={emailError}
              helperText={emailError}
              autoFocus
              fullWidth
            />
            <Button variant={"contained"} type="submit" fullWidth>
              <b>Login</b>
            </Button>
          </form>
        </Box>
      </Box>
      <LoginPageBanner />
    </Box>
  );
}

export default ResetPasswordPage;
