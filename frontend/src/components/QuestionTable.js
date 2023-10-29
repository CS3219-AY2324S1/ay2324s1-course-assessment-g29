import { Input, Table, Space, Tag, Button } from 'antd'
import { SearchOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from 'uuid'

const QuestionTable = ({ questions, setQuestions, signalChangeQuestion }) => {
  //   const [filteredQuestions, setFilteredQuestions] = useState([])

  //   const handleFilterSearch = (column, value) => {
  //     const filtered = questions.filter((question) =>
  //       question[column].toLowerCase().includes(value.toLowerCase())
  //     )
  //     setFilteredQuestions(filtered)
  //   }

  // header for table + able to filter data using filterDropdown
  const columns = [
    {
      title: 'Id',
      dataIndex: 'id',
      key: 'id'
    },
    {
      title: 'Title',
      dataIndex: 'title',
      key: 'title',
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
        return record.title.toLowerCase().includes(value.toLowerCase())
      }
    },
    {
      title: 'Description',
      dataIndex: 'description',
      key: 'description',
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
        <Space>
          <Button type='primary' onClick={() => signalChangeQuestion(record.originalRecord)}>
            Change Question
          </Button>
        </Space>
      )
    }
  ]

  // data to fill up the rows of the table
  const data = questions.map((question, index) => {
    return (
      {
        id: index + 1,
        title: question.displayName,
        description: question.description,
        complexity: question.difficulty,
        tags: question.topic,
        originalRecord: question,
        key: uuidv4()
      }
    )
  })

  return (
    <div style={{ justifyContent: 'start', alignItems: 'start' }}>
      <div style={{ display: 'flex' }}>
        <h2 style={{ paddingLeft: '1.5%', paddingTop: '1%' }}>
          Question Table
        </h2>
      </div>
      <Table
        style={{ padding: '1%' }}
        dataSource={data}
        columns={columns}
      />
    </div>
  )
}

export default QuestionTable
