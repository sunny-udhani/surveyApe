import React, {Component} from 'react';
import {Route, withRouter} from 'react-router-dom';

import Signup from './Signup';
import Signin from './Signin';
import Confirmation from './Confirmation';
import LandingPage from './LandingPage';

import * as API from './api/API';


class Routing extends Component {

  state={

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

            </div>
        );
    }
}

export default withRouter(Routing);
