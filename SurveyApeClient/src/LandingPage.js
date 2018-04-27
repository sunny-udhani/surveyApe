import React, {Component} from 'react';

import './LandingPage.css';

import bgLogo from './bglogo.png';


class LandingPage extends Component {

state={

}

render() {
  return (
    <div className="container-fluid main">

      <div className="row">

          <div className="col-lg-5">
          </div>

          <div className="col-lg-2" style={{textAlign: "center"}}>
            <img src={bgLogo} alt="" />
          </div>

      </div>

      <div className="row textBg">

          <div className="col-lg-5">
          </div>

          <div className="col-lg-2" style={{textAlign: "center"}}>
            <h2>SurveyApe</h2>
          </div>

      </div>

      <br/><br/>

      <div className="row">

          <div className="col-lg-4">
          </div>

          <div className="col-lg-4 mainButtons">


              <span className="leftButt" onClick={()=>{this.props.gotoSignup()}}>
                <span><i className="fas fa-user-plus" style={{fontSize: 30}}></i></span> <span style={{fontSize: 24}}>Sign Up</span>
              </span>



              <span className="leftButt" onClick={()=>{this.props.gotoSignin()}}>
                <span><i className="fas fa-sign-in-alt" style={{fontSize: 30}}></i></span> <span style={{fontSize: 24}}>Sign In</span>
              </span>

          </div>


      </div>

    </div>
);
}
  }


export default LandingPage;
