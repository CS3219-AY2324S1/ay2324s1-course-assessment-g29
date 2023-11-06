import { Button } from 'antd'
import React from 'react'
import { Link } from 'react-router-dom'

const ViewMoreButton = ({ question }) => {
  return (
    <Link to={`./${question.name}`}>
      <Button type='primary'>
        View More
      </Button>
    </Link>
  )
}

export default ViewMoreButton
