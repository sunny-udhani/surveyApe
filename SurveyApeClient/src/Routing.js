import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';
import Signup from './Signup';
import Signin from './Signin';
import Confirmation from './Confirmation';
import LandingPage from './LandingPage';
import CreateSurvey from './CreateSurvey';
import Dashboard from './Dashboard';
import Survey from './Survey';
import OpenUniqueSurvey from './OpenUniqueSurvey';
import OpenUniqueSurveyEmail from './OpenUniqueSurveyEmail';
import SurveyDetails from './SurveyDetails';
import EditSurvey from './EditSurvey';
import MySurveys from './MySurveys';
import Form1 from './Form1';
import SurveysToTake from './SurveysToTake';
import * as API from './api/API';

var QRCode = require('qrcode.react');
const headers = {};

class Routing extends Component {
    state = {
        surveyorEmail: null,
        surveyId:null
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
        var url = "http://localhost:3000/surveyee/takeSurvey/" + surveyType + "/" + Math.random() * 10000000;
        var qr = url + "?qr=true";
        if(surveyType=="2" || surveyType=="Open"){
          url="http://localhost:3000/surveyee/register/" + surveyType + "/" + Math.random() * 10000000;
          qr= url + "?qr=true";
        }
        console.log(url);
        var attendeesList = [];
        if (closedSurveyList.length > 0 && surveyType === "3") {
            for (var i = 0; i < closedSurveyList.length; i++) {
                var obj = {};
                obj.email = closedSurveyList[i];
                var temp = (Math.random() * 100000);
                obj.url = "http://localhost:3000/surveyee/takeSurvey/" + surveyType + "/" + temp;
                attendeesList.push(obj);
            }
        }
        //INVITEE GENERAL ATTENDEE CLOSED
        var payload = {
            surveyType: surveyType,
            surveyorEmail: this.state.surveyorEmail,
            surveyTitle: survey.name,
            questions: survey.questions,
            url: url,
            qr: qr,
            publish: survey.publish
        };

        if (attendeesList.length > 0) {
            payload.attendeesList = attendeesList;
        }
        console.log("sdbhjfknasdnlkasd");
        console.log(inviteeList);
        if (inviteeList.length > 0) {
          var temp=[];
          for(var i=0;i<inviteeList.length;i++){
            temp.push({"email":inviteeList[i],"inviteeURI":url})
          }
          payload.inviteeList = temp;
        }

        console.log("payload");
        console.log(payload);
        //API FOR others
        API.createSurvey(payload)
            .then((res) => {
                console.log(res);
                if(res.surveyId){
                  this.setState({surveyId:res.surveyId});
                  this.props.history.push("/dashboard");
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

    editSurvey = (survey, closedSurveyList, inviteeList) => {
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
        var self = this;
        var url = "http://localhost:3000/surveyee/takeSurvey/" + surveyType + "/" + Math.random() * 10000000;
        var qr = url + "?qr=true";
        console.log(url);
        var attendeesList = [];
        if (closedSurveyList.length > 0 && surveyType === "3") {
            for (var i = 0; i < closedSurveyList.length; i++) {
                var obj = {};
                obj.email = closedSurveyList[i];
                var temp = (Math.random() * 100000);
                obj.url = "http://localhost:3000/surveyee/takeSurvey/" + surveyType + "/" + temp;
                attendeesList.push(obj);
            }
        }
        //INVITEE GENERAL ATTENDEE CLOSED
        var payload = {
            survey_id:this.state.surveyId,
            surveyType: surveyType,
            surveyorEmail: this.state.surveyorEmail,
            surveyTitle: survey.name,
            questions: survey.questions,
            url: url,
            qr: qr,
            publish: survey.publish
        };
        var removed=[];
        var added=[];
        if (attendeesList.length > 0) {
          for(var i=0;i<survey.oldInvitees.length;i++){
            for(var j=0;j<attendeesList.length;j++){
              if(survey.oldInvitees[i]===attendeesList[j]){
                removed.push(attendeesList[j]);
                break;
              }
            }
          }

            for(var j=0;j<survey.oldInvitees.length;i++){
              if(attendeesList.indexOf(survey.oldInvitees[i])>=0){
                attendeesList.splice(attendeesList.indexOf(survey.oldInvitees[i]),1);
              }
            }

          payload.added = attendeesList;
          payload.removed=removed;
        }
        else if (inviteeList.length > 0) {

          for(var i=0;i<survey.oldInvitees.length;i++){
            for(var j=0;j<inviteeList.length;j++){
              if(survey.oldInvitees[i]===inviteeList[j]){
                removed.push(inviteeList[j]);
                break;
              }
            }
          }

            for(var j=0;j<survey.oldInvitees.length;j++){
              if(inviteeList.indexOf(survey.oldInvitees[j])>=0){
                inviteeList.splice(inviteeList.indexOf(survey.oldInvitees[j]),1);
              }
            }

          payload.added = inviteeList;
          payload.removed=removed;
        }

        console.log("payload");
        console.log(payload);
        //API FOR others
        var temp=this.state.surveyId;
        API.editSurvey(payload,temp)
            .then((res) => {
                console.log(res);
                if(res.surveyId){
                  this.props.history.push("/dashboard");
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

    verifyUser = (data) => {
        console.log("Inside VerifyUser");
        console.log(data);
        API.verifyUser(data)
            .then((res) => {

                console.log("Data received for Open Survey Data: ");
                console.log(res);
                if (res.status == 200) {


                  var temp = (Math.random() * 100000);
                  var  url1 = "http://localhost:3000/surveyee/takeSurvey/2/" + temp;

                  var data1 = {
                    surveyId: data.dataOpen.surveyIdOpen,
                    email: data.email,
                    url: url1
                  }

                  API.sendEmailUrlSurveyId(data1)
                  .then(res =>{
                      console.log(res);
                  })
                  .catch(err => {
                    console.error(err);
                  })

                    alert("User verified successfully! You will receive an Email with Url to open the Survey..");
                    this.props.history.push("/signin");
                }
                else if (res.status == 401) {
                    alert("User with this email id already exists. Please use another email id!");
                    this.props.history.push("/");
                    this.props.history.push("/signup");
                }
                else if (res.status === 409) {
                    alert("Incorrect Email or Confirmation Code!! Please Enter Correctly to verify your account");
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

    gotoSignin = () => {
        this.props.history.push('/signin');
    };


    gotoSigninOpen = (data) => {
      console.log("Inside gotoSigninOpen");
      console.log("Props received:");
      console.log(this.props);

      console.log("Data received:");
      console.log(data);

      this.setState({
        dataOpen: data
      });

      this.props.history.push('/signin');
    }

    gotoSignupOpen = (data) => {
      console.log("Inside gotoSignupOpen");
      console.log("Props received:");
      console.log(this.props);

      console.log("Data received:");
      console.log(data);

      this.setState({
        dataOpen: data
      });

      this.props.history.push('/signup');
    }




    registerUser = (payload) => {
      console.log("Payload Received inside registerUser: ");
      console.log(payload);
        API.registerUser(payload)
            .then((res) => {
              console.log("Data received for Open Survey Data in registerUser: ");
              console.log(res);

              this.setState({
                dataOpen: res.dataOpen
              });

                if (res.status == 200) {
                    alert("User registration is successful!");
                    this.props.history.push("/confirmation");
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
                console.log("Data received for Open Survey Data: ");
                console.log(res);
                console.log(res.msg);
                if (res.status == 200) {


                  var temp = (Math.random() * 100000);
                var  url1 = "http://localhost:3000/surveyee/takeSurvey/2/" + temp;
                  if(res.dataOpen){
                    var data = {
                      surveyId: res.dataOpen.surveyIdOpen,
                      email: payload.email,
                      url: url1
                    }
                    API.sendEmailUrlSurveyId(data)
                    .then(res =>{
                        console.log(res);
                    })
                    .catch(err => {
                      console.error(err);
                    })
                  }
                  else{
                    alert("User Signed In Successfully");
                    this.setState({
                      surveyorEmail: payload.email
                    })

                    this.props.history.push("/dashboard");
                  }






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

    submitResponses = () => {
        if(this.state.surveyorEmail){
          this.props.history.push('/dashboard');

        }
        else{
          this.props.history.push('/signin');
        }

    }

    gotoMySurveys = () =>{
      this.props.history.push('/mySurveys');
    }

    gotoCreateSurvey = () => {
        this.props.history.push('/form');
    }

    gotoSurveysToTake = () => {
        this.props.history.push('/takeSurvey');
    }

    EditSurvey = (id) =>{
      this.setState({surveyId:id},function(){
        this.props.history.push('/editSurvey');
      });

    }
/*
    callback = (res) => {
      this.props.history.push('/');
      this.props.history.push('/mySurveys');
    }*/
    PublishSurvey = (id) =>{
      console.log("Ithe ala "+id);
      //API call for publish survey
      var payload={surveyId:id,publish:true};
      API.PublishSurvey1(payload)
      .then(res =>{
        this.props.history.push('/');
        this.props.history.push('/mySurveys');
      })
      .catch(err => {
        console.error(err);
      })

    }

    EndSurvey=(id)=>{
      //API call for end survey
      API.endSurvey(id).
      then((res)=>{
        this.props.history.push('/');
        this.props.history.push('/mySurveys');
      });
    }


    AddInvitees=(id,invitees)=>{
      //API call for add invitees
      var arr=invitees.split(',');
      for(var i=0;i<arr.length;i++){
        arr[i]={email:arr[i]};
      }
      //API
      var payload={surveyId:id,addInviteeList:arr};
      API.addInvitees(payload).
      then((res)=>{
        this.props.history.push('/');
        this.props.history.push('/mySurveys');
      });
      alert('Invitees Successfully Added');

    }

    GetSurveyStats=(id)=>{
      var payload={surveyId:id};
      API.getSurvey1(id).
      then((res)=>{
        this.setState({surveyId:id,res:res},function(){this.props.history.push('/surveyDetails')});

      });
    }



    render() {
        return (
            <div className="container-fluid" style={{backgroundColor: "white", height: "100%"}}>
                <Route exact path="/" render={() => (
                    <div>
                        <LandingPage gotoSignin={this.gotoSignin} gotoSignup={this.gotoSignup}/>
                    </div>
                )}/>

              <Route exact path="/mySurveys" render={() => (
                    <div>
                        <MySurveys GetSurveyStats={this.GetSurveyStats} EditSurvey={this.EditSurvey} PublishSurvey={this.PublishSurvey} EndSurvey={this.EndSurvey} AddInvitees={this.AddInvitees}/>
                    </div>
                )}/>

                <Route exact path="/surveyDetails" render={() => (
                    <div>
                        <SurveyDetails response={this.state.res} surveyId={this.state.surveyId}/>
                    </div>
                )}/>
                <Route exact path="/qr" render={() => (
                    <div>
                        <QRCode value="http://facebook.github.io/react/"/>
                    </div>
                )}/>

              <Route exact path="/editSurvey" render={() => (
                      <div>
                        <EditSurvey surveyId={this.state.surveyId} editSurvey={this.editSurvey}/>
                      </div>
                )} />

                <Route exact path="/dashboard" render={() => (
                    <div>
                        <Dashboard submitResponses={this.submitResponses} gotoCreateSurvey={this.gotoCreateSurvey} gotoMySurveys={this.gotoMySurveys} gotoSurveysToTake={this.gotoSurveysToTake}/>
                    </div>
                )}/>


                <Route exact path="/signup" render={() => (
                    <div>
                        <Signup gotoSignin={this.gotoSignin} registerUser={this.registerUser} dataOpen={this.state.dataOpen}/>
                    </div>
                )}/>


                <Route exact path="/signin" render={() => (
                    <div>
                        <Signin signIn={this.signIn} gotoSignup={this.gotoSignup} dataOpen={this.state.dataOpen}/>
                    </div>
                )}/>

                <Route exact path="/confirmation" render={() => (
                    <div>
                        <Confirmation verifyUser={this.verifyUser} dataOpen={this.state.dataOpen}/>
                    </div>
                )}/>

                <Route exact path="/createSurvey" render={() => (
                    <div style={{height: "100%"}}>
                        <CreateSurvey createSurvey={this.createSurvey}/>
                    </div>
                )}/>

                <Route exact path="/surveyee/takeSurvey/:surveyType/:randSurvey" render={() => (
                    <div>
                        <Survey submitSurveys={this.submitSurveys} email={this.state.surveyorEmail} submitResponses={this.submitResponses}/>
                    </div>
                )}/>

                <Route exact path="/surveyee/register/:surveyType/:randSurvey" render={() => (
                    <div>
                        <OpenUniqueSurvey gotoSigninOpen={this.gotoSigninOpen} gotoSignupOpen={this.gotoSignupOpen}/>
                    </div>
                )}/>


              <Route exact path="/takeSurvey" render={() => (
                    <div>
                        <SurveysToTake surveyorEmail={this.state.surveyorEmail}/>
                    </div>
                )}/>



                <Route exact path="/openUniqueSurveyEmail" render={() => (
                    <div>
                        <OpenUniqueSurveyEmail redirectToSurvey={this.redirectToSurvey}/>
                    </div>
                )}/>

              <Route exact path="/form" render={() => (
                    <div>
                        <Form1 createSurvey={this.createSurvey}/>
                    </div>
                )}/>

            </div>
        );
    }
}

export default withRouter(Routing);
