import React, {Component} from 'react';
import {withRouter} from 'react-router';
import './OpenUniqueSurvey.css';
import OpenUniqueSurveyEmail from './OpenUniqueSurveyEmail';
import * as API from './api/API';
import Logo from './logo.png';

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
          <div className="col-lg-12">
            <span> Use Your email Instead.. </span><input placeholder="email" className="inputBox" value={this.state.email} onChange={(event) => {
          this.setState({
              email: event.target.value
          });}}/>
          </div>
          <div className="col-lg-12">
            <button className="btn btn-primary" onClick={() => {this.props.gotoEmailOpen({surveyIdOpen: this.state.surveyIdOpen, openUrl: this.state.url, email: this.state.email})}}> Use Your email Instead.. </button>
          </div>
          </div>
      </div>
    </div>
);
}
  }

export default withRouter(OpenUniqueSurvey);
