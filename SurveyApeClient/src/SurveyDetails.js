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
    if(this.props.response===undefined){
      this.props.handleFailure();
    }
  }
  componentWillMount(){
    console.log("data");
    if(this.props.response===undefined){
      this.props.handleFailure();
    }
    else{
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
      console.log(this.props.response.competedResponses);
      console.log(this.props.response.survey.responseList.length);

      this.setState({
        output: output
      });
    }
  }

  render(){
    if(this.props.response){
    if((this.props.response.survey.surveyType === 1) && (this.props.response.competedResponses >= 2)){
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
          <h3>Start Date: {new Date(this.props.response.survey.startDate).toUTCString()}</h3>
          <h3>End Date {new Date(this.props.response.survey.endDate).toUTCString()}</h3>

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
    } else if(((this.props.response.survey.surveyType === 2) || (this.props.response.survey.surveyType === 3))  && (this.props.response.competedResponses >= 2)) {

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
          <h3>Start Date: {new Date(this.props.response.survey.startDate).toUTCString()}</h3>
          <h3>End Date {new Date(this.props.response.survey.endDate).toUTCString()}</h3>



          <div className="row" >

            <div className="col-lg-5">
            <h3>No of Participants: {this.props.response.survey.responseList.length}</h3>
            <h3>No of Submissions: {this.props.response.competedResponses}</h3>
            <h3>Complete Percentage: {100*(this.props.response.competedResponses/this.props.response.survey.responseList.length)}</h3>
            </div>

              <div className="col-lg-7">

              <BarChart width={600} height={400}data={[
                { name: 'Total Participants', value: this.props.response.survey.responseList.length },
                 { name: 'Total Submissions', value: this.props.competedResponses },
                  { name: 'Complete %', value: 100*(this.props.response.competedResponses/this.props.response.survey.responseList.length) }
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
                              <h5 style={{marginLeft: 10}}>Question:  <span style={{color: "green"}}>{question.questionText}</span> </h5>
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
  else{
    return(
      <div>
        You are not allowed to access this page at this time
      </div>
    )
  }
}

}


export default SurveyDetails;
