import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import GeneralForm from './GeneralForm';
import ClosedForm from './ClosedForm';
import OpenForm from './OpenForm';
import AnonymousForm from './AnonymousForm';
import Logo from './logo.png';

import './CreateSurvey.css';

class CreateSurvey extends Component {
  constructor(props){
    super(props);
    this.state={
      formType:null,
      surveyName:null,
      closedSurveyStr:"",
      endTime:null,
      closedSurveyList:[],
      inviteeStr:"",
      inviteeList:[]
    }
  }

  createS = (survey) =>{

    this.props.createSurvey(survey,this.state.closedSurveyList,this.state.inviteeList);
    this.setState({closedSurveyList:[],formType:null,
    surveyName:null,
    closedSurveyStr:"",});
  }

  addRecipients= () =>{
    var temp=this.state.closedSurveyStr.split(",");
    this.setState({closedSurveyList:temp,closedSurveyStr:""});
    console.log(this.state.closedSurveyStr);
  }

  addInvitees= () =>{
    var temp=this.state.inviteeStr.split(",");
    this.setState({inviteeList:temp,inviteeStr:""});
    console.log(this.state.inviteeStr);
  }

  render(){
    return (
      <div className="survey-form">

      {/* header section */}
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

          <br/>
        {/* Banner Text */}

        <div className="row">
          <div className="col-lg-3 main-text">
            <h3>Create a Survey</h3>
          </div>
        </div>

        {/* MainBody */}

        {!this.state.formType || !this.state.surveyName || !this.state.endTime?(<div>
          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="labels">Survey Name:</span>
                  <span className="inputs"><input type="text"  style={{width: "50%"}} value={this.state.surveyName} onChange={(event)=>this.setState({surveyName:event.target.value})}/></span>
                </div>

                <br/>
          </div>

<div className="row">
  <div className="col-lg-6 survey-name">
    <span className="labels">Survey Type:</span>
      <span className="inputs" style={{marginLeft: "10%"}}>
        <select style={{width: "50%", height:30}} onChange={(event)=>{this.setState({formType:event.target.value})}}>
          <option disabled selected value> -- select a form type-- </option>
          <option value="General">General</option>
          <option value="Closed">Closed</option>
          <option value="Open">Open</option>
          <option value="Anonymous">Anonymous</option>
        </select>
    </span>
  </div>
</div>



    <div className="row">
        <div className="col-lg-6 survey-name">
            <span className="labels">End Time:</span>

            <span className="inputs" style={{marginLeft: "10%"}}>

              <input type="date" style={{width: "50%"}} style={{marginLeft: 20}} onChange={(event)=>this.setState({endTime:event.target.value})}/>
              <button className="btn btn-primary" style={{marginLeft: 20}}  onClick={()=>this.setState({endTime:true})}>No End Time</button>
            </span>
        </div>
    </div>

</div>):(<div>
      {this.state.formType==="Closed" && !this.state.closedSurveyList.length && this.state.endTime?(<div>
        Select Recipients:<input type="text" value={this.state.closedSurveyStr} onChange={(event)=>this.setState({closedSurveyStr:event.target.value})}/>
      <input type="button" className="btn btn-primary" value="Add recipients" onClick={()=>this.addRecipients()}/>
      </div>):(<div>

      {this.state.formType==="General" && !this.state.inviteeList.length?(<div>
        Select Invitees:<input type="text" value={this.state.inviteeStr} onChange={(event)=>this.setState({inviteeStr:event.target.value})}/>
      <input type="button" className="btn btn-primary" value="Add invitees" onClick={()=>this.addInvitees()}/>
      </div>):(<div>
      <GeneralForm createSurvey={this.createS} formType={this.state.formType} surveyName={this.state.surveyName}/>
    </div>)
  }
    </div>)
    }
  </div>)
  }


      </div>
    )
  }
}


export default CreateSurvey;
