import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  TextField
} from "@mui/material";
import { useDispatch } from "react-redux";
import {
  setDisplayname,
  setUserid,
  setStateEmail,
  setLoginStatus,
} from "../redux/UserSlice.js";
import { useNavigate } from "react-router-dom";
import LoginPageBanner from "../components/FrontPageBanner.js";
import axios from "axios";

function Signup() {
  const [displayName, setDisplayName] = useState("");
  const [displayNameError, setDisplayNameError] = useState(false);

  const [username, setUsername] = useState("");
  const [usernameError, setUsernameError] = useState(false);

  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState(false);

  const [password, setPassword] = useState("");
  const [passwordError, setPasswordError] = useState(false);

  const [passwordConfirmation, setPasswordConfirmation] = useState("");
  const [passwordConfirmationError, setPasswordConfirmationError] = useState("");

  const dispatch = useDispatch();
  const navigate = useNavigate();

  const checkPasswords = (password1, password2) => {
    if (password1 !== password2) {
      setPasswordConfirmationError("Passwords do not match.");
      throw new Error("Passwords do not match");
    } else {
      setPasswordConfirmationError("");
    }
  };

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      checkPasswords(password, passwordConfirmation);
      return new Promise((resolve, reject) => {
        axios
          .post("http://localhost:3001/user/register", {
            name: displayName,
            username,
            email,
            password,
          })
          .then((response) => {
            const userCredentials = response.data;
            const userid = userCredentials.user.uid;
            dispatch(setUserid(userid));
            const displayName = userCredentials.user.displayName;
            dispatch(setDisplayname(displayName));
            const useremail = userCredentials.user.email;
            dispatch(setStateEmail(useremail));
            dispatch(setLoginStatus(true));
            console.log("Signup successful");
            navigate("/home");
          });
      });
    } catch (error) {
      console.error("Signup error:", error);
    }
  };

  const routeChangeSignin = () => {
    const path = "/login";
    navigate(path);
  };

  const routeChangeResetPassword = () => {
    const path = "/resetPassword";
    navigate(path);
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
            First step to landing your dream job
          </Typography>
          <Typography variant={"body2"} marginBottom={"2rem"}>
            <b>Please enter your details</b>
          </Typography>
          <form
            onSubmit={handleSignUp}
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              flexDirection: "column",
            }}
          >
            <TextField
              type="text"
              placeholder="Display Name"
              variant="standard"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={emailError}
              fullWidth
              required
            />
            <TextField
              type="text"
              placeholder="Username"
              variant="standard"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={usernameError}
              fullWidth
              required
            />
            <TextField
              type="email"
              placeholder="Email"
              variant="standard"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={emailError}
              fullWidth
              required
            />
            <TextField
              type="password"
              placeholder="Password"
              variant="standard"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={passwordError}
              fullWidth
              required
            />
            <TextField
              type="password"
              placeholder="Confirm Password"
              variant="standard"
              value={passwordConfirmation}
              onChange={(e) => setPasswordConfirmation(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={passwordConfirmationError !== ""}
              helperText={passwordConfirmationError}
              fullWidth
              required
            />
            <Button variant={"contained"} type="submit" fullWidth>
              <b>Sign up</b>
            </Button>
          </form>
          <Typography variant={"body2"}>
            <a
              style={{
                fontWeight: "bolder",
                textDecoration: "none",
                color: "#1976d2",
              }}
              href={""}
              onClick={routeChangeResetPassword}
            >
              Reset password
            </a>
          </Typography>
          <Typography variant={"body2"} marginTop={"1rem"}>
            Already have an account?
            <a
              style={{
                marginLeft: "0.5em",
                fontWeight: "bolder",
                textDecoration: "none",
                color: "#1976d2",
              }}
              href={""}
              onClick={routeChangeSignin}
            >
              Sign in
            </a>
          </Typography>
        </Box>
      </Box>
      <LoginPageBanner />
    </Box>
  );
}

export default Signup;
