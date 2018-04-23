import React, {Component} from 'react';
import {Route, withRouter, Switch, Router} from 'react-router-dom';
import './App.css';
import SignUp from "./components/SignUp"
import Login from "./components/Login";
import Home from "./components/Home";
import * as API from './api/API';

class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
        };
    }
     getCookie = (cname) => {
        var name = cname + "=";
        var decodedCookie = decodeURIComponent(document.cookie);
        var ca = decodedCookie.split(';');
        console.log("cookie decoded: " + ca);
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ') {
                c = c.substring(1);
            }
            if (c.indexOf(name) == 0) {
                return c.substring(name.length, c.length);
            }
        }
        return "";
    };

    handleSubmit = (userdata) => {
        API.doRegister(userdata)
            .then((res) => {
                if (res.status === 200) {
                    this.setState({
                        ...this.state,
                        isLoggedIn: true
                    });
                    console.log("cookies: " + this.getCookie('aaj'));
                    this.props.history.push("/login");
                } else if (res.status === 400) {
                    this.props.history.push("/");
                    this.setState({
                        ...this.state,
                        isLoggedIn: false,
                        message: "Error with input. Please Try again..!!"
                    });
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    handleSubmitLogin = (userdata) => {
        API.doLogin(userdata)
            .then((res) => {
                    if (res.status === 200) {
                        res.json().then(data => {
                            console.log("data received");
                            console.log(data);
                            this.setState({
                                ...this.state,
                                isLoggedIn: true,
                                filespath: './' + data.userEmail,
                                sharepath: '',
                                username: data.userEmail
                            });
                        });
                        console.log(this.state);
                        let x = document.cookie;
                        console.log("username from session storage: " + this.getCookie('aaj'));
                        this.props.history.push("/home");
                    } else if (res.status === 400) {
                        this.setState({
                            isLoggedIn: false,
                            message: "Wrong username or password. Try again..!!"
                        });
                    }
                }
            )
            .catch((err) => {
                console.log(err);
            })
    };

    handleSubmitLogout = () => {
        API.doLogout()
            .then((res) => {
                console.log("res status" + res.status)
                if (res.status === 200) {
                    this.setState({
                        isLoggedIn: false,
                        message: "Logged out successfully!!"
                    });
                    console.log(this.state);

                    this.props.history.push("/");
                }
            })
            .catch((err) => {
                console.log(err);
            })
    };

    render() {
        return (
            <Switch>
                <Route exact path="/" component={() => <SignUp handleSubmit={this.handleSubmit}/>}/>
                <Route exact path="/login" component={() => <Login handleSubmit={this.handleSubmitLogin}/>}/>
                {/*<Route component = { (props) =>  <RequireAuth {...props} isLoggedIn = {this.state.isLoggedIn}/>} >*/}
                <Route exact path="/home" component={() => <Home handleSubmitLogout={this.handleSubmitLogout}/>}/>
            </Switch>
        );
    }
}

export default withRouter(App);
