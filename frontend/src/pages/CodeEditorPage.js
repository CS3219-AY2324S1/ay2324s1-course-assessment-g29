import { React } from 'react'
import { Editor } from '../components/Editor'
import { Box } from '@mui/system'
import { QuestionComponent } from '../components/QuestionComponent'
import { useParams } from 'react-router-dom'
import Navbar from "../components/Navbar";

// TODO: remove if not necessary?

const CodeEditorPage = () => {
  const { questionId } = useParams()
  console.log('Question ID: ' + questionId)

  return (
    <div style={{ width: "100%", height: "100%", paddingTop: "1rem" }}>
      <Navbar />
      <Box
        display="flex"
        flexDirection="row"
        justifyContent="center"
        alignItems="start"
      >
        <div style={{ width: "50%" }}>
          <QuestionComponent questionId={questionId} />
        </div>
        <div style={{ width: "50%", height: "100%" }}>
          <Editor />
        </div>
      </Box>
    </div>
  );
}

export default CodeEditorPage
