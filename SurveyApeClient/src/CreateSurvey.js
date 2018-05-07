import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import GeneralForm from './GeneralForm';
import ClosedForm from './ClosedForm';
import OpenForm from './OpenForm';
import AnonymousForm from './AnonymousForm';

class CreateSurvey extends Component{
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
      <div style={{paddingLeft:"45%"}}>
        {!this.state.formType || !this.state.surveyName || !this.state.endTime?(
          <div>
            Survey Name:<input type="text" value={this.state.surveyName} onChange={(event)=>this.setState({surveyName:event.target.value})}/>
          <br/>
            <select onChange={(event)=>{this.setState({formType:event.target.value})}}>
      <option disabled selected value> -- select a form type-- </option>
      <option value="General">General</option>
      <option value="Closed">Closed</option>
      <option value="Open">Open</option>
      <option value="Anonymous">Anonymous</option>
    </select>
    <br/>
    End Time: <input type="date" onChange={(event)=>this.setState({endTime:event.target.value})}/>
</div>):(<div>
      {this.state.formType==="Closed" && !this.state.closedSurveyList.length && this.state.endTime?(<div>
        Select Recipients:<input type="text" value={this.state.closedSurveyStr} onChange={(event)=>this.setState({closedSurveyStr:event.target.value})}/>
      <input type="button" value="Add recipients" onClick={()=>this.addRecipients()}/>
      </div>):(<div>
      {this.state.formType==="Open" && !this.state.inviteeList.length?(<div>
        Select Invitees:<input type="text" value={this.state.inviteeStr} onChange={(event)=>this.setState({inviteeStr:event.target.value})}/>
      <input type="button" value="Add invitees" onClick={()=>this.addInvitees()}/>
      </div>):(<div>
      <GeneralForm createSurvey={this.createS} formType={this.state.formType} surveyName={this.state.surveyName}/>
    </div>)}
    </div>)
    }
  </div>)
  }

      </div>
    )
  }
}


export default CreateSurvey;
