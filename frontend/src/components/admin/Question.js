import React, { useEffect, dispatch } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import DescriptionsItem from 'antd/lib/descriptions/Item'
import { Descriptions, Tag } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import axios from 'axios'
import { setErrorMessage, setShowError } from '../../redux/ErrorSlice'

const Question = ({ questions, setQuestions }) => {
  const navigate = useNavigate()

  const nameId = useParams().name

  useEffect(() => {
    axios
      .get('http://34.125.231.246:3002/question/getAll')
      .then((response) => {
        setQuestions(response.data)
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }, [setQuestions])

  const question = questions.find(question => question.name === nameId)

  // conditional statement to prevent error since book is undefined before useEffect fires
  if (question !== undefined) {
    return (
      <div>
        <PageHeader
          onBack={() => navigate('/admin/questions')}
          title='Question Information'
        />
        <Descriptions
          style={{ padding: '2%' }}
          title={question.title}
          layout='vertical'
          bordered
          column={{ sm: 1, xs: 1 }}
        >
          {/* <DescriptionsItem label="ID">{question.id}</DescriptionsItem> */}
          <DescriptionsItem label='Title'>
            {question.displayName}
          </DescriptionsItem>
          <DescriptionsItem label='Complexity'>
            {question.difficulty}
          </DescriptionsItem>
          <DescriptionsItem label='Tags'>
            {question.topic.map((tag) => (
              <Tag key={tag}>{tag}</Tag>
            ))}
          </DescriptionsItem>
          <DescriptionsItem label='Description'>
            {question.description}
          </DescriptionsItem>
        </Descriptions>
      </div>
    )
  }
  return null
}

export default Question
