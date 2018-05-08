import React, {Component} from 'react';
import * as API from './api/API';

class EditSurvey extends Component{
  constructor(props){
    super(props);
    this.state={
      a:""
    }
    API.getSurvey(this.props.surveyId)
    .then((res) => {
        console.log(res);
    });

  }

  componentWillMount(){

  }

  render(){
    return(
      <div>
        {this.props.surveyId}
        {this.state.a}
        SurveyName
        SURVEY Type
        Survey Start Date
        Survey End Date
        Add question
        Questions List Populate
        Delete question

      </div>
    );
  }
}

export default EditSurvey;
