import React, {Component} from 'react';
import * as API from './api/API';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';

class SurveyDetails extends Component{
  constructor(props){
    super(props);
    this.state={
      name:"SampleSurvey",
      startTime:10,
      endTime:100,
      currentTime:50,
      totalCount:100,
      totalSubmissions: 20,
      registeredSurveyees: 10,
      totalInvited: 32,
    }
  }
  componentWillMount(){
    console.log("data");
    console.log(this.props.response.survey);
  }
  render(){
    return (
      <div>

        <h3>Survey Name: {this.state.name}</h3>
        <h3>Start Time: {this.state.startTime}</h3>
        <h3>End Time: {this.state.endTime}</h3>
        <h3>Percentage complete: {100*(this.state.totalSubmissions/this.state.totalCount)} %</h3>


        <div className="row" >

          <div className="col-lg-5">
              <h5>Total Participants: {this.state.totalInvited}</h5>
              <h5>Total Number of Submissions: {this.state.totalSubmissions}</h5>
              <h5>Complete Percentage: {100*(this.state.totalSubmissions/this.state.totalInvited)}</h5>
          </div>

            <div className="col-lg-7">

              <BarChart width={600} height={400}data={[
                { name: 'Total Participants', value: this.state.totalInvited },
                 { name: 'Total Submissions', value: this.state.totalSubmissions },
                  { name: 'Complete %', value: 100*(this.state.totalSubmissions/this.state.totalInvited) }
              ]}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" fill="white" />
                  <YAxis type="number" domain={[0, 100]}/>
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" fill="blue" />
              </BarChart>

          </div>

        </div>


        <div className="row" >

          <div className="col-lg-7">
              <h5>Total Questions in the Survey: {this.props.response.survey.questionList.length}</h5>

              {this.props.response.survey.questionList.map(question => (
                    <div className="row" >

                      <h5> {question.questionText} </h5>


                    </div>
          ))}

          </div>

            <div className="col-lg-5">



          </div>

        </div>




      </div>
    );
  }
}


export default SurveyDetails;
