import { React, useState } from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { Select, MenuItem, InputLabel, FormControl, Container } from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { materialLightInit } from '@uiw/codemirror-theme-material'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'
import {
  selectCode,
  setCode,
  selectCodeEditorLanguage,
  setCodeEditorLanguage
} from '../redux/EditorSlice'

function determineLanguage (selectedLanguage) {
  if (selectedLanguage === 'Python') {
    return [python({ jsx: true })]
  } else if (selectedLanguage === 'Java') {
    return [java({ jsx: true })]
  } else if (selectedLanguage === 'C++') {
    return [cpp({ jsx: true })]
  }
}

// function startingCode (language) {
//   if (language === 'Python') {
//     return '## Write down your solutions here\n'
//   } else if (language === 'Java') {
//     return '/* Write down your solutions here */\n'
//   } else if (language === 'C++') {
//     return '/* Write down your solutions here */\n'
//   }
// }

export const Editor = ({ socketRef }) => {
  const dispatch = useDispatch()
  const reduxCode = useSelector(selectCode)
  const [languages] = useState(['Python', 'Java', 'C++'])
  const selectedLanguage = useSelector(selectCodeEditorLanguage)

  const handleLanguageChange = (e) => {
    const selectedValue = e.target.value
    dispatch(setCodeEditorLanguage(selectedValue))
    socketRef.current.emit(
      'ChangeEditorLanguage',
      { language: selectedValue },
      (error) => {
        console.log(error)
      }
    )
  }

  const handleCodeChange = (value, data) => {
    console.log('Code changed to:', value)
    dispatch(setCode(value))
    socketRef.current.emit('CodeChange', { code: value }, (error) => {
      console.log(error)
    })
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
      <Container
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <FormControl style={{ width: '20vw' }}>
          {selectedLanguage
            ? (
              <InputLabel id='Programming language' />
              )
            : (
              <InputLabel id='Programming language'>
                Choose programming language
              </InputLabel>)}
          <Select onChange={handleLanguageChange} value={selectedLanguage}>
            {languages.map((language, index) => (
              <MenuItem key={index} value={language}>
                {language}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
        <div style={{ flex: 1, flexGrow: 1, overflow: 'auto' }}>
          <CodeMirror
            value={reduxCode}
            style={{ paddingTop: '1rem' }}
            onChange={handleCodeChange}
            theme={materialLightInit({
              settings: {
                caret: '#c6c6c6',
                fontFamily: 'monospace',
                foreground: '#75baff',
                lineHighlight: '#8a91991a'
              }
            })}
            extensions={determineLanguage(selectedLanguage)}
          />
        </div>

      </Container>
    </div>
  )
}
