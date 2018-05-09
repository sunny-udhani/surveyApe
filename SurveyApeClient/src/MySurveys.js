import React, {Component} from 'react';
import * as API from './api/API';


class MySurveys extends Component{
  constructor(props){
    super(props);
    this.state={
    }
    API.getMySurveys()
    .then((res)=>{
      console.log('AAAAAAA');
      console.log(res);
      this.setState({surveysArr:res});
      console.log(this.state.surveysArr);
    });
  }

  componentWillMount(){

  }

  giveStrSurveyType(id){
    if(id===1){
      return "General";
    }
    else if(id===2){
      return "Open";
    }
    else if(id===3){
      return "Closed";
    }
    else if(id===4){
      return "Other";
    }
  }
  render(){
    return(
      <div>
      {this.state.surveysArr?(<div>
        <table style={{width:"800px",height:"400px",border:"1px solid black"}}>
          <tr>
    <th>Survey Name</th>
    <th>Survey Type</th>
    <th>Edit Survey</th>
    <th>Publish Survey</th>
    <th>End Survey</th>
    <th>Invite More People</th>

    </tr>
        {this.state.surveysArr.map((item)=>{
    return (      <tr>
    <th>{item.surveyTitle}</th>
    <th>{this.giveStrSurveyType(item.surveyType)}</th>
    <th><input type="button" value="Edit Survey" onClick={()=>this.props.EditSurvey(item.surveyId)}/></th>
    <th><input type="button" value="Publish" onClick={()=>this.props.PublishSurvey(item.surveyId)}/></th>
    <th><input type="button" value="End" onClick={()=>this.props.EndSurvey(item.surveyId)}/></th>
    <th>Invite More:<input type="text"/>
    <input type="button" value="Send Invite" onClick={()=>this.props.AddInvitees(item.surveyId)}/>
    </th>
    </tr>)

  })}
      </table>
    </div>):(
      <div>

      </div>
    )}
      </div>
    );
  }
}

export default MySurveys;
