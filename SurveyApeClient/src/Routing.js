import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import Signup from './Signup';
import Signin from './Signin';
import Confirmation from './Confirmation';
import LandingPage from './LandingPage';
import CreateSurvey from './CreateSurvey';
import Dashboard from './Dashboard';
import * as API from './api/API';

var QRCode = require('qrcode.react');
const headers = {};

class Routing extends Component {
    state = {
        surveyorEmail: null
    }

    createSurvey = (survey, closedSurveyList, inviteeList) => {
        /*
        {surveyType:"",surveyTitle,questions:[{questionText:"ques",questionType:"",optionList:"optionStr"}],publish:t/f,url:"url"}

        url-
        > 1 way hash
        */
        console.log(closedSurveyList);
        console.log(inviteeList);
        var surveyType = survey.type;
        if (surveyType === "General") {
            surveyType = "1";
        }
        else if (surveyType === "Open") {
            surveyType = "2";
        }
        else if (surveyType === "Closed") {
            surveyType = "3";
        }
        else if (surveyType === "Anonymous") {
            surveyType = "4";
        }
        else {

        }
        for (var i = 0; i < survey.questions.length; i++) {
            survey.questions[i].optionList = survey.questions[i].optionList.join(',');
        }
        console.log(survey.questions);
        var self = this;
        var url = Math.random() * 10000000;
        var qr = url;
        console.log(url);
        var attendeesList = [];
        if (closedSurveyList.length > 0 && surveyType === "3") {
            for (var i = 0; i < closedSurveyList.length; i++) {
                var obj = {};
                obj.name = closedSurveyList[i];
                var temp = url * (Math.random() * 100000);
                obj.url = "/" + surveyType + "/open/" + temp;
                attendeesList.push(obj);
            }
        }
        var payload = {
            surveyType: surveyType,
            surveyorEmail: this.state.surveyorEmail,
            surveyTitle: survey.name,
            questions: survey.questions,
            url: url.toString(),
            qr: qr.toString(),
            publish: false
        };

        if (attendeesList.length > 0) {
            payload.attendeesList = attendeesList;
        }
        if (inviteeList.length > 0) {
            payload.inviteeList = inviteeList;
        }
        //API FOR others
        API.createSurvey(payload)
            .then((res) => {
                console.log(res.msg);
                if (res.status == 200) {
                    alert("User registration is successful!");
                    this.props.history.push("/signin");
                    this.props.history.push('/createSurvey');
                }
                else if (res.status == 406) {
                    alert("Representation error!");
                    this.props.history.push('/signin');

                }

            });


    }

    verifyUser = (data) => {

        API.verifyUser(data)
            .then((res) => {
                console.log(res.msg);
                if (res.status == 200) {
                    alert("User verified successfully!");
                    this.props.history.push("/signin");
                }
                else if (res.status == 401) {
                    alert("User with this email id already exists. Please use another email id!");
                    this.props.history.push("/");
                    this.props.history.push("/signup");
                }
                else if (res.status === 409) {
                    alert("User Already Exists. Please verify your account");
                    this.props.history.push("/confirmation");
                }
                else if (res.status === 302) {
                    alert("User Already Exists. Please Click Ok to Signin.");
                    this.props.history.push("/signin");
                }
                else {
                    console.log("res.status===", res)
                    alert("Failed to register!Please check all the fields and try again");
                    this.props.history.push("/signup");
                }
            });

    }

    gotoSignup = () => {
        this.props.history.push('/signup');
    };

    registerUser = (payload) => {
        API.registerUser(payload)
            .then((res) => {
                console.log(res.msg);
                if (res.status == 200) {
                    alert("User registration is successful!");
                    this.props.history.push("/signin");
                }
                else if (res.status == 401) {
                    alert("User with this email id already exists. Please use another email id!");
                    this.props.history.push("/");
                    this.props.history.push("/signup");
                }
                else if (res.status === 409) {
                    alert("User Already Exists. Please verify your account");
                    this.props.history.push("/confirmation");
                }
                else if (res.status === 302) {
                    alert("User Already Exists. Please Click Ok to Signin.");
                    this.props.history.push("/signin");
                }
                else {
                    console.log("res.status===", res)
                    alert("Failed to register!Please check all the fields and try again");
                    this.props.history.push("/signup");
                }

            });
    }

    signIn = (payload) => {
        API.signIn(payload)
            .then((res) => {
                console.log(res.msg);
                if (res.status == 200) {
                    alert("User Signed In Successfully");
                    this.setState({surveyorEmail: payload.email})
                    this.props.history.push("/createSurvey");
                }
                else if (res.status == 401) {
                    alert("User with this email id already exists. Please use another email id!");
                    this.props.history.push("/");
                    this.props.history.push("/signup");
                }
                else if (res.status === 409) {
                    alert("User Already Exists. Please verify your account");
                    this.props.history.push("/confirmation");
                }
                else if (res.status === 302) {
                    alert("User Already Exists. Please Click Ok to Signin.");
                    this.props.history.push("/signin");
                }
                else {
                    console.log("res.status===", res)
                    alert("Failed to register!Please check all the fields and try again");
                    this.props.history.push("/signup");
                }

            });
    }

    submitResponses = (payload) => {

        API.submitResponses(payload)
            .then((res) => {
                console.log("response received after submitting response : ", res);
            });
    }

      gotoCreateSurvey = () => {
          this.props.history.push('/createSurvey');
      }


    render() {
        return (
            <div className="container-fluid" style={{backgroundColor:"white", height: "100%"}}>
                <Route exact path="/" render={() => (
                    <div>
                        <LandingPage gotoSignin={this.gotoSignin} gotoSignup={this.gotoSignup}/>
                    </div>
                )}/>
                <Route exact path="/qr" render={() => (
                    <div>
                        <QRCode value="http://facebook.github.io/react/"/>
                    </div>
                )}/>

                <Route exact path="/dashboard" render={() => (
                      <div>
                          <Dashboard submitResponses={this.submitResponses} gotoCreateSurvey={this.gotoCreateSurvey}/>
                      </div>
                  )}/>


                <Route exact path="/signup" render={() => (
                    <div>
                        <Signup gotoSignin={this.gotoSignin} registerUser={this.registerUser}/>
                    </div>
                )}/>


                <Route exact path="/signin" render={() => (
                    <div>
                        <Signin signIn={this.signIn}/>
                    </div>
                )}/>

                <Route exact path="/confirmation" render={() => (
                    <div>
                        <Confirmation verifyUser={this.verifyUser}/>
                    </div>
                )}/>

              <Route exact path="/createSurvey" render={() => (
                    <div style={{height: "100%"}}>
                        <CreateSurvey createSurvey={this.createSurvey} />
                    </div>
                )}/>

            </div>
        );
    }
}

export default withRouter(Routing);
