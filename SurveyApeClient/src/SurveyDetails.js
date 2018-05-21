import React, {Component} from 'react';
import * as API from './api/API';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Legend, Bar } from 'recharts';
import Logo from './logo.png';

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
    console.log(this.props.response);

    var output = [];
    for(var i=0;i<this.props.response.survey.questionList.length;i++)
    {
      for(var j=0;j<this.props.response.survey.questionList[i].questionOptionList.length;j++)
      {
        var optionText = this.props.response.survey.questionList[i].questionOptionList[j].optionText;

        // count in responselist how many times each option occurs.
        console.log(optionText);

        var count=0;
        for(var k=0; k<this.props.response.survey.questionList[i].questionResponseList.length; k++)
        {

          if((this.props.response.survey.questionList[i].questionResponseList[k].response) === optionText)
          {
            count++;
          }
        }
        console.log(count);
        var questionText = this.props.response.survey.questionList[i].questionText;

        var obj = {};

        obj.questionText = questionText;

        obj["responses"] = {
          "optionText": optionText,
          "responseCount": count
        };

        output.push(obj);
    }
    }

    console.log("Output built: ");
      console.log(output);


      this.setState({
        output: output
      });

  }

  render(){

    if((this.props.response.survey.surveyType === 1) && (this.props.response.competedResponses > 2)){
      return (
        <div>

        <div className="row bar">
            <div className="col-lg-1 logo">
                <img src={Logo} />
            </div>
            <div className="col-lg-2 textLogo">
              Survey Ape
            </div>
            <div className="col-lg-2" style={{paddingTop: 38}}>
              <h5  style={{color: "#268D5D", fontWeight: 700}} onClick={()=>{this.props.gotoDashboard()}}>Dashboard</h5>
            </div>

            <div className="col-lg-2" style={{paddingTop: 38}}>
              <h5  style={{color: "#268D5D", fontWeight: 700}} onClick={()=>{this.props.logout()}}>Logout</h5>
            </div>

        </div>

          <h3>Survey Name: {this.props.response.survey.surveyTitle}</h3>
          <h3>Start Date: {this.props.response.survey.startDate}</h3>
          <h3>End Date {this.props.response.survey.endDate}</h3>

          <div className="row" >

            <div className="col-lg-5">
                <h5>Total Number of Submissions: {this.props.response.survey.responseList.length}</h5>
            </div>

              <div className="col-lg-7">

                <BarChart width={300} height={400}data={[

                   { name: 'Total Submissions', value: this.props.response.survey.responseList.length }
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

            <div className="col-lg-12">
                <h5>Total Questions in the Survey: {this.props.response.survey.questionList.length}</h5>

                {this.props.response.survey.questionList.map((question,i) => (
                      <div className="row" >
                          <div className="col-lg-12">
                            <div className="row" style={{paddingLeft: 20}}>
                              <h5>Question:  <span style={{color: "green"}}>{question.questionText}</span> </h5>
                            </div>
                          </div>


                    <div className="col-lg-12" style={{border: "1px solid"}}>
                      <div className="row">
                        {this.state.output.map(optionsAndCount => (



                          <div>
                            {(optionsAndCount.questionText) === question.questionText ? (<div className="col-lg-3" style={{paddingTop: 20}}>

                              <h5> <span style={{fontWeight: 600}}>Option Text: </span>{optionsAndCount.responses.optionText}</h5>
                              <h5> <span style={{fontWeight: 600}}>Response Count: </span>{optionsAndCount.responses.responseCount}</h5>
                              <br/>
                              </div>): (<span></span>)}

                          </div>



                        ))}
                      </div>
                    </div>

                      </div>
            ))}

            </div>

              <div className="col-lg-5">



            </div>

          </div>




        </div>
      );
    } else if((this.props.response.survey.surveyType === 2) && (this.props.response.competedResponses > 2)) {

      return (
        <div>

        <div className="row bar">
            <div className="col-lg-1 logo">
                <img src={Logo} />
            </div>
            <div className="col-lg-2 textLogo">
              Survey Ape
            </div>
            <div className="col-lg-2" style={{paddingTop: 38}}>
              <h5  style={{color: "#268D5D", fontWeight: 700}} onClick={()=>{this.props.gotoDashboard()}}>Dashboard</h5>
            </div>

            <div className="col-lg-2" style={{paddingTop: 38}}>
              <h5  style={{color: "#268D5D", fontWeight: 700}} onClick={()=>{this.props.logout()}}>Logout</h5>
            </div>

        </div>

        <h3>Survey Name: {this.state.name}</h3>
        <h3>Start Time: {this.state.startTime}</h3>
        <h3>End Time: {this.state.endTime}</h3>
        <h5>Complete Percentage: {100*(this.state.totalSubmissions/this.state.totalInvited)}</h5>

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

            <div className="col-lg-12">
                <h5>Total Questions in the Survey: {this.props.response.survey.questionList.length}</h5>

                {this.props.response.survey.questionList.map((question,i) => (
                      <div className="row" >
                          <div className="col-lg-12">
                            <div className="row" style={{paddingLeft: 20}}>
                              <h5>Question:  <span style={{color: "green"}}>{question.questionText}</span> </h5>
                            </div>
                          </div>


                    <div className="col-lg-12" style={{border: "1px solid"}}>
                      <div className="row">
                        {this.state.output.map(optionsAndCount => (



                          <div>
                            {(optionsAndCount.questionText) === question.questionText ? (<div className="col-lg-3" style={{paddingTop: 20}}>

                              <h5> <span style={{fontWeight: 600}}>Option Text: </span>{optionsAndCount.responses.optionText}</h5>
                              <h5> <span style={{fontWeight: 600}}>Response Count: </span>{optionsAndCount.responses.responseCount}</h5>
                              <br/>
                              </div>): (<span></span>)}

                          </div>



                        ))}
                      </div>
                    </div>

                      </div>
            ))}

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
  else {
    return (
        <div>

        <div className="row bar">
            <div className="col-lg-1 logo">
                <img src={Logo} />
            </div>
            <div className="col-lg-2 textLogo">
              Survey Ape
            </div>
            <div className="col-lg-2" style={{paddingTop: 38}}>
              <h5  style={{color: "#268D5D", fontWeight: 700}} onClick={()=>{this.props.gotoDashboard()}}>Dashboard</h5>
            </div>

            <div className="col-lg-2" style={{paddingTop: 38}}>
              <h5  style={{color: "#268D5D", fontWeight: 700}} onClick={()=>{this.props.logout()}}>Logout</h5>
            </div>

        </div>

            <h2> Could not Generate Survey Stats. <br /> Less than two responses have been submitted.</h2>

          <h4>  Please select another Survey to see stats.</h4>
        </div>
    );
  }
  }
}


export default SurveyDetails;
