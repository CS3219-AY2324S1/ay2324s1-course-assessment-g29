import { React, useState, useEffect, useRef } from "react";
import { Editor } from "./Editor";
import { Box } from "@mui/system";
import { QuestionComponent } from "./QuestionComponent";

const CodeEditorPage = () => (
  <div style={{ width: "100%", height: "100%", paddingTop: "2rem" }}>
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"center"}
      alignItems={"start"}
    >
      <div style={{ width: "50%" }}>
        <QuestionComponent/>
      </div>
      <div style={{ width: "50%", height: "100%" }}>
        <Editor />
      </div>
    </Box>
  </div>
);

export default CodeEditorPage;
