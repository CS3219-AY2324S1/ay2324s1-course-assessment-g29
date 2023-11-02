import { useEffect, useState } from 'react'
import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Table, Tag, Space, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import {
  selectUserid,
  selectPreviousRooms,
  setPreviousRooms,
} from '../redux/UserSlice'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'

const PreviousQuestionsDone = () => {
  const dispatch = useDispatch()
  const userid = useSelector(selectUserid)
  const previousRooms = useSelector(selectPreviousRooms)

  const pagination = {
    pageSize: 5,
    showSizeChanger: false
  }

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/history/${userid}`)
      .then((response) => {
        console.log(userid)
        dispatch(setPreviousRooms(response.data.history))
      })
      .catch((error) => {
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }, [])

  // const data = questions.map((question, index) => {
  //   return (
  //     {
  //       id: index + 1,
  //       title: question.displayName,
  //       description: question.description,
  //       complexity: question.difficulty,
  //       tags: question.topic,
  //       originalRecord: question,
  //       key: uuidv4()
  //     }
  //   )
  // })

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <div>
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
          </div>
        )
      },
      filterIcon: () => {
        return <SearchOutlined />
      },
      onFilter: (value, record) => {
        return record.title.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: 'Complexity',
      dataIndex: 'complexity',
      key: 'complexity',
      filters: [
        { text: 'Hard', value: 'Hard' },
        { text: 'Easy', value: 'Easy' },
        { text: 'Medium', value: 'Medium' }
      ],
      onFilter: (value, record) => record.complexity.includes(value)
    },
    {
      title: 'Tags',
      dataIndex: 'tags',
      key: 'tags',
      render: (_, { tags }) => (
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
      ),
      filters: [
        { text: 'Algorithms', value: 'algorithms' },
        { text: 'Data Structures', value: 'data structures' },
        { text: 'Recursion', value: 'recursion' },
        { text: 'Bit Manipulation', value: 'bit manipulation' }
      ],
      onFilter: (value, record) => record.tags.includes(value)
    },
    {
      title: 'Actions',
      dataIndex: 'actions',
      key: 'actions',
      render: (text, record, index) => (
        <Space />
      )
    }
  ]
  return (
    <Box sx={{ p: 2 }}>
      <Card flex={1} variant='outlined' sx={{ p: 2 }} >
        <Typography
          variant='body'
          marginBottom='3rem'
          fontWeight='bold'
        >
          Previous questions done
        </Typography>
        <div style={{ maxHeight: '300px', overflowY: 'auto' }}>
          <Table
            style={{ padding: '1%' }}
            // dataSource={data}
            columns={columns}
            pagination={pagination}
            size="small"
          /></div>
      </Card>
    </Box>
  )
}
export default PreviousQuestionsDone
