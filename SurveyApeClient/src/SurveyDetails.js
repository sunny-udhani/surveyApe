import React, {Component} from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from 'recharts';

class SurveyDetails extends Component{
  constructor(props){
    super(props);
    this.state={
      name:"SampleSurvey",
      startTime:10,
      endTime:100,
      currentTime:50,
      submittedCount:10,
      totalCount:100,
      questions:[{qid:1,questionText:"Sample question?",options:[1,2,3,4,5]},{qid:2,questionText:"Sample question?",options:[1,2,3,4,5]},{qid:3,questionText:"Sample question?",options:[1,2,3,4,5]},
    {qid:4,questionText:"Sample question?",options:[1,2,3,4,5]},{qid:5,questionText:"Sample question?",options:[1,2,3,4,5]}],
      answers:[{qid:1,answerSelected:2},{qid:1,answerSelected:3},{qid:1,answerSelected:3},{qid:1,answerSelected:3},{qid:1,answerSelected:2},
      {qid:2,answerSelected:5},{qid:2,answerSelected:2},{qid:2,answerSelected:2},{qid:2,answerSelected:2},{qid:2,answerSelected:2},{qid:2,answerSelected:2},
      {qid:3,answerSelected:2},{qid:3,answerSelected:2},{qid:3,answerSelected:2},{qid:3,answerSelected:2},{qid:3,answerSelected:2},
      {qid:4,answerSelected:2},{qid:4,answerSelected:2},{qid:4,answerSelected:2},{qid:4,answerSelected:2},{qid:4,answerSelected:2},
      {qid:5,answerSelected:1},{qid:5,answerSelected:2},{qid:5,answerSelected:2},{qid:5,answerSelected:3},{qid:5,answerSelected:3}
    ]

    }
  }

  render(){
    return (
      <div>
        <h3>Survey Name: {this.state.name}</h3>
        <h3>Start Time: {this.state.startTime}</h3>
        <h3>End Time: {this.state.endTime}</h3>
        <h3>Percentage complete: {100*(this.state.submittedCount/this.state.totalCount)} %</h3>
        <ul>
        {this.state.questions.map((item)=>{
            
        })}
      </ul>
      </div>
    );
  }
}


export default SurveyDetails;
