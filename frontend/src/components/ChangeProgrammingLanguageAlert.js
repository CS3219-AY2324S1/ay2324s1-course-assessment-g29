import * as React from "react";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogActions from "@mui/material/DialogActions";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogTitle from "@mui/material/DialogTitle";
import { useDispatch, useSelector } from "react-redux";
import {
  selectChangeProgrammingLanguageAlert,
  setChangeProgrammingLanguageAlert,
} from "../redux/EditorSlice";

export default function ProgrammingLanguageDialog({
  matchedUserId,
  language,
  denyChange,
  agreeChange,
}) {
  const open = useSelector(selectChangeProgrammingLanguageAlert);
  const dispatch = useDispatch();

  const handleDisagree = () => {
    denyChange();
    dispatch(setChangeProgrammingLanguageAlert(false));
  };

  const handleAgree = () => {
    agreeChange();
    dispatch(setChangeProgrammingLanguageAlert(false));
  };

  return (
    <div>
      <Dialog
        open={open}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          Change Programming Language?
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            {matchedUserId} is trying to change the programming language to{" "}
            {language}. Do you agree to the change?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleDisagree}>Disagree</Button>
          <Button onClick={handleAgree} autoFocus>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
