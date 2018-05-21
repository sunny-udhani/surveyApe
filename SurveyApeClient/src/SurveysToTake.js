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
    API.surveyeeSurveys().
    then((res)=>{
      if(res.surveys && res.surveys.length>0){
        this.setState({surveys:res.surveys});
      }
      else{
        alert("Some issue in fetching surveys");
      }
      console.log(res);
    })
  }

  render(){
    return (
      <div style={{textAlign:"center"}}>
        <h3>Surveys Assigned To You</h3>
          <div style={{marginLeft:"30%"}}>

            <br/><br/>
            <table style={{border:"1px solid black"}}>
              <tr>
              <th style={{borderRight:"1px solid black"}}>Survey Title</th>
              <th>Survey URL</th>
              </tr>
              {this.state.surveys.map((item)=>{
                 return <tr><td style={{borderRight:"1px solid black"}}>{item.surveyTitle}</td>
                 <td><a href={item.surveyURI}>{item.surveyURI}</a></td>
                 </tr>;
              }
              //
              )}
            </table>
            <br/><br/>
          </div>

      </div>
    );
  }
}

export default SurveysToTake;
