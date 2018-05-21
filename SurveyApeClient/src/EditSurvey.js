import React, {Component} from 'react';
import * as API from './api/API';
var id=1;

class EditSurvey extends Component{
  constructor(props){
    super(props);
    this.state={
      a:"",
      questions:[],
      type:null,
      choice:null,
      ans:null,
      style:null,
      question:"",
      options:"",
      closedSurveyStr:null,
      closedSurveyList:[],
      inviteeList:[],
      inviteeStr:null,
      oldInvitees:[],
      surveyAnswers:0
    }

    API.getSurvey(this.props.surveyId)
    .then((res) => {
        console.log(res);
        res=res.survey;
        var temp=[];
        for(var i=0;i<res.questionList.length;i++){
          var type=res.questionList[i].questionType;
          var style=null;
          var ans=null;
          var choice=null;
          if(type===1){
            type="1";
            style="DROP";
            choice="TEXT";
            ans="SINGLE";
          }
          else if(type===2){
            type="2";
            style="RADIO";
            choice="TEXT";
            ans="SINGLE";
          }
          else if(type===3){
            type="3";
            style="CHECK";
            choice="TEXT";
            ans="MULTIPLE";
          }
          else if(type===4){
            type="4";
            style="DROP";
            choice="TEXT";
            ans="SINGLE";
          }
          if(type===5){
            type="5";
            style="DROP";
            choice="TEXT";
            ans="SINGLE";
          }
          if(type===6){
            type="6";
            style="DROP";
            choice="TEXT";
            ans="SINGLE";
          }
          else if(type===7){
            type="7";
            style="DROP";
            choice="TEXT";
            ans="SINGLE";
          }
          var optionList=[];
          for(var j=0;j<res.questionList[i].questionOptionList.length;j++){
            optionList.push(res.questionList[i].questionOptionList[j].optionText);
          }
          var x=0;
          for(var j=0;j<res.responseList.length;j++){
            if(res.responseList[j].completeInd===true){
              x++;
            }
          }
          this.setState({surveyAnswers:x});
          temp.push({id:id,questionText:res.questionList[i].questionText,optionList:optionList,questionType:type,choice:choice,style:style,answerType:ans});
          id++;
        }

        this.setState({
          surveyTitle:res.surveyTitle,
          surveyType:res.surveyType,
          startDate:res.startDate,
          endDate:res.endDate,
          questions:temp,
          options:""
        })
        if(res.surveyType===1){
          var temp=res.responseList;
          var temp2=[];
          for(var i=0;i<temp.length;i++){
            temp2.push(temp[i].userEmail);
          }
        this.setState({inviteeStr:temp2.join(",")});
        this.setState({oldInvitees:temp2});
      //  this.setState({inviteeStr:""});
        }

        if(res.surveyType===3){
          var temp=res.responseList;
          var temp2=[];
          for(var i=0;i<temp.length;i++){
            temp2.push(temp[i].userEmail);
          }

          //this.setState({closedSurveyStr:temp2.join(",")});
          this.setState({closedSurveyStr:""});
          this.setState({oldInvitees:temp2});
        }
    });
  }

  componentWillMount(){

  }
  addQuestion(ques,options=null){
      var temp=this.state.questions;
      var type=this.state.type;
      var choice=this.state.choice;
      var style=this.state.style;
      var ans=this.state.ans;
      var formType=this.state.surveyType;
      if(ans===""){
        ans="SINGLE";
      }
      if(style===""){
        style="DROP";
      }
      if(choice===""){
        choice="TEXT";
      }

    //yn date short
    if(style==="DROP"){
      type="1";
    }
    else if(style==="RADIO"){
      type="2";
    }
    else if(style==="CHECK"){
      type="3";
    }
    else if(type==="YN"){
      type="4";
    }
    else if(type==="DATE"){
      type="6";
    }
    else if(type==="SHORT"){
      type="5";
    }
    else if(type==="STAR"){
      type="7";
    }
    else{

    }

    if(!options){
      temp.push({id:id,questionText:ques,questionType:type,optionList:[]});

    }
    else{
    var optionArr=options.split(',');
    temp.push({id:id,questionText:ques,optionList:optionArr,questionType:type,choice:choice,style:style,answerType:ans});
    }
    id++;
    this.setState({
      type:null,
      choice:null,
      ans:null,
      style:null,
      question:"",
      options:"",
      questions:temp
    });
  }

  saveAndPublish(){
    if(this.state.inviteeStr){
    var inviteeList=this.state.inviteeStr.split(",");
    }
    if(this.state.closedSurveyStr){
    var closedSurveyList=this.state.closedSurveyStr.split(",");
    }

    if(inviteeList && inviteeList.length>0){
      this.props.editSurvey({type:""+this.state.surveyType,questions:this.state.questions,name:this.state.surveyTitle,publish:true,oldInvitees:this.state.oldInvitees},[],inviteeList);
    }
    else if(closedSurveyList.length>0){
      this.props.editSurvey({type:""+this.state.surveyType,questions:this.state.questions,name:this.state.surveyTitle,publish:true,oldInvitees:this.state.oldInvitees},closedSurveyList,[]);
    }
    else{
      this.props.editSurvey({type:""+this.state.surveyType,questions:this.state.questions,name:this.state.surveyTitle,publish:true,oldInvitees:this.state.oldInvitees},[],[]);
    }
    this.setState({
      questions:[],
      type:null,
      choice:null,
      ans:null,
      style:null,
      question:"",
      options:""
    })
  }

