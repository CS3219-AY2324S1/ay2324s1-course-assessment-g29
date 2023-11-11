import { useEffect } from 'react'
import { Box } from '@mui/material'
import Card from '@mui/material/Card'
import Typography from '@mui/material/Typography'
import { Link } from 'react-router-dom'
import { Table, Input } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import {
  selectUserid,
  selectPreviousRooms,
  setPreviousRooms,
  selectPreviousQuestions,
  setPreviousQuestions
} from '../redux/UserSlice'
import { setShowError, setErrorMessage } from '../redux/ErrorSlice'
import { useSelector, useDispatch } from 'react-redux'
import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'
import { formatDistanceToNow } from 'date-fns'

const PreviousQuestionsDone = () => {
  const dispatch = useDispatch()
  const userid = useSelector(selectUserid)
  const previousRooms = useSelector(selectPreviousRooms)
  const previousQuestions = useSelector(selectPreviousQuestions)

  useEffect(() => {
    axios
      .get(`http://localhost:3001/user/history/${userid}`)
      .then((response) => {
        console.log(response.data.history)
        const rooms = []
        response.data.history.forEach((room) => {
          rooms.push(room)
        })
        dispatch(setPreviousRooms(rooms))
      })
      .catch((error) => {
        console.log(error)
        dispatch(setErrorMessage(error.message))
        dispatch(setShowError(true))
      })
  }, [dispatch, userid])

  useEffect(() => {
    const fetchPromises = previousRooms.map((room) => {
      return axios
        .get(`http://localhost:8000/room/getHistory/${room}`)
        .then((response) => {
          return {
            roomId: room,
            attempt: response.data.roomInfo
          }
        })
        .catch((error) => {
          dispatch(setErrorMessage(error.message))
          dispatch(setShowError(true))
        })
    })

    let attempts = []
    Promise.all(fetchPromises)
      .then((results) => {
        attempts = results.filter((result) => result !== null)

        // Sort attempts by timestamp in descending order
        attempts.sort((a, b) => b.attempt.timestamp - a.attempt.timestamp)

        dispatch(setPreviousQuestions(attempts))
      })
      .catch((error) => {
        console.error(error)
      })
  }, [previousRooms, dispatch])

  const pagination = {
    pageSize: 5,
    showSizeChanger: false
  }

  const data = () => {
    if (previousQuestions === undefined) {
      return []
    }

    let result = []
    result = previousQuestions
      .filter(attemptData => attemptData && attemptData.attempt)
      .map((attemptData) => {
        return (
          {
            roomId: attemptData.roomId,
            title: attemptData.attempt.questionData.displayName,
            complexity: attemptData.attempt.questionData.difficulty,
            timestamp: attemptData.attempt.timestamp,
            question: attemptData.attempt.questionData,
            key: uuidv4()
          }
        )
      })
    return result
  }

  const columns = [
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
      width: '50%',
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
      },
      render: (text, record) => (
        <Link to={`/previousAttempt/${record.roomId}`}>{text}</Link>
      )
    },
    {
      title: 'Complexity',
      dataIndex: 'complexity',
      key: 'complexity',
      width: '20%',
      filters: [
        { text: 'Hard', value: 'Hard' },
        { text: 'Easy', value: 'Easy' },
        { text: 'Medium', value: 'Medium' }
      ],
      onFilter: (value, record) => record.complexity.includes(value)
    },
    {
      title: 'Time',
      dataIndex: 'timestamp',
      key: 'timestamp',
      width: '20%',
      sorter: (a, b) => b.timestamp - a.timestamp,
      render: (text, record) => {
        // Calculate the time difference in milliseconds
        const timeDifference = Date.now() - record.timestamp
        // Format the time difference as 'X hours ago' or 'X days ago'
        const formattedTime =
          timeDifference < 24 * 60 * 60 * 1000
            ? formatDistanceToNow(record.timestamp, { addSuffix: true })
            : `on ${new Date(record.timestamp).toLocaleDateString()}`
        return <span>{formattedTime}</span>
      }
    }
  ]
  return (
    <Box sx={{ p: 2 }}>
      <Card flex={1} variant='outlined' sx={{ p: 2 }}>
        <Typography
          variant='body'
          marginBottom='3rem'
          fontWeight='bold'
        >
          Previous questions done
        </Typography>
        <div style={{ overflowY: 'auto', paddingTop: '1%' }}>
          <Table
            style={{ padding: '1%' }}
            dataSource={data()}
            columns={columns}
            pagination={pagination}
            size='small'
          />
        </div>
      </Card>
    </Box>
  )
}

export default PreviousQuestionsDone
