import { Box } from "@mui/material";
import { useSelector } from "react-redux";
import { selectLoginstatus } from "./redux/UserSlice";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import ResetPasswordPage from "./pages/ResetPasswordPage";
import Login from "./pages/login";
import Signup from "./pages/signup";
import HomePage from "./pages/HomePage";
import CollabPage from "./pages/CollabPage";
import CodeEditorPage from "./pages/CodeEditorPage";

function App() {
  const loginStatus = useSelector(selectLoginstatus);

  return (
    <>
      <Box display={"flex"} flexDirection={"column"} height="100vh">
        <BrowserRouter>
        {showErrorAlert && <ErrorMessage />}
          <Routes>
            {loginStatus ? (
              <>
                <Route path="/" element={<Navigate to="/home" replace />} />
                <Route path="/home" exact element={<HomePage />} />
                <Route path="/collab" exact element={<CollabPage />} />
                <Route
                  path="/question/:questionId"
                  element={<CodeEditorPage />}
                />
                <Route path="*" element={<Navigate to="/home" />} />
              </>
            ) : (
              <>
                <Route path="/" Component={Login} />
                <Route path="/signup" Component={Signup} />
                <Route path="/resetPassword" Component={ResetPasswordPage}/>
                <Route path="" element={<Navigate to="/" />} />
                <Route path="*" element={<Navigate to="/" />} />
              </>
            )}
          </Routes>
        </BrowserRouter>
      </Box>
    </>
  );
}

export default App;
