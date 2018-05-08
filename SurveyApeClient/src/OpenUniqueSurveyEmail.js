import React, {Component} from 'react';

import './OpenUniqueSurvey.css';

class OpenUniqueSurveyEmail extends Component {

state={

}

render() {
  return (
      <div className="open-unique-mainpage">
          <h3>Please Enter your Email: </h3>
          <input type="email" name="emailOpenUnique" />
          <button className="btn btn-primary" onClick={() => {this.props.redirectToSurvey()} }>Go</button>
      </div>
);
}
  }


export default OpenUniqueSurveyEmail;
