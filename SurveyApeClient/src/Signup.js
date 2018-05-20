import React, {Component} from 'react';

import './Signup.css';

class Signup extends Component {

constructor(props){
  super(props);

    this.state={
      firstName:'',
      lastName:'',
      email:'',
      password:''
    }

}

componentWillMount() {
  console.log("Inside will Mount of SignUp");
  console.log("Checking props received");
  console.log(this.props);
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
            <h2 style={{color: "green"}}>Sign Up</h2>
          </div>
        </div>

      <div className="row" >

              <div className="col-lg-2 labels">
                <label>First Name</label>
              </div>

              <div className="col-lg-6">
                <input name="firstName" placeholder="First name" type="text" className="inputBox" value={this.state.firstname} onChange={(event) => {
                  this.setState({
                    firstName: event.target.value
                  });}}/>
              </div>

      </div>


          <div className="row" >

              <div className="col-lg-2 labels">
                <label>Last Name</label>
              </div>

              <div className="col-lg-6">
                  <input name="lastName" placeholder="Last name" type="text" className="inputBox" value={this.state.lastname} onChange={(event) => {
                this.setState({
                    lastName: event.target.value
                });}}/>
              </div>

          </div>



          <div className="row">

              <div className="col-lg-2 labels">
                <label>Email Id</label>
              </div>

              <div className="col-lg-6">
                  <input name="email" placeholder="Email address" type="text" className="inputBox" value={this.state.email} onChange={(event) => {
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
                    <input name="password" placeholder="Password" type="password" className="inputBox" value={this.state.password} onChange={(event) => {
                  this.setState({
                      password: event.target.value
                  });}}/>
              </div>

          </div>



            <div style={{marginTop: "2%",float: "left"}}>
              <button className="btm btn-primary" onClick={()=>{this.props.registerUser({firstName:this.state.firstName, lastName:this.state.lastName, email: this.state.email, password: this.state.password, phone: "234133333", dataOpen: this.props.dataOpen})}}>Sign Up</button>
            </div>

            <div style={{marginTop: "4%", float: "left", marginLeft: "24%"}}>
              <h5>Already have an account? <span style={{color:"green",cursor: "pointer"}} onClick={()=>{this.props.gotoSignin()}}>&nbsp;&nbsp;Sign In</span></h5>
            </div>


        </div>
      </div>
  </div>
  </div>
);
}
  }


export default Signup;
