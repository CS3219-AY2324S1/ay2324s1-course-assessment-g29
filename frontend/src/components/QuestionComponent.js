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
  console.log(questionData)
  const data = questionData.questionData || { description: '', displayName: '', topic: '', difficulty: '' }
  const [question, setQuestion] = useState(data.description || 'Question Description')
  const [questionNo] = useState(1) // TODO update QuestionService to support
  const [questionTitle, setQuestionTitle] = useState(data.displayName || 'Question Title')
  const [tags, setTags] = useState(data.topic || [])
  const [difficulty, setDifficulty] = useState(data.difficulty) // TODO update QuestionService to support

  useEffect(() => {
    console.log(data.description)
    setQuestion(data.description)
    setQuestionTitle(data.displayName)
    setTags(data.topic)
    setDifficulty(data.difficulty)
  }, [data])

  return (
    <div style={{ padding: '1rem' }}>
      <h2>
        {questionNo}. {questionTitle}
      </h2>
      <h3>
        <span style={{ color: getColourbyDifficulty(difficulty) }}>
          {' '}
          {difficulty}
        </span>
      </h3>
      <div>
        {tags &&
          tags.map((tag, index) => {
            return (
              <Chip key={index} label={tag} style={{ marginRight: '0.5rem' }} />
            )
          })}
      </div>
      <p>{question}</p>
    </div>
  )
}
