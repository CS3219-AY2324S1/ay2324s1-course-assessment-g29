import React, { useEffect, dispatch } from 'react'
import { LeftOutlined } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { Form, Button, Input, Checkbox, Radio, FloatButton } from 'antd'
import { PageHeader } from '@ant-design/pro-layout'
import axios from 'axios'
import { setErrorMessage, setShowError } from '../../redux/ErrorSlice'
import TextArea from 'antd/es/input/TextArea'

const CreateNewQuestion = ({ questions, setQuestions }) => {
  const navigate = useNavigate()

  useEffect(() => {
    axios
      .get('http://localhost:3002/question/getAll')
      .then((response) => {
        setQuestions(response.data)
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }, [setQuestions])

  const addQuestion = async (values) => {
    const QuestionObject = {
      name: values.id,
      displayName: values.title,
      description: values.description,
      difficulty: values.complexity,
      topic: values.tags
    }
    console.log(QuestionObject)

    await axios
      .post('http://localhost:3002/question/post', QuestionObject)
      .then((response) => {
        navigate('/admin/questions')
        // TODO: Add success message
      })
      .catch((error) => {
        console.log(error.message)
      })
  }

  const tagOptions = [
    'data-structures', 'recursion', 'bit-manipulation', 'hash-table', 'strings', 'array', 'algorithms', 'brainteaser'
  ]
  const complexityOptions = ['Easy', 'Medium', 'Hard'] // Define your complexity options here
  const questionsID = questions.map((question) => question.name)

  return (
    <div>
      <PageHeader
        onBack={() => navigate('/admin/questions')}
        title='Creating New Question'
      />
      <Form
        style={{ padding: '2%' }}
        onFinish={(values) => {
          addQuestion(values)
          navigate('/questions')
        }}
        autoComplete='off'
        labelCol={{ span: 3 }}
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
          sx={{ width: "auto" }}
        >
          <TextArea placeholder='Input Description' rows='5'/>
        </Form.Item>
        <Form.Item
          name='id'
          label='ID'
          rules={[
            {
              required: true
            },
            { whitespace: false }, 
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (questionsID.includes(value)) {
                  return Promise.reject(new Error("ID already exists"));
                }
                return Promise.resolve();
              },
            }),
          ]}
          hasFeedback
        >
          <Input placeholder='Input ID' />
        </Form.Item>
        <Form.Item
          name='tags'
          label='Tags'
          rules={[
            {
              required: true,
              message: 'Please select at least one tag'
            }
          ]}
        >
          <Checkbox.Group options={tagOptions} />
        </Form.Item>
        <Form.Item
          name='complexity'
          label='Complexity'
          rules={[
            {
              required: true,
              message: 'Please select the complexity'
            }
          ]}
        >
          <Radio.Group options={complexityOptions} />
        </Form.Item>
        <Form.Item>
          <Button block type='primary' htmlType='submit'>
            Add New
          </Button>
        </Form.Item>
      </Form>
    </div>
  )
}

export default CreateNewQuestion
