import { React, useState, useEffect } from "react";
import { Select, MenuItem, InputLabel, FormControl, Card } from "@mui/material";
import CodeMirror from "@uiw/react-codemirror";
import { materialLightInit } from "@uiw/codemirror-theme-material";
import { python } from "@codemirror/lang-python";
import { java, javaLanguage } from "@codemirror/lang-java";
import { cpp } from "@codemirror/lang-cpp"; 

function determineLanguage(selectedLanguage) {
    if (selectedLanguage === "python") {
        return [python({ jsx: true })];
    } else if (selectedLanguage === "java") {
        return [java({ jsx: true })];
    } else if (selectedLanguage === "C++") {
        return [cpp({ jsx: true })];
    }
}

export const Editor = () => {
  const [languages, setLanguages] = useState(["python", "java", "C++"]);
  const [selectedLanguage, setSelectedLanguage] = useState("");
  const [code, setCode] = useState("## Write down your solutions here\n");

  const handleLanguageChange = (e) => {
    const selectedValue = e.target.value;
    setSelectedLanguage(selectedValue); // Update the selected language state
  };

  const handleCodeChange = (value, data) => {
    console.log("Code changed to:", value);
    setCode(value); 
  };

  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <FormControl style={{ width: "50%" }}>
          <InputLabel id="Programming language">
            Choose programming language
          </InputLabel>
          <Select onChange={handleLanguageChange} value={selectedLanguage}>
            {languages.map((language, index) => (
              <MenuItem key={index} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <CodeMirror
          value={code}
          style={{ width: "100%", paddingTop: "1rem" }}
          onChange={handleCodeChange}
          className="custom-codemirror"
          theme={materialLightInit({
            settings: {
              caret: "#c6c6c6",
              fontFamily: "monospace",
              foreground: "#75baff",
              lineHighlight: "#8a91991a",
            },
          })}
          extensions={determineLanguage(selectedLanguage)}
        />
      </Card>
    </div>
  );
};
