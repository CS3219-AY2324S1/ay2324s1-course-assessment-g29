import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const EditQuestionButton = ({question}) => {
    return (
        <Link to={`/admin/questions/edit/${question.name}`}>
            <Button type='primary'>
                Edit
            </Button>
        </Link>
    )
}

export default EditQuestionButton