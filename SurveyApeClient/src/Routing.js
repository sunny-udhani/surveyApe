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
import URL from './getPath';

const headers = {};

class Routing extends Component {

    constructor() {
        super();
        this.state = {
            surveyorEmail: null,
            surveyId: null
        }

        console.log("URL in router");
        console.log(URL);
    }


    handleFailure = () => {
        this.props.history.push('/dashboard');
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

        console.log("SUrveytype debug:" + surveyType);

        for (var i = 0; i < survey.questions.length; i++) {
            survey.questions[i].optionList = survey.questions[i].optionList.join(',');
        }
        console.log(survey.questions);
        var self = this;
        var url = URL + ":3000/surveyee/takeSurvey/" + surveyType + "/" + Math.random() * 10000000;
        var qr = url + "?qr=true";
        if (surveyType == "2" || surveyType == "Open") {
            url = URL + ":3000/surveyee/register/" + surveyType + "/" + Math.random() * 10000000;
            qr = url + "?qr=true";
        }
        console.log(url);
        var attendeesList = [];
        if (closedSurveyList.length > 0) {
            for (var i = 0; i < closedSurveyList.length; i++) {
                var obj = {};
                obj.email = closedSurveyList[i];
                var temp = (Math.random() * 100000);
                obj.url = URL + ":3000/surveyee/takeSurvey/" + surveyType + "/" + temp;
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
            publish: survey.publish,
            endTime: survey.endTime
        };

        if (attendeesList.length > 0) {
            payload.attendeesList = attendeesList;
        }
        console.log("sdbhjfknasdnlkasd");
        console.log(attendeesList);
        if (inviteeList.length > 0) {
            var temp = [];
            for (var i = 0; i < inviteeList.length; i++) {
                temp.push({"email": inviteeList[i], "inviteeURI": url})
            }
            payload.inviteeList = temp;
        }
        if (attendeesList.length > 0) {
            payload.attendeesList = attendeesList;
        }

        console.log("payload");
        console.log(payload);
        //API FOR others
        API.createSurvey(payload)
            .then((res) => {
                console.log(res);
                if (res.surveyId) {
                    this.setState({surveyId: res.surveyId});
                    alert('Survey was created successfully');
                    this.props.history.push("/dashboard");
                }
                else {
                    alert(res.message);
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
        console.log("PRINTING SURVEY OBJECT");
        console.log(survey);
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
        var url = URL + ":3000/surveyee/takeSurvey/" + surveyType + "/" + Math.random() * 10000000;
        var qr = url + "?qr=true";
        console.log(url);
        var attendeesList = [];
        if (closedSurveyList.length > 0) {
            for (var i = 0; i < closedSurveyList.length; i++) {
                var obj = {};
                obj.email = closedSurveyList[i];
                var temp = (Math.random() * 100000);
                obj.url = URL + ":3000/surveyee/takeSurvey/" + surveyType + "/" + temp;
                attendeesList.push(obj);
            }
        }
        //INVITEE GENERAL ATTENDEE CLOSED
        var payload = {
            survey_id: this.state.surveyId,
            surveyType: surveyType,
            surveyorEmail: this.state.surveyorEmail,
            surveyTitle: survey.name,
            questions: survey.questions,
            url: url,
            qr: qr,
            publish: survey.publish
        };
        var removed = [];
        var added = [];
        if (attendeesList.length > 0) {
            for (var i = 0; i < survey.oldInvitees.length; i++) {
                for (var j = 0; j < attendeesList.length; j++) {
                    var cntr = 0;
                    if (survey.oldInvitees[i] === attendeesList[j]) {
                        cntr = 1;
                    }
                }
                if (cntr === 0) {
                    removed.push(survey.oldInvitees[i]);
                }
            }

            for (var j = 0; j < survey.oldInvitees.length; j++) {
                if (attendeesList.indexOf(survey.oldInvitees[j]) >= 0) {
                    attendeesList.splice(attendeesList.indexOf(survey.oldInvitees[j]), 1);
                }
            }

            payload.added = attendeesList;
            payload.removed = removed;
        }
        else if (inviteeList.length > 0) {

            for (var i = 0; i < survey.oldInvitees.length; i++) {
                for (var j = 0; j < inviteeList.length; j++) {
                    var cntr = 0;
                    if (survey.oldInvitees[i] === inviteeList[j]) {
                        cntr = 1;
                    }
                }
                if (cntr === 0) {
                    removed.push(survey.oldInvitees[i]);
                }

            }


            for (var j = 0; j < survey.oldInvitees.length; j++) {
                if (inviteeList.indexOf(survey.oldInvitees[j]) >= 0) {
                    inviteeList.splice(inviteeList.indexOf(survey.oldInvitees[j]), 1);
                }
            }

            payload.added = inviteeList;
            payload.removed = removed;
        }

        console.log("payload");
        console.log(payload);
        //API FOR others

        API.editSurvey(payload, this.state.surveyId)
            .then((res) => {
                if (res.surveyId) {
                    alert('Survey successfully edited');
                    this.props.history.push("/dashboard");
                }
                else {
                    alert('Survey edit unsuccessful');
                    this.props.history.push("/dashboard");
                }
            });


    }

    verifyUser = (data) => {
        console.log("Inside VerifyUser");
        console.log(data);
        API.verifyUser(data)
            .then((res) => {

                if (res.status === 200) {

                    alert("User verified successfully! Please Login to get Started");
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
        console.log("ghjvsdhagjsghasd");
        this.setState({surveyorEmail: payload.email})
        API.signIn(payload)
            .then((res) => {
                console.log("Data received for Open Survey Data: ");
                console.log(res);
                console.log(res.msg);
                if (res.status == 200) {

                    var temp = (Math.random() * 100000);
                    var url1 = URL + ":3000/surveyee/takeSurvey/2/" + temp;
                    if (res.dataOpen) {
                        var data = {
                            surveyId: res.dataOpen.surveyIdOpen,
                            email: payload.email,
                            url: url1
                        }
                        API.sendEmailUrlSurveyId(data)
                            .then(res => {
                                console.log(res);
                                alert("User Signed In Successfully");
                                console.log(payload.email);
                                this.setState({
                                    surveyorEmail: payload.email
                                })


                                this.props.history.push("/dashboard");
                            })
                            .catch(err => {
                                console.error(err);
                            })
                    }
                    else {
                        alert("User Signed In Successfully");
                        console.log(payload.email);
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
                    alert("Wrong Credentials used! Please check all the fields and try again");
                    this.props.history.push("/signin");
                }

            });
    }

    submitResponses = () => {
        if (this.state.surveyorEmail) {
            this.props.history.push('/dashboard');

        }
        else {
            this.props.history.push('/signin');
        }

    }

    gotoEmailOpen = (data) => {
        console.log("Inside gotoEmailOpen");
        console.log("Props received:");
        console.log(this.props);

        console.log("Data received:");
        console.log(data);
        var temp = (Math.random() * 100000);
        var url1 = "http://localhost:3000/surveyee/takeSurvey/2/" + temp;


        var data1 = {
            surveyId: data.surveyIdOpen,
            email: data.email,
            url: url1
        }

        API.sendEmailUrlSurveyId(data1)
            .then(res => {
                alert('Email sent successfully');
                console.log(res);
            })
            .catch(err => {
                alert('Issue with sending the email');
                console.error(err);
            })


    }

    gotoMySurveys = () => {
        this.props.history.push('/mySurveys');
    }

    gotoCreateSurvey = () => {
        this.props.history.push('/form');
    }

    gotoSurveysToTake = () => {
        this.props.history.push('/takeSurvey');
    }

    gotoDashboard = () => {
        this.props.history.push('/dashboard');
    }

    EditSurvey = (id) => {
        this.setState({surveyId: id}, function () {
            this.props.history.push('/editSurvey');
        });

    }
    /*
        callback = (res) => {
          this.props.history.push('/');
          this.props.history.push('/mySurveys');
        }*/
    PublishSurvey = (id) => {
        console.log("Ithe ala " + id);
        //API call for publish survey
        var payload = {surveyId: id, publish: true};
        API.PublishSurvey1(payload)
            .then(res => {
                alert('Survey Successfully Published');
                this.props.history.push('/');
                this.props.history.push('/mySurveys');
            })
            .catch(err => {

                alert('Problem in publishing survey');
                console.error(err);
            })

    }


    UnpublishSurvey = (id) => {
        console.log("Ithe ala " + id);
        //API call for publish survey
        var payload = {surveyId: id, publish: false};
        API.UnPublishSurvey(payload)
            .then(res => {
                if (res === "failure") {
                    alert('Survey already filled,cannot unpublish');
                    this.props.history.push('/');
                    this.props.history.push('/mySurveys');
                }
                else {
                    alert('Survey Successfully Unpublished');
                    this.props.history.push('/');
                    this.props.history.push('/mySurveys');
                }

            })
            .catch(err => {

                alert('Problem in unpublishing survey');
                console.error(err);
            })

    }

    EndSurvey = (id) => {
        //API call for end survey
        API.endSurvey(id).then((res) => {
            alert('Survey Ended Successfully');
            this.props.history.push('/');
            this.props.history.push('/mySurveys');
        })
            .catch(err => {
                alert('Problem in ending survey');
            });
    }


    AddInvitees = (id, invitees, type) => {
        //API call for add invitees
        var arr = invitees.split(',');

        for (var i = 0; i < arr.length; i++) {
            arr[i] = {email: arr[i]};
        }
        //API
        if (type == "3") {
            var addAttendeesList = [];
            for (var i = 0; i < arr.length; i++) {
                var obj = {};
                obj.email = arr[i].email;
                var temp = (Math.random() * 100000);
                obj.URI = URL + ":3000/surveyee/takeSurvey/" + type + "/" + temp;
                addAttendeesList.push(obj);
            }
            var payload = {surveyId: id, addAttendeesList: addAttendeesList};
        }
        else {
            var payload = {surveyId: id, addInviteeList: arr};
        }
        //addAttendeesList

        API.addInvitees(payload).then((res) => {
            alert('Invitees Successfully Added');
            this.props.history.push('/');
            this.props.history.push('/mySurveys');
        });


    }

    GetSurveyStats = (id) => {
        var payload = {surveyId: id};
        API.getSurvey1(id).then((res) => {
            if (res === "failure") {
                alert("You are not allowed to view this survey's information at this time");
                this.state.history.push('/dashboard');
            }
            else {
                this.setState({surveyId: id, res: res}, function () {
                    this.props.history.push('/surveyDetails')
                });
            }


        });
    }

    logout = () => {
        API.logout().then((res) => {
            console.log(res);
            if (res.status === 200) {
                alert("user logged out successfully");
                this.setState({
                    surveyorEmail: null
                });
                this.props.history.push('/');
            }
        });
    }

    render() {
        return (
            <div className="container-fluid" style={{backgroundColor: "white", height: "100%"}}>
                <Route exact path="/" render={() => (
                    <div>
                        <LandingPage gotoSignin={this.gotoSignin} logout={this.logout} gotoSignup={this.gotoSignup}/>
                    </div>
                )}/>

                <Route exact path="/mySurveys" render={() => (
                    <div>
                        <MySurveys handleFailure={this.handleFailure} GetSurveyStats={this.GetSurveyStats}
                                   EditSurvey={this.EditSurvey} UnpublishSurvey={this.UnpublishSurvey}
                                   PublishSurvey={this.PublishSurvey} EndSurvey={this.EndSurvey}
                                   AddInvitees={this.AddInvitees} gotoDashboard={this.gotoDashboard}
                                   logout={this.logout}/>
                    </div>
                )}/>

                <Route exact path="/surveyDetails" render={() => (
                    <div>
                        <SurveyDetails response={this.state.res} handleFailure={this.handleFailure}
                                       surveyId={this.state.surveyId} gotoDashboard={this.gotoDashboard}
                                       logout={this.logout}/>
                    </div>
                )}/>

                <Route exact path="/editSurvey" render={() => (
                    <div>
                        <EditSurvey surveyId={this.state.surveyId} editSurvey={this.editSurvey}
                                    gotoMysurvey={this.gotoMySurveys} handleFailure={this.handleFailure}
                                    reloadEditSurvey={this.EditSurvey} gotoDashboard={this.gotoDashboard}
                                    logout={this.logout}
                        />
                    </div>
                )}/>

                <Route exact path="/dashboard" render={() => (
                    <div>
                        <Dashboard submitResponses={this.submitResponses} gotoCreateSurvey={this.gotoCreateSurvey}
                                   gotoMySurveys={this.gotoMySurveys} gotoSurveysToTake={this.gotoSurveysToTake}
                                   surveyorEmail={this.state.surveyorEmail} gotoSignin={this.gotoSignin}
                                   gotoDashboard={this.gotoDashboard} logout={this.logout}/>
                    </div>
                )}/>


                <Route exact path="/signup" render={() => (
                    <div>
                        <Signup gotoSignin={this.gotoSignin} registerUser={this.registerUser}
                                dataOpen={this.state.dataOpen} gotoDashboard={this.gotoDashboard} logout={this.logout}/>
                    </div>
                )}/>


                <Route exact path="/signin" render={() => (
                    <div>
                        <Signin signIn={this.signIn} gotoSignup={this.gotoSignup} dataOpen={this.state.dataOpen}
                                gotoDashboard={this.gotoDashboard} logout={this.logout}/>
                    </div>
                )}/>

                <Route exact path="/confirmation" render={() => (
                    <div>
                        <Confirmation verifyUser={this.verifyUser} dataOpen={this.state.dataOpen}
                                      gotoDashboard={this.gotoDashboard} logout={this.logout}/>
                    </div>
                )}/>

                <Route exact path="/createSurvey" render={() => (
                    <div>
                        <Form1 createSurvey={this.createSurvey} gotoDashboard={this.gotoDashboard}
                               logout={this.logout}/>
                    </div>
                )}/>

                <Route exact path="/surveyee/takeSurvey/:surveyType/:randSurvey" render={() => (
                    <div>
                        <Survey submitSurveys={this.submitSurveys} handleFailure={this.handleFailure}
                                email={this.state.surveyorEmail} submitResponses={this.submitResponses}
                                gotoDashboard={this.gotoDashboard} logout={this.logout}/>
                    </div>
                )}/>

                <Route exact path="/surveyee/register/:surveyType/:randSurvey" render={() => (
                    <div>
                        <OpenUniqueSurvey gotoSigninOpen={this.gotoSigninOpen} gotoDashboard={this.gotoDashboard}
                                          logout={this.logout} gotoSignupOpen={this.gotoSignupOpen}
                                          gotoEmailOpen={this.gotoEmailOpen}/>
                    </div>
                )}/>


                <Route exact path="/takeSurvey" render={() => (
                    <div>
                        <SurveysToTake surveyorEmail={this.state.surveyorEmail} gotoDashboard={this.gotoDashboard}
                                       logout={this.logout}/>
                    </div>
                )}/>


                <Route exact path="/openUniqueSurveyEmail" render={() => (
                    <div>
                        <OpenUniqueSurveyEmail redirectToSurvey={this.redirectToSurvey}/>
                    </div>
                )}/>

                <Route exact path="/form" render={() => (
                    <div>
                        <Form1 createSurvey={this.createSurvey} logout={this.logout}/>
                    </div>
                )}/>

            </div>
        );
    }
}

export default withRouter(Routing);
