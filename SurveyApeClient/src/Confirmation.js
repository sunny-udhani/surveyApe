import React, {Component} from 'react';

import {BrowserRouter} from 'react-router-dom';
import Routing from "./Routing";

import './Confirmation.css';

class Confirmation extends Component {

  state={
    confirmation:'',
    email: ''
  }
    render() {
        return (
            <div className="container conf">


            <div className="row">
              <div className="col-lg-4">
              </div>

              <div className="col-lg-5" style={{borderTop: "1px solid", borderLeft: "1px solid", borderRight: "1px solid", paddingTop: "1%",backgroundColor: "#0074D9",paddingBottom: "0.5%"}}>
                2-Step Verification
              </div>

            </div>

            <div className="row">

                <div className="col-lg-4">
                </div>


                <div className="col-lg-5" style={{borderLeft: "1px solid", borderRight: "1px solid",paddingTop: "1%"}}>
                    Enter your Email id
                </div>
            </div>

            <div className="row">

                <div className="col-lg-4">
                </div>

                <div className="col-lg-5" style={{borderLeft: "1px solid", borderRight: "1px solid", paddingTop: "1%"}}>
                    <input placeholder="email" type="email" className="inputBox" value={this.state.email} onChange={(event) => {
                      this.setState({
                        email:event.target.value
                      });
                    }}/>
                </div>

            </div>


            <div className="row">

                <div className="col-lg-4">
                </div>


                <div className="col-lg-5" style={{borderLeft: "1px solid", borderRight: "1px solid",paddingTop: "1%"}}>
                    Enter the confirmation code you received
                </div>
            </div>

            <div className="row">

                <div className="col-lg-4">
                </div>

                <div className="col-lg-5" style={{borderLeft: "1px solid", borderRight: "1px solid", paddingTop: "1%"}}>
                    <input placeholder="confirmation code" type="text" className="inputBox" value={this.state.confirmation} onChange={(event) => {
                      this.setState({
                        confirmation:event.target.value
                      });
                    }}/>
                </div>

            </div>



            <div className="row">

              <div className="col-lg-4">
              </div>

              <div className="col-lg-5" style={{borderBottom: "1px solid", borderLeft: "1px solid", borderRight: "1px solid", paddingBottom: "3%", paddingTop: "1%"}}>
                <div style={{marginTop: "2%",float: "left"}}>
                  <button className="btn btn-primary" onClick={()=>{this.props.verifyUser({email: this.state.email, confirmation: this.state.confirmation})}}>Submit</button>
                </div>
              </div>

            </div>

            </div>
        );
    }
}

export default Confirmation;
