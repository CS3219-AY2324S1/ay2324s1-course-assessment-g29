import { Input, Table, Space, Tag } from 'antd'
import { Box } from '@mui/system'
import React, { useEffect, dispatch } from 'react'
import EditQuestionButton from './buttons/EditQuestionButton'
import CreateQuestionButton from './buttons/CreateQuestionButton'
import DeleteQuestionButton from './buttons/DeleteQuestionButton'
import ViewMoreButton from './buttons/ViewMoreButton'
import { SearchOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'
import axios from 'axios'
import { setErrorMessage, setShowError } from '../../redux/ErrorSlice'
import Navbar from '../Navbar'

const QuestionTable = ({ questions, setQuestions }) => {
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

  const handleDelete = (questionName) => {
    // Filter out the record to be deleted based on its key
    const newData = questions.filter(item => item.name !== questionName)
    setQuestions(newData)
  }

  const columns = [
    {
      title: 'Id',
      dataIndex: 'name',
      key: 'name', 
      width: '6%'
    },
    {
      title: 'Title',
      dataIndex: 'displayName',
      key: 'displayName',
      width: '10%',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              id='filter-title'
              placeholder='Type text here'
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : [])
                confirm({ closeDropdown: false })
              }}
              onPressEnter={() => {
                confirm()
              }}
              onBlur={() => {
                confirm()
              }}
            />
          </>
        )
      },
      filterIcon: () => {
        return <SearchOutlined />
      },
      onFilter: (value, record) => {
        return record.displayName.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
      width: '60%',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              id='filter-description'
              name='description'
              placeholder='Type text here'
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : [])
                confirm({ closeDropdown: false })
              }}
              onPressEnter={() => {
                confirm()
              }}
              onBlur={() => {
                confirm()
              }}
            />
          </>
        )
      },
      filterIcon: () => {
        return <SearchOutlined />
      },
      onFilter: (value, record) => {
        return record.description.toLowerCase().includes(value)
      }
    },
    {
      title: 'Difficulty',
      dataIndex: 'difficulty',
      key: 'difficulty',
      width: '6%',
      filters: [
        { text: 'Hard', value: 'Hard' },
        { text: 'Easy', value: 'Easy' },
        { text: 'Medium', value: 'Medium' }
      ],
      onFilter: (value, record) => {
        return record.difficulty.includes(value)
      }
    },

    {
      title: 'Topic',
      dataIndex: 'topic',
      key: 'topic',
      width: '6%', 
      render: (tags) => {
        return (
          <>
            {tags &&
              tags.map((tag) => {
                return (
                  <Tag color='green' key={tag}>
                    {tag}
                  </Tag>
                )
              })}
          </>
        )
      },
      filters: [
        { text: 'Algorithms', value: 'algorithms' },
        { text: 'Data Structures', value: 'data-structures' },
        { text: 'Recursion', value: 'recursion' },
        { text: 'Bit Manipulation', value: 'bit-manipulation' },
        { text: 'Hash Table', value: 'hash-table' },
        { text: 'Strings', value: 'strings' },
        { text: 'Array', value: 'array' },
        { text: 'Brainteasers', value: 'brainteasers' }
      ],
      onFilter: (value, record) => record.topic.includes(value)
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record, index) => (
        <Space>
          <ViewMoreButton question={record} />
          <DeleteQuestionButton questions={questions} setQuestions={setQuestions} name={record.name} handleDelete={() => handleDelete(record.name)} />
          <EditQuestionButton question={record} />
        </Space>
      )
    }
  ]

  // data to fill up the rows of the table
  const data = questions.map(question => {
    return (
      {
        displayName: question.displayName,
        name: question.name,
        description: question.description,
        difficulty: question.difficulty,
        topic: question.topic,
        key: uuidv4()
      }
    )
  })

  return (
    <Box display='flex' flexDirection='column' flex={1} justifyContent='center'
      alignContent='flex-start' >
      <Navbar />
      <Box
        width='80%'
        justifyContent='center'
        flex={1}
        margin='auto'
      >
        <Box style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ paddingLeft: '1.5%', paddingTop: '1%' }}>
            Question Table
          </h2>
          <div style={{ marginLeft: 'auto', paddingRight: '1.5%', paddingTop: '1%' }}>
            <CreateQuestionButton />
          </div>
        </Box>
        <Box>
          <Table
            style={{ padding: '1%' }}
            dataSource={data}
            columns={columns}
          />
        </Box>
      </Box>
    </Box>
  )
}

export default QuestionTable
