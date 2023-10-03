import { React, useState } from 'react'
import { Select, MenuItem, InputLabel, FormControl, Card } from '@mui/material'
import CodeMirror from '@uiw/react-codemirror'
import { materialLightInit } from '@uiw/codemirror-theme-material'
import { python } from '@codemirror/lang-python'
import { java } from '@codemirror/lang-java'
import { cpp } from '@codemirror/lang-cpp'

function determineLanguage(selectedLanguage) {
  if (selectedLanguage === 'Python') {
    return [python({ jsx: true })]
  } else if (selectedLanguage === 'Java') {
    return [java({ jsx: true })]
  } else if (selectedLanguage === 'C++') {
    return [cpp({ jsx: true })]
  }
}

function startingCode(language) {
  if (language === 'Python') {
    return '## Write down your solutions here\n'
  } else if (language === 'Java') {
    return '/* Write down your solutions here */\n'
  } else if (language === 'C++') {
    return '/* Write down your solutions here */\n'
  }
}

export const Editor = () => {
  const [languages] = useState(['Python', 'Java', 'C++'])
  const [selectedLanguage, setSelectedLanguage] = useState('')
  const [code, setCode] = useState('Please choose a language to begin!\n')

  const handleLanguageChange = (e) => {
    const selectedValue = e.target.value
    setCode(startingCode(selectedValue))
    setSelectedLanguage(selectedValue) // Update the selected language state
  }

  const handleCodeChange = (value, data) => {
    console.log('Code changed to:', value)
    setCode(value)
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
          style={{ width: '100%', paddingTop: '1rem' }}
          onChange={handleCodeChange}
          className='custom-codemirror'
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
      </Card>
    </div>
  )
}
