import { useState, useEffect } from 'react'
import { Chip } from '@mui/material'
import MarkdownPreview from '@uiw/react-markdown-preview'

function getColourbyDifficulty (difficulty) {
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
  const data = questionData.questionData || { description: '', displayName: '', topic: '', difficulty: '' }
  const [question, setQuestion] = useState(data.description || 'Question Description')
  const [questionTitle, setQuestionTitle] = useState(data.displayName || 'Question Title')
  const [tags, setTags] = useState(data.topic || [])
  const [difficulty, setDifficulty] = useState(data.difficulty) // TODO update QuestionService to support

  useEffect(() => {
    setQuestionTitle(data.displayName)
    setTags(data.topic)
    setDifficulty(data.difficulty)
    setQuestion(data.description)
  }, [data])

  return (
    <>
      <h2 style={{ margin: 0, padding: 0 }}>
        {questionTitle}
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
      <MarkdownPreview
        source={question} wrapperElement={{ 'data-color-mode': 'light' }}
      />
    </>
  )
}
