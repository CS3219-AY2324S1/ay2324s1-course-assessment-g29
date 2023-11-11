import React from 'react'
import CodeMirror from '@uiw/react-codemirror'
import { materialLightInit } from '@uiw/codemirror-theme-material'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import { Select, MenuItem, InputLabel, FormControl, Card } from '@mui/material'

const PreviousQuestionEditor = ({ code, programmingLanguage }) => {
  // const EditorViewCodeMirror = new EditorView({
  //     doc: 'console.log("hello")',
  //     extensions: [
  //         CodeMirror.basicSetup,
  //         EditorState.readOnly.of(false)
  //     ],
  // })

  function determineLanguage (selectedLanguage) {
    if (selectedLanguage === 'Python') {
      return [python({ jsx: true })]
    } else if (selectedLanguage === 'Java') {
      return [java({ jsx: true })]
    } else if (selectedLanguage === 'C++') {
      return [cpp({ jsx: true })]
    } else {
      return []
    }
  }

  return (
    <div
      style={{
        width: '100%',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Card
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <FormControl style={{ width: '50%' }}>
          <InputLabel id='Programming language'>
            
          </InputLabel>
          <Select
            disabled
            value={programmingLanguage}
          >
            <MenuItem key={0} value='none'>
              No specified language
            </MenuItem>
            <MenuItem key={1} value='Python'>
              Python
            </MenuItem>
            <MenuItem key={2} value='C++'>
              C++
            </MenuItem>
            <MenuItem key={3} value='Java'>
              Java
            </MenuItem>
          </Select>
        </FormControl>
        <CodeMirror
          value={code}
          readOnly
          theme={materialLightInit({
            settings: {
              caret: '#c6c6c6',
              fontFamily: 'monospace',
              foreground: '#75baff',
              lineHighlight: '#8a91991a'
            }
          })}
          extensions={determineLanguage(programmingLanguage)}
          style={{ width: '100%', paddingTop: '1rem' }}
          className='custom-codemirror'
        />
      </Card>
    </div>
  )
}

export default PreviousQuestionEditor
