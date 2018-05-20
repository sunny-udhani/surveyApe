import React, {Component} from 'react';
import * as API from './api/API';

class SurveysToTake extends Component{
  constructor(props){
    super(props);
    this.state={
      surveys:[]
    }
  }

  componentWillMount(){
    API.assignedSurveys().
    then((res)=>{
      console.log(res);
    })
  }

  render(){
    return (
      <div style={{textAlign:"center"}}>
          <div>
            <h3>Surveys Assigned To You</h3>
            <ul>
              {this.state.surveys.map((item)=>{
                 return <li>item.surveyId</li>;
              }
              //
              )}
            </ul>
            <br/><br/>
          </div>

      </div>
    );
  }
}

export default SurveysToTake;
