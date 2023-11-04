import { Button } from "antd";
import React from "react";
import { Link } from "react-router-dom";

const CreateQuestionButton = () => {
  return (
    <Link to="./create">
      <Button type="primary">Add New</Button>
    </Link>
  );
};

export default CreateQuestionButton;
