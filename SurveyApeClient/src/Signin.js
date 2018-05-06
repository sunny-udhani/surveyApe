import React, {Component} from 'react';

import './Signin.css';


class Signin extends Component {

  state={
    email:'',
    password:''
  }
  render() {
    return (
      <div style={{backgroundColor: "white"}}>
      {/* Place Header here  */}
        <div className="container" style={{marginTop: "3%"}}>

        <div className="row">

        <div className="col-lg-4">
        </div>

        <div className="col-lg-8">


        <div className="row">
          <div className="col-lg-4">
            <h2 style={{color: "green"}}>Sign In</h2>
          </div>
        </div>



          <div className="row">

              <div className="col-lg-2 labels">
                <label>Email Id</label>
              </div>

              <div className="col-lg-6">
                  <input placeholder="Email address" type="text" className="inputBox" value={this.state.email} onChange={(event) => {
                this.setState({
                    email: event.target.value
                });}}/>
              </div>
          </div>


          <div className="row">
              <div className="col-lg-2 labels">
                <label>Password</label>
              </div>

              <div className="col-lg-6">
                    <input placeholder="Password" type="password" className="inputBox" value={this.state.password} onChange={(event) => {
                  this.setState({
                      password: event.target.value
                  });}}/>
              </div>

          </div>


            <div style={{marginTop: "2%",float: "left"}}>
              <button className="btm btn-primary" onClick={()=>{this.props.signIn({email:this.state.email,password:this.state.password})}}>Sign In</button>
            </div>

            <div style={{marginTop: "4%", float: "left", marginLeft: "24%"}}>
              <h5>Dont have an account? <span style={{color:"green",cursor: "pointer"}} onClick={()=>{this.props.gotoSignup()}}>&nbsp;&nbsp;Sign Up</span></h5>
            </div>


        </div>
      </div>
  </div>
  </div>
);
  }
}

export default Signin;
