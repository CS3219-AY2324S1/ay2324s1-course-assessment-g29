import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import axios from "axios";
import {
  Typography,
  Box,
  Avatar,
  Dialog,
  Stack,
  DialogActions,
  Button,
  FormGroup,
  FormControlLabel,
  Chip,
  Checkbox,
} from "@mui/material";
import Link from "@mui/material/Link";
import SentimentSatisfiedAltIcon from "@mui/icons-material/SentimentSatisfiedAlt";
import { blue } from "@mui/material/colors";
import Card from "@mui/material/Card";
import { setShowError, setErrorMessage } from "../redux/ErrorSlice";
import DialogContent from "@mui/material/DialogContent";
import {
  selectUserid,
  selectDisplayname,
  selectEmail,
  selectPreferredLanguages,
  setPreferredLanguages,
} from "../redux/UserSlice";

function Profile() {
  const dispatch = useDispatch();
  const userid = useSelector(selectUserid);
  const email = useSelector(selectEmail);
  const displayName = useSelector(selectDisplayname);
  const preferredLanguages = useSelector(selectPreferredLanguages);

  const ALL_LANGUAGES = ["Python", "Java", "C"];

  const [isLanguageChangeDialogOpen, setIsLanguageChangeDialogOpen] =
    useState(false);
  const [selectedLanguages, setSelectedLanguages] =
    useState(preferredLanguages);

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/getLanguage/${userid}`)
      .then((response) => {
        console.log(response);
        const userLanguages = response.data.languages;
        dispatch(setPreferredLanguages(userLanguages));
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message));
        dispatch(setShowError(true));
      });
  }, []);

  const handleLanguageChange = () => {
    const JsonData = JSON.stringify(selectedLanguages);
    console.log(JsonData);  
    axios
      .post(`http://localhost:3001/user/updateLanguage/`, {
        uid: userid, 
        languages: JsonData, 
      })
      .then((response) => {
        console.log(response);
        const userLanguages = response.data.languages;
        dispatch(setPreferredLanguages(selectedLanguages));
        setIsLanguageChangeDialogOpen(false);
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message));
        dispatch(setShowError(true));
      });
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    // Update the selectedLanguages state when a checkbox is checked or unchecked
    setSelectedLanguages((prevSelectedLanguages) =>
      checked
        ? [...prevSelectedLanguages, name]
        : prevSelectedLanguages.filter((lang) => lang !== name)
    );
  };

  return (
    <Box component="span" sx={{ p: 2, width: 1 / 5 }}>
      <Card flex={1} variant="outlined" sx={{ p: 2 }}>
        <Box display="flex" flexDirection="row" justifyContent="space-between">
          <Box>
            <Typography
              variant={"h5"}
              marginBottom={"0.5rem"}
              fontWeight="bold"
            >
              {displayName}'s profile
            </Typography>
            <Box display="flex">
              <Typography
                variant={"body2"}
                marginBottom={"0.5rem"}
                fontWeight="bold"
              >
                UserId: &nbsp;
              </Typography>
              <Typography variant={"body2"} marginBottom={"0.5rem"}>
                {userid}
              </Typography>
            </Box>

            <Box display="flex">
              <Typography
                variant={"body2"}
                marginBottom={"0.5rem"}
                fontWeight="bold"
              >
                Email: &nbsp;
              </Typography>
              <Typography variant={"body2"} marginBottom={"0.5rem"}>
                {email}
              </Typography>
            </Box>

            <Typography
              variant={"body2"}
              marginBottom={"0.5rem"}
              fontWeight="bold"
            >
              Preferred Languages:
              <Stack direction="row" spacing={1}>
                {preferredLanguages &&
                  preferredLanguages.map((language, index) => {
                    return <Chip label={language} key={language} paddingLeft={0.5}/>;
                  })}
              </Stack>
            </Typography>
            <Link
              onClick={() => setIsLanguageChangeDialogOpen(true)}
              underline="hover"
            >
              <Typography variant={"body2"} marginBottom={"0.5rem"}>
                {"change preferred languages"}
              </Typography>
            </Link>

            <Dialog
              open={isLanguageChangeDialogOpen}
              onClose={() => setIsLanguageChangeDialogOpen(false)}
            >
              <DialogContent>
                <Typography variant="body1">
                  Check the languages you are the most comfortable with.
                </Typography>
                <FormGroup>
                  {ALL_LANGUAGES.map((language) => (
                    <FormControlLabel
                      key={language}
                      control={
                        <Checkbox
                          checked={selectedLanguages.includes(language)}
                          name={language}
                          onChange={handleCheckboxChange}
                        />
                      }
                      label={language}
                    />
                  ))}
                </FormGroup>
              </DialogContent>

              <DialogActions>
                <Button onClick={() => handleLanguageChange()}>OK</Button>
              </DialogActions>
            </Dialog>
          </Box>

          <Avatar sx={{ bgcolor: blue[500] }}>
            <SentimentSatisfiedAltIcon />
          </Avatar>
        </Box>
      </Card>
    </Box>
  );
}

export default Profile;
