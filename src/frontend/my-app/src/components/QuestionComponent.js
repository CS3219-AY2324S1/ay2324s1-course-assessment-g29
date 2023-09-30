import { useState } from "react"
import { Chip } from "@mui/material";

function getColourbyDifficulty(difficulty) {
    switch (difficulty) {
    case 'Hard':
      return 'red';
    case 'Medium':
      return 'orange';
    case 'Easy':
      return 'green';
    default:
      return 'black';
    }
}
 
export const QuestionComponent = () => {

    const initialState = {
        question: 'Given an array of n integers nums, a 132 pattern is a subsequence of three integers nums[i], nums[j] and nums[k] such that i < j < k and nums[i] < nums[k] < nums[j].\n',
        difficulty: "Hard",
        questionTitle: "132 Patttern",
        tags: ["Array", "binary search"],
        questionNo: 456,
    };

    const [question , setQuestion] = useState(initialState.question);
    const [questionNo, setQuestionNo] = useState(initialState.questionNo);
    const [questionTitle, setQuestionTitle] = useState(initialState.questionTitle);
    const [tags, setTags] = useState(initialState.tags);
    const [difficulty, setDifficulty] = useState(initialState.difficulty);

    return (
    <div style={{padding: "1rem"}}>
        <h2>{questionNo}. {questionTitle}</h2>
        <div>
            {tags.map((tag, index) => (
                console.log(tag),
                <Chip key={index} label={tag}/>
            ))}
        </div>
        <h3>
            <span style={{color: getColourbyDifficulty(difficulty)}}> {difficulty}</span>
        </h3>
        
        <p>{question}</p>
        
    </div>
    )
}