  save(){
    if(this.state.inviteeStr){
    var inviteeList=this.state.inviteeStr.split(",");
    }
    if(this.state.closedSurveyStr){
    var closedSurveyList=this.state.closedSurveyStr.split(",");
    }
    console.log(inviteeList);
    if(inviteeList && inviteeList.length>0){
      this.props.editSurvey({type:""+this.state.surveyType,questions:this.state.questions,name:this.state.surveyTitle,publish:false,oldInvitees:this.state.oldInvitees},[],inviteeList);
    }
    else if(closedSurveyList.length>0){
      this.props.editSurvey({type:""+this.state.surveyType,questions:this.state.questions,name:this.state.surveyTitle,publish:false,oldInvitees:this.state.oldInvitees},closedSurveyList,[]);
    }
    else{
      this.props.editSurvey({type:""+this.state.surveyType,questions:this.state.questions,name:this.state.surveyTitle,publish:false,oldInvitees:this.state.oldInvitees},[],[]);
    }
      this.setState({
        questions:[],
        type:null,
        choice:null,
        ans:null,
        style:null,
        question:"",
        options:""
      })
  }

  deleteQuestion(id1){
    console.log(id1);
    var temp=this.state.questions;
    var index=null;
    for(var i=0;i<temp.length;i++){
      console.log(temp[i]);
      if(temp[i].id==id1){
        index=i;
        break;
      }
    }
    console.log(index);
    temp.splice(index, 1);
    this.setState({
      questions:temp
    })
  }
    importJSON(e) {
        var formdata = new FormData();
        formdata.append("file", e.target.files[0]);
        API.importJSON(this.props.surveyId, formdata)
            .then(res => {
                console.log(res);
                if (res.status == 200) {
                    alert("Imported Successfully")
                    this.setState({new: "reload"});
                }
            })

    }

  render(){
    var self=this;
    return(
      <div style={{marginLeft:"20%"}}>

        <h4>SurveyName:</h4>
        <input type="text" style={{width:"80%"}} value={this.state.surveyTitle} onChange={(event)=>this.setState({surveyTitle:event.target.value})}/><br/>
      <h4>Survey Start Date:</h4>
      <input type="date" style={{width:"80%"}} value={this.state.startDate} onChange={(event)=>this.setState({startDate:event.target.value})}/><br/>
    <h4>Survey End Date:</h4>
      <input type="date" style={{width:"80%"}} value={this.state.endDate} onChange={(event)=> this.setState({endDate:event.target.value})}/><br/>
  {this.state.surveyType===1?(<div>
  <h4>Invitee List:</h4>
    <input type="text" style={{width:"80%"}} value={this.state.inviteeStr} onChange={(event)=>this.setState({inviteeStr:event.target.value})}/> <br/>
  </div>):(<div>
  </div>)}
  {this.state.surveyType===3?(<div>
  <h4>Closed survey List:</h4>
  <input type="text" style={{width:"80%"}} value={this.state.closedSurveyStr} onChange={(event)=>this.setState({closedSurveyStr:event.target.value})}/> <br/>
  </div>):(<div>
  </div>)}
    <div>
      {!this.state.type && this.state.surveyAnswers===0?(


        <div>
            <div>
                <h4>Select a Question Type :</h4>



                <select style={{width:"80%",height:30}} onChange={(event)=>{this.setState({type:event.target.value})}}>
                  <option disabled selected value> -- select a question type-- </option>
                  <option value="MCQ">MCQ</option>
                  <option value="YN">Yes/No</option>
                  <option value="SHORT">Short Answers</option>
                  <option value="DATE">Date Time</option>
                  <option value="STAR">Star Based</option>
                </select>


            </div>
        </div>

):(<div>

  {this.state.type==="MCQ"?(
    <div>

    <div>
        <div>
            <h4>Select a choice type: </h4>


            <select style={{width:"80%"}} onChange={(event)=>{this.setState({choice:event.target.value})}}>
              <option disabled selected value> -- select a choice-- </option>
              <option value="TEXT">Text</option>
              <option value="IMAGE">Image</option>
            </select>

        </div>
    </div>


      <br/>

      <div>
          <div>
              <h4>Answer type: </h4>
              <select style={{width:"80%"}} onChange={(event)=>{this.setState({ans:event.target.value})}}>
                <option disabled selected value> -- select answer type-- </option>
                <option value="SINGLE">Single Answer</option>
                <option value="MULTIPLE">Multiple Answers</option>
              </select>
          </div>
      </div>


    <br/>

    <div>
        <div >
            <h4>Visual Style: </h4>
            <select style={{width:"80%"}} onChange={(event)=>{this.setState({style:event.target.value})}}>
              <option disabled selected value> -- select answer type-- </option>
              <option value="DROP">Dropdown</option>
              <option value="RADIO">Radio button</option>
              <option value="CHECK">Checkbox</option>
            </select>
        </div>
    </div>


    {(this.state.choice==="TEXT" && this.state.ans && this.state.style)?(
      <div>

      <div>
            <div>
              <h4>Question</h4>

                <input type="text" style={{width:"80%"}} value={this.state.question} onChange={(event)=>{
                    this.setState({question:event.target.value});
                  }}/>
            </div>
      </div>

        <br/>

        <div>
              <div>
                <h4>Options (Give comma separated )</h4>

                  <input type="text" style={{width:"80%"}} value={this.state.options} onChange={(event)=>{
                      this.setState({options:event.target.value});
                    }}/>

              </div>
        </div>


        <div>
              <div>
                <br/>
                  <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,this.state.options)} value="Add Question"/>
              </div>
        </div>

      </div>
    ):(
      <div>


      <div>
            <div>
              <h4>Question</h4>

                <input type="text" style={{width:"80%"}} value={this.state.question} onChange={(event)=>{
                    this.setState({question:event.target.value});
                  }}/>

            </div>
      </div>

        <br/>


        <div>
              <div>
                <h4>Options (Give images )</h4>
                    <input type="text" style={{width:"80%"}} value={this.state.options} onChange={(event)=>{
                        this.setState({options:event.target.value});
                      }}/>
              </div>
        </div>


        <div>
              <div>
                <br/>
                  <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,this.state.options)} value="Add Question"/>
              </div>
        </div>


      </div>
    )}
    <br/>
    </div>
  ):this.state.type==="YN"?(
    <div>

    <div>
          <div>
            <h4>Question</h4>
            <input type="text" style={{width:"80%"}} value={this.state.question} onChange={(event)=>{
                this.setState({question:event.target.value});
              }}/>
          </div>
    </div>



      <br/>

      <div>
            <div><br/>
                <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,"Yes,No")} value="Add Yes/No Question"/>
            </div>
      </div>

