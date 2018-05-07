import React, {Component} from 'react';

import './LandingPage.css';

import bgLogo from './logo1.png';


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
            <img className="animated swing" id="anim" src={bgLogo} alt="" />
          </div>

      </div>

      <div className="row textBg">

          <div className="col-lg-5">
          </div>

          <div className="col-lg-2" style={{textAlign: "center"}}>
            <h2 className="textMain animated fadeIn" id="textMain1" style={{color: "#68D783", fontWeight: 900}}>SurveyApe</h2>
          </div>

      </div>

      <br/>

      <div className="row">

          <div className="col-lg-4">
          </div>

          <div className="col-lg-4 mainButtons">

          <div className="row" >
              <div className="col-lg-6 animated bounceInUp" id="buttonMain">
                 <button className="butt" onClick={()=>{this.props.gotoSignup()}}>Sign Up</button>
              </div>

              <div className="col-lg-6 animated bounceInUp" id="buttonMain">
                <button className="butt">Sign In</button>
              </div>
          </div>

          </div>


      </div>

    </div>
);
}
  }


export default LandingPage;
