import {
  Box,
  Button,
  Dialog,
  TextField,
  Typography,
  DialogActions
} from "@mui/material";
import DialogContent from "@mui/material/DialogContent";
import { initFirebase } from "../configs/firebase.js";
import { getAuth, signInWithEmailAndPassword } from "firebase/auth";
import React, { useState } from "react";
import { useDispatch } from "react-redux";
import {
  setDisplayname,
  setUserid,
  setStateEmail,
  setLoginStatus,
} from "../redux/UserSlice.js";
import { useNavigate } from "react-router-dom";
import LoginPageBanner from "../components/FrontPageBanner.js";

function Login() {
  const app = initFirebase();
  console.log(app);
  const auth = getAuth();
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [LoginError, setLoginError] = useState(false);
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleLogin = async (e) => {
    e.preventDefault();

    try {
      const userCredentials = await signInWithEmailAndPassword(
        auth,
        email,
        password
      );
      // User is logged in
      const userid = userCredentials.user.uid;
      dispatch(setUserid(userid));
      const displayName = userCredentials.user.displayName;
      dispatch(setDisplayname(displayName));
      const useremail = userCredentials.user.email;
      dispatch(setStateEmail(useremail));
      dispatch(setLoginStatus(true));
      console.log("Login successful");
      navigate("/home");
    } catch (error) {
      console.error("Login error:", error);
      setLoginError(true);
      dispatch(setErrorMessage(error.message)); // TODO handle firebase errors (give better descriptions)
      dispatch(setShowError(true));
      setIsDialogOpen(true);
    }
  };

  const routeChangeSignup = () => {
    const path = "/signup";
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
            Welcome Back
          </Typography>
          <Typography variant={"body2"} marginBottom={"2rem"}>
            <b>Please enter your details</b>
          </Typography>
          <form
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
              autoFocus
              fullWidth
            />
            <TextField
              label="Password"
              variant="standard"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              sx={{ marginBottom: "1rem" }}
              error={LoginError}
              fullWidth
            />
            <Button variant={"contained"} onClick={handleLogin} fullWidth>
              <b>Login</b>
            </Button>
          </form>
          <Typography variant={"body2"}>
            <a
              style={{
                fontWeight: "bolder",
                textDecoration: "none",
                color: "#1976d2",
              }}
              href={"/resetPassword"}
            >
              Reset password
            </a>
          </Typography>

          <Dialog open={isDialogOpen} onClose={() => setIsDialogOpen(false)}>
            <DialogContent>
              <Typography variant="body1">
                Incorrect Password. Please try again.
              </Typography>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setIsDialogOpen(false)}>OK</Button>
            </DialogActions>
          </Dialog>

          <Box
            display={"flex"}
            flexDirection={"row"}
            justifyContent={"flex-end"}
            marginTop="0.5rem"
          ></Box>
          <Typography variant={"body2"} marginTop={"1rem"}>
            Don't have an account?
            <a
              style={{
                marginLeft: "0.5em",
                fontWeight: "bolder",
                textDecoration: "none",
                color: "#1976d2",
              }}
              href={""}
              onClick={routeChangeSignup}
            >
              Sign up
            </a>
          </Typography>
        </Box>
      </Box>

      <LoginPageBanner />
    </Box>
  );
}

export default LoginPage
