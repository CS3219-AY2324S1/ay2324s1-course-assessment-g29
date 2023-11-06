import React, { useState, useEffect, dispatch } from 'react'
import {
  useParams, useNavigate
} from 'react-router-dom'
import { Form, Button, Input, Radio, Checkbox } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import TextArea from 'antd/lib/input/TextArea'
import axios from 'axios'
import { setErrorMessage, setShowError } from '../../redux/ErrorSlice'

const EditQuestion = () => {
  const navigate = useNavigate()
  const nameId = useParams().name

  const [newTitle, setNewTitle] = useState('')
  const [newDescription, setNewDescription] = useState('')
  const [newComplexity, setNewComplexity] = useState('')
  const [newTags, setNewTags] = useState([])
  const [newId, setNewId] = useState(0)

  const tagOptions = [
    'data-tructures', 'recursion', 'bit-manipulation', 'hash-table', 'strings', 'array', 'algorithms', 'brainteaser'
  ]

  useEffect(() => {
    axios
      .get(`http://localhost:3002/question/getOneByName/${nameId}`)
      .then((question) => {
        console.log(question.data)
        setNewTitle(question.data.displayName)
        setNewDescription(question.data.description)
        setNewComplexity(question.data.difficulty)
        setNewId(question.data.name)
        setNewTags(question.data.topic)
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }, [nameId])

  const updateQuestion = (values) => {
    console.log(values)
    const questionObject = {
      name: values.id,
      displayName: values.title,
      description: values.description,
      difficulty: values.complexity,
      topic: values.tags
    }
    axios
      .patch(`http://localhost:3002/question/update/${nameId}`, questionObject)
  }

  return (
    <div>
      <PageHeader
        onBack={() => navigate('/admin/questions')}
        title='Editing'
        subTitle={newTitle}
      />
      <Form
        style={{ padding: '2%' }}
        onFinish={(values) => {
          updateQuestion(values)
          navigate('/admin/questions')
        }}
        autoComplete='off'
        labelCol={{ span: 3 }}
        // having fields so that form is already filled up by exisiting data
        fields={[
          {
            name: ['title'],
            value: newTitle
          },
          {
            name: ['description'],
            value: newDescription
          },
          {
            name: ['id'],
            value: newId
          },
          {
            name: ['complexity'],
            value: newComplexity
          },
          {
            name: ['tags'],
            value: newTags
          }
        ]}
      >
        <Form.Item
          name='title'
          label='Title'
          rules={[
            {
              required: true
            },
            { whitespace: true }
          ]}
          hasFeedback
        >
          <Input placeholder='Input Title' />
        </Form.Item>
        <Form.Item
          name='description'
          label='Description'
          rules={[
            {
              required: true
            },
            { whitespace: true }
          ]}
          hasFeedback
        >
          <Input placeholder='Input Description' />
        </Form.Item>
        <Form.Item name='id' label='ID' hasFeedback>
          <Input />
        </Form.Item>
        <Form.Item
          name='complexity'
          label='complexity'
          rules={[
            {
              required: true
            }
          ]}
          hasFeedback
        >
          <Radio.Group value={newComplexity}>
            <Radio value='Easy'>Easy</Radio>
            <Radio value='Medium'>Medium</Radio>
            <Radio value='Hard'>Hard</Radio>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          name='tags'
          label='Tags'
          rules={[
            {
              required: true
            }
          ]}
          hasFeedback
        >
          <Checkbox.Group options={tagOptions} value={newTags} />
        </Form.Item>
        <Form.Item>
          <Button block type='primary' htmlType='submit'>
            Save Changes
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default EditQuestion
