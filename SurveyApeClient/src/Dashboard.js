import React, {Component} from 'react';

import './Dashboard.css';
import Logo from './logo.png';


class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state={
      survey_id: 1,
      surveyurivalid_ind: 1,
      surveyuri: "abc/def",
      complete_ind: 1,
      surveyee_id: "shashank.singh9193@gmail.com",
      responses: [
        {
          question_id: 1,
          response_text: "I am shashank",
          option_id: 3
        },
        {
          question_id: 2,
          response_text: "I am Aviral",
          option_id: 4
        },
        {
          question_id: 3,
          response_text: "I am chandan",
          option_id: 2
        },
        {
          question_id: 4,
          response_text: "I am Sunny",
          option_id: 1
        }
      ]
    }
  }


  render() {
    return (
      <div className="dashboard">

              <div className="row bar">
                  <div className="col-lg-1 logo">
                      <img src={Logo} />
                  </div>
                  <div className="col-lg-3 textLogo">
                    Survey Ape
                  </div>
                  <div className="col-lg-4">

                  </div>

              </div>

              <div className="row survey-pane">

                      <div className="col-lg-3 col-sm-1 box">
                          <div className="row first">
                              <div className="imgBox">
                                  <i className="fas fa-plus-circle fa-5x imgBox1"></i>
                                  <br/>
                                  <br />
                                  <h3>Create Survey</h3>
                              </div>


                          </div>
                      </div>
                      <div className="col-lg-3 col-sm-1 box">
                          <div className="row first">
                              <div className="imgBox">
                                  <i className="fab fa-wpforms fa-5x imgBox1"></i>
                                  <br/>
                                  <br />
                                  <h3>Your Surveys </h3>
                              </div>
                          </div>
                      </div>
                      <div className="col-lg-3 col-sm-1 box">
                          <div className="row first">
                              <div className="imgBox">
                                  <i className="fas fa-clipboard-list fa-5x imgBox1"></i>
                                  <br/>
                                  <br/>
                                  <h3>Surveys To Take</h3>
                              </div>

                          </div>
                      </div>
             </div>

             <div className="row">
                <button className="btn btn-success" onClick={() => {this.props.submitResponses(this.state)}}>Send Responses</button>
             </div>

              <div className="row footer">

              </div>
      </div>
    );
  }
}

export default Dashboard;
