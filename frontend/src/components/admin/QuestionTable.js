import { Input, Table, Space, Tag } from 'antd'
import { Box } from '@mui/system'
import React, { useEffect, useState, dispatch } from 'react'
import EditQuestionButton from './buttons/EditQuestionButton'
import CreateQuestionButton from './buttons/CreateQuestionButton'
import DeleteQuestionButton from './buttons/DeleteQuestionButton'
import ViewMoreButton from './buttons/ViewMoreButton'
import { SearchOutlined } from '@ant-design/icons'
import { v4 as uuidv4 } from "uuid";
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

  const columns = [
    // {
    //   title: "Id",
    //   dataIndex: "id",
    //   key: "id",
    // },
    {
      title: "Title",
      dataIndex: "displayName",
      key: "displayName",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              id={`filter-title`}
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.title.toLowerCase().includes(value.toLowerCase());
      },
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
      filterDropdown: ({ setSelectedKeys, selectedKeys, confirm }) => {
        return (
          <>
            <Input
              autoFocus
              id={`filter-description`}
              name={"description"}
              placeholder="Type text here"
              value={selectedKeys[0]}
              onChange={(e) => {
                setSelectedKeys(e.target.value ? [e.target.value] : []);
                confirm({ closeDropdown: false });
              }}
              onPressEnter={() => {
                confirm();
              }}
              onBlur={() => {
                confirm();
              }}
            ></Input>
          </>
        );
      },
      filterIcon: () => {
        return <SearchOutlined />;
      },
      onFilter: (value, record) => {
        return record.description.toLowerCase().includes(value);
      },
    },
    {
      title: "Difficulty",
      dataIndex: "difficulty",
      key: "difficulty",
      filters: [
        { text: "Hard", value: "Hard" },
        { text: "Easy", value: "Easy" },
        { text: "Medium", value: "Medium" },
      ],
      onFilter: (value, record) => record.complexity.includes(value),
    },

    {
      title: "Topic",
      dataIndex: "topic",
      key: "topic",
      render: (tags) => {
        return (
          <>
            {tags &&
              tags.map((tag) => {
                return (
                  <Tag color="green" key={tag}>
                    {tag}
                  </Tag>
                );
              })}
          </>
        )
      },
      filters: [
        { text: "Algorithms", value: "algorithms" },
        { text: "Data Structures", value: "data-structures" },
        { text: "Recursion", value: "recursion" },
        { text: "Bit Manipulation", value: "bit-manipulation" },
        { text: "Hash Table", value: "hash-table" },
        { text: "Strings", value: "strings" },
        { text: "Array", value: "array" },
        { text: "Recursion", value: "recursion" },
      ],
      onFilter: (value, record) => record.tags.includes(value),
    },
    {
      title: "Actions",
      dataIndex: "actions",
      key: "actions",
      render: (text, record, index) => (
        <Space>
          <ViewMoreButton question={record} />
          <DeleteQuestionButton questions={questions} setQuestions={setQuestions} name={record.name} />
          <EditQuestionButton question={record} />
        </Space>
      ),
    },
  ];

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
    <Box display='flex' flexDirection='column' alignContent='flex-start' flex={1} justifyContent="center">
      <Navbar />
      <Box
        display='flex'
        flexDirection='column'
        justifyItems="center"
        flex={1}
      >
        <div style={{ display: 'flex', justifyContent: "space-between", alignItems: "center" }}>
          <h2 style={{ paddingLeft: '1.5%', paddingTop: '1%' }}>
            Question Table
          </h2>
          <div style={{ marginLeft: 'auto', paddingRight: '1.5%', paddingTop: '1%' }}>
            {<CreateQuestionButton />}
          </div>
        </div>
        <Table
          style={{ padding: '1%' }}
          dataSource={data}
          columns={columns}
        />
      </Box>
    </Box>
  )
}

export default QuestionTable