    </div>
  ):this.state.type==="SHORT"?(
    <div>


    <div>
          <div>
            <h4>Question</h4>
            <input type="text" style={{width:"80%"}} value={this.state.question} onChange={(event)=>{
                this.setState({question:event.target.value});
              }}/>
          </div>
    </div>


        <br/>

        <div>
              <div><br/>
                  <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question)} value="Add Short Answer Question"/>
              </div>
        </div>


    </div>
  ):this.state.type==="DATE"?(
    <div>

    <div>
          <div>
            <h4>Question</h4>
            <input type="text" value={this.state.question} style={{width:"80%"}} onChange={(event)=>{
                this.setState({question:event.target.value});
              }}/>
          </div>
    </div>

      <br/>

      <div>
            <div><br/>
                <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question)} value="Add DateTime Question"/>
            </div>
      </div>


    </div>
  ):this.state.type==="STAR"?(
    <div>



    <div>
          <div>
            <h4>Question</h4>
            <input type="text" style={{width:"80%"}} value={this.state.question} onChange={(event)=>{
                this.setState({question:event.target.value});
              }}/>
          </div>
    </div>

      <br/>

      <div>
            <div><br/>
                <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,"0,1,2,3,4,5")} value="Add Star Rating Question"/>
            </div>
      </div>


    </div>
  ):(<div></div>)
  }
</div>)}


    </div>
  <div style={{marginLeft:"30%"}}>
  <h4>QUESTIONS:</h4>
    <ul>
      {this.state.questions.map((item)=>{
        return <div><li style={{listStyleType:"none",width:"80%"}} key={item.id}>Q: {item.questionText}
                <ul>
              {item.optionList.map((option)=>{
                return <li style={{listStyleType:"none",width:"60%"}} key={option}> <input type="radio" value={option}/><label>{option}</label></li>
              })}
            </ul>
             </li>
             <input type="button" className="btn btn-primary" onClick={()=>{this.deleteQuestion(item.id)}} value="Delete Question"/>
           </div>
      })}
    </ul>
  </div>
  <br/>
      <div>

        <div>
            <input type="button" style={{marginLeft:"10%"}} className="btn btn-primary" value="Save and Publish" onClick={()=>{
                this.saveAndPublish();
              }}/>

            <input type="file" style={{marginLeft: "10%"}} accept="application/json"
                   onChange={e => this.importJSON(e)}/>

            <input type="button" style={{marginLeft:"10%"}} className="btn btn-primary" value="Save" onClick={()=>{
              this.save();
                }}/>
        </div>
      </div>

                <div>

                    <div>


                    </div>
                </div>

            </div>
        );
    }
}

export default EditSurvey;
