import React, {Component} from 'react';

import './OpenUniqueSurvey.css';
import OpenUniqueSurveyEmail from './OpenUniqueSurveyEmail';

class OpenUniqueSurvey extends Component {

state={

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
            <button className="btn btn-primary" onClick={() => {this.props.redirectToSurvey()}}> SignIn </button>
          </div>

          <br/>
          <div className="row">
            <h3>Please Sign Up and Proceed to the Survey.</h3>
          </div>


          <div className="row">
            <button className="btn btn-primary" onClick={() => {this.props.redirectToSurvey()}}> SignUp </button>
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


export default OpenUniqueSurvey;
