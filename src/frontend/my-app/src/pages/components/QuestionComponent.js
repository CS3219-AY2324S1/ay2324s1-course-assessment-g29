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
 
export const QuestionComponent = ({questionId}) => {

  const [question , setQuestion] = useState("Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice. You can return the answer in any order.");
  const [questionNo, setQuestionNo] = useState(123);
  const [questionTitle, setQuestionTitle] = useState("Two Sum");
  const [tags, setTags] = useState(["Array", "Hash Table"]);
  const [difficulty, setDifficulty] = useState("Hard");

    // TODO: Fetch question data from backend using QuestionId
    // useEffect(() => {
    //   if (questionId) {
    //     fetch(`/api/questions/${questionId}`)
    //       .then((response) => response.json())
    //       .then((data) => {
    //         setQuestionData(data);
    //       })
    //       .catch((error) => {
    //         console.error("Error fetching question data:", error);
    //         setQuestionData(null); 
    //       });
    //   }
    // }, [questionId]);

    return (
    <div style={{padding: "1rem"}}>
        <h2>{questionNo}. {questionTitle}</h2>
        <h3>
            <span style={{color: getColourbyDifficulty(difficulty)}}> {difficulty}</span>
        </h3>
        <div>
            {tags.map((tag, index) => (
                console.log(tag),
                <Chip key={index} label={tag} style={{ marginRight: "0.5rem" }}/>
            ))}
        </div>
        
        
        <p>{question}</p>
        
    </div>
    )
}
