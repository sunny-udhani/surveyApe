import React, {Component} from 'react';

class SurveyDetails extends Component{
  constructor(props){
    super(props);
    this.state={
      name:"SampleSurvey",
      startTime:10,
      endTime:100,
      currentTime:50,
      submittedCount:10,
      totalCount:100
    }
  }

  render(){
    return (
      <div>
        <h3>Survey Name: {this.state.name}</h3>
        <h3>Start Time: {this.state.startTime}</h3>
        <h3>End Time: {this.state.endTime}</h3>
        <h3>Percentage complete: {100*(this.state.submittedCount/this.state.totalCount)} %</h3>

      </div>
    );
  }
}


export default SurveyDetails;
