import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';

import Signup from './Signup';
import Signin from './Signin';
import Confirmation from './Confirmation';
import LandingPage from './LandingPage';
import CreateSurvey from './CreateSurvey';
import * as API from './api/API';
const headers = {

};

class Routing extends Component {
  state={

  }

  createSurvey=(survey,closedSurveyList)=>{
    /*
    {surveyType:"",surveyTitle,questions:[{questionText:"ques",questionType:"",optionList:"optionStr"}],publish:t/f,url:"url"}

    url-> 1 way hash
    */
    var surveyType=survey.type;
    if(surveyType==="General"){
      surveyType="1";
    }
    else if(surveyType==="Open"){
      surveyType="2";
    }
    else if(surveyType==="Closed"){
      surveyType="3";
    }
    else if(surveyType==="Anonymous"){
      surveyType="4";
    }
    else{

    }
    for(var i=0;i<survey.questions.length;i++){
      survey.questions[i].optionList=survey.questions[i].optionList.join(',');
    }
    console.log(survey.questions);
    var self=this;
    var payload={surveyType:surveyType,surveyorEmail:"chandan.paranjape@gmail.com",surveyTitle:survey.name,questions:survey.questions,url:null,publish:false};
    if(closedSurveyList.length===0){
      //API FOR others
      fetch('http://localhost:8080/survey/create', {
        method: 'POST',
        headers:{
          ContentType: 'application/json'
        },
        credentials:'include',
        body: JSON.stringify(payload)
    }).then(res => {
      self.props.history.push('/signin');
      self.props.history.push('/createSurvey');
        console.log(res);
        return res.json();
    }).then(json =>{
      console.log(json);

    }

    )
      .catch(error => {
            console.log("This is error");
            return error;
        });
    }
    else{
      //create unique id
      var uniqueUrl=[];
      for(var i=0;i<closedSurveyList.length;i++){
        uniqueUrl[i]=survey.name+closedSurveyList[i];
      }
      uniqueUrl.map(function(item){
        console.log(item);
      });

      //API for closedSurveyList

    }
    this.props.history.push('/signin');
    this.props.history.push('/createSurvey');
  }

  gotoSignin = () => {
        this.props.history.push('/signin');
  };

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
                else if(res.status === 409)
                {
                  alert("User Already Exists. Please verify your account");
                  this.props.history.push("/confirmation");
                }
                else if(res.status === 302)
                {
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

    render() {
        return (
            <div className="container-fluid" style={{backgroundColor:"white"}}>
                <Route exact path="/" render={() => (
                    <div>
                        <LandingPage gotoSignin={this.gotoSignin} gotoSignup={this.gotoSignup}/>
                    </div>
                )}/>

                <Route exact path="/signup" render={() => (
                    <div>
                        <Signup gotoSignin={this.gotoSignin} registerUser={this.registerUser}/>
                    </div>
                )}/>


                <Route exact path="/signin" render={() => (
                    <div>
                        <Signin gotoSignup={this.gotoSignup}/>
                    </div>
                )}/>

                <Route exact path="/confirmation" render={() => (
                    <div>
                        <Confirmation gotoSignin={this.gotoSignin}/>
                    </div>
                )}/>

              <Route exact path="/createSurvey" render={() => (
                    <div>
                        <CreateSurvey createSurvey={this.createSurvey}/>
                    </div>
                )}/>

            </div>
        );
    }
}

export default withRouter(Routing);
