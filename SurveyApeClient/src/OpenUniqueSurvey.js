import React, {Component} from 'react';
import {withRouter} from 'react-router';
import './OpenUniqueSurvey.css';
import OpenUniqueSurveyEmail from './OpenUniqueSurveyEmail';
import * as API from './api/API';

class OpenUniqueSurvey extends Component {

constructor(props) {
  super(props);
  this.state={

  }
}

componentWillMount() {
  console.log("url: ");
  console.log(this.props.match.url);
  console.log("surveyType:");
  console.log(this.props.match.params.surveyType);
  console.log(this.props.match.params.randSurvey);

  var data = {
      "url": "http://localhost:3000" + this.props.match.url,
      "surveyType": this.props.match.params.surveyType,
      "randSurvey": this.props.match.params.randSurvey
  }
  var data1 = {
    "url": "http://localhost:3000" + this.props.match.url,
    "surveyType": this.props.match.params.surveyType
  }



{/* Fetching surveyId from Open Unique Link */}

  API.fetchSurveyIdOpen(data1)
      .then((res) => {
          console.log(res);
          if(res.surveyId){
            console.log("Assuming that surveyId Received: ");
            console.log(res.surveyId);
            this.setState({
              surveyIdOpen: res.surveyId,
              url: "http://localhost:3000" + this.props.match.url
            });

          }

          if (res.status == 200) {
            //  alert("Survey successfully created");
              console.log(res.json());
              this.props.history.push("/signin");
              this.props.history.push('/createSurvey');
          }
          else if (res.status == 406) {
              alert("Representation error!");
              this.props.history.push('/signin');

          }

      });

}

render() {
  return (
      <div className="open-unique-mainpage">
        <div className="container">

        <div className="row">
        <p></p>
        </div>

          <div className="row">
            <h3>This is a Open Unique Survey. You Must Take the Survey Using one of the methods below: </h3>
          </div>
          <br />
          <div className="row">
            <h3>Please Sign In and Proceed to the Survey.</h3>
          </div>

          <div className="row">
            <button className="btn btn-primary" onClick={() => {this.props.gotoSigninOpen({surveyIdOpen: this.state.surveyIdOpen, openUrl: this.state.url})}}> SignIn </button>
          </div>

          <br/>
          <div className="row">
            <h3>Please Sign Up and Proceed to the Survey.</h3>
          </div>


          <div className="row">
            <button className="btn btn-primary" onClick={() => {this.props.gotoSignupOpen({surveyIdOpen: this.state.surveyIdOpen, openUrl: this.state.url})}}> SignUp </button>
          </div>

          <br/>

          <div className="row">
            <a href="/OpenUniqueSurveyEmail"><button className="btn btn-primary"> Use Your email Instead.. </button></a>
          </div>
      </div>
    </div>
);
}
  }

export default withRouter(OpenUniqueSurvey);
