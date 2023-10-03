import { useState, useEffect } from 'react'
import { Chip } from '@mui/material'

function getColourbyDifficulty(difficulty) {
  switch (difficulty) {
    case 'Hard':
      return 'red'
    case 'Medium':
      return 'orange'
    case 'Easy':
      return 'green'
    default:
      return 'black'
  }
}

export const QuestionComponent = (questionData) => {
  const data = questionData['questionData']
  const [question] = useState(data['description'] || 'Question Description')
  const [questionNo] = useState(1) // TODO update QuestionService to support
  const [questionTitle] = useState(data['name'] || 'Question Title')
  const [tags] = useState(data['tag'] || [])
  const [difficulty] = useState('Easy') // TODO update QuestionService to support

  return (
    <div style={{ padding: '1rem' }}>
      <h2>{questionNo}. {questionTitle}</h2>
      <h3>
        <span style={{ color: getColourbyDifficulty(difficulty) }}> {difficulty}</span>
      </h3>
      <div>
        {tags.map((tag, index) => {
          return <Chip key={index} label={tag} style={{ marginRight: '0.5rem' }} />
        })}
      </div>
      <p>{question}</p>
    </div>
  )
}
