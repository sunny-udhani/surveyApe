import React, {Component} from 'react';

import './Dashboard.css';
import Logo from './logo.png';


class Dashboard extends Component {
  constructor(props){
    super(props);
    this.state={

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

                      <div className="col-lg-3 col-sm-1 box" onClick={() => {
                        this.props.gotoCreateSurvey()
                      }}>
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


              <div className="row footer">

              </div>
      </div>
    );
  }
}

export default Dashboard;
