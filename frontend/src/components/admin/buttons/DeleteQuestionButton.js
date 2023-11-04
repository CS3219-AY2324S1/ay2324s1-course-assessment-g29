import { Button } from 'antd'
import React from 'react'

const DeleteQuestionButton = ({id, setQuestions, questions}) => {

    const deleteQuestion = (name) => {
        
    }

    return (
        <Button type='primary' onClick={() => deleteQuestion(id)}>
            Delete
        </Button>
    )
}

export default DeleteQuestionButton