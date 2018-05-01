import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
var id=1;

class GeneralForm extends Component{
  constructor(props){
    super(props);
    this.state={
      questions:[],
      type:null,
      choice:null,
      ans:null,
      style:null,
      question:"",
      options:""
    }
  }

  addQuestion(ques,options=null){
      var temp=this.state.questions;
      var type=this.state.type;
      var choice=this.state.choice;
      var style=this.state.style;
      var ans=this.state.ans;
      if(ans===""){
        ans="SINGLE";
      }
      if(style===""){
        style="DROP";
      }
      if(choice===""){
        choice="TEXT";
      }
    if(!options){
      temp.push({id:id,question:ques,questionType:type,options:[]});

    }
    else{
    var optionArr=options.split(',');
    temp.push({id:id,question:ques,options:optionArr,questionType:type,choice:choice,style:style,answerType:ans});
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

  deleteQuestion(id){
    var temp=this.state.questions;
    var index=null;
    for(var i=0;i<temp.length;i++){
      if(temp[i][id]==id){
        index=i;
        break;
      }
    }
    temp.splice(index, 1);
    this.setState({
      questions:temp
    })
  }


  render(){
    return (
      <div>
      <div>
        {!this.state.type?(
          <select onChange={(event)=>{this.setState({type:event.target.value})}}>
      <option disabled selected value> -- select a question type-- </option>
      <option value="MCQ">MCQ</option>
      <option value="YN">Yes/No</option>
      <option value="SHORT">Short Answers</option>
      <option value="DATE">Date Time</option>
      <option value="STAR">Star Based</option>
    </select>
  ):(<div>

    {this.state.type==="MCQ"?(
      <div>
        <h4>Choice type:</h4>
          <select onChange={(event)=>{this.setState({choice:event.target.value})}}>
      <option disabled selected value> -- select a choice-- </option>
      <option value="TEXT">Text</option>
      <option value="IMAGE">Image</option>
      </select>
        <br/>
        <h4>Answer type:</h4>
          <select onChange={(event)=>{this.setState({ans:event.target.value})}}>
      <option disabled selected value> -- select answer type-- </option>
      <option value="SINGLE">Single Answer</option>
      <option value="MULTIPLE">Multiple Answers</option>
      </select>
      <br/>
        <h4>Visual Style:</h4>
          <select onChange={(event)=>{this.setState({style:event.target.value})}}>
      <option disabled selected value> -- select answer type-- </option>
      <option value="DROP">Dropdown</option>
      <option value="RADIO">Radio button</option>
      <option value="CHECK">Checkbox</option>
      </select>
      {(this.state.choice==="TEXT" && this.state.ans && this.state.style)?(
        <div>
          <h3>Question</h3>
          <input type="text" value={this.state.question} onChange={(event)=>{
              this.setState({question:event.target.value});
            }}/>
          <br/>
            <h3>Options (Give comma separated )</h3>
            <input type="text" value={this.state.options} onChange={(event)=>{
                this.setState({options:event.target.value});
              }}/>
            <input type="button" onClick={()=>this.addQuestion(this.state.question,this.state.options)} value="Add Question"/>
        </div>
      ):(
        <div>
          <h3>Question</h3>
          <input type="text" value={this.state.question} onChange={(event)=>{
              this.setState({question:event.target.value});
            }}/>
          <br/>
            <h3>Options (Give images )</h3>
            <input type="text" value={this.state.options} onChange={(event)=>{
                this.setState({options:event.target.value});
              }}/>
            <input type="button" onClick={()=>this.addQuestion(this.state.question,this.state.options)} value="Add Question"/>
        </div>
      )}
      <br/>
      </div>
    ):this.state.type==="YN"?(
      <div>
        <h3>Question</h3>
        <input type="text" value={this.state.question} onChange={(event)=>{
            this.setState({question:event.target.value});
          }}/>
        <br/>
        <input type="button" onClick={()=>this.addQuestion(this.state.question,"Yes,No")} value="Add Yes/No Question"/>
      </div>
    ):this.state.type==="SHORT"?(
      <div>
          <h3>Question</h3>
          <input type="text" value={this.state.question} onChange={(event)=>{
              this.setState({question:event.target.value});
            }}/>
          <br/>
          <input type="button" onClick={()=>this.addQuestion(this.state.question)} value="Add Short Answer Question"/>
      </div>
    ):this.state.type==="DATE"?(
      <div>
        <h3>Question</h3>
        <input type="text" value={this.state.question} onChange={(event)=>{
            this.setState({question:event.target.value});
          }}/>
        <br/>
        <input type="button" onClick={()=>this.addQuestion(this.state.question)} value="Add DateTime Question"/>
      </div>
    ):this.state.type==="STAR"?(
      <div>
        <h3>Question</h3>
        <input type="text" value={this.state.question} onChange={(event)=>{
            this.setState({question:event.target.value});
          }}/>
        <br/>
        <input type="button" onClick={()=>this.addQuestion(this.state.question,"0,1,2,3,4,5")} value="Add Star Rating Question"/>
      </div>
    ):(<div></div>)
    }
  </div>)}


      </div>

        {this.state.questions.length?(
          <div>
            <ul>
              {this.state.questions.map((item)=>{
                return <div><li key={item.id}>{item.question}
                        <ul>
                      {item.options.map((option)=>{
                        return <li key={option}>{option}</li>
                      })}
                    </ul>
                     </li>
                     <input type="button" onClick={()=>{this.deleteQuestion(item.id)}} value="Delete Question"/>
                   </div>
              })}
            </ul>
            <input type="button" value="Create Survey" onClick={()=>{
                console.log("Kaitri tari hotay");
                this.props.createSurvey({type:this.props.formType,questions:this.state.questions,name:this.props.surveyName});
                this.setState({
                  questions:[],
                  type:null,
                  choice:null,
                  ans:null,
                  style:null,
                  question:"",
                  options:""
                })
              }}/>
          </div>
        ):(
          <div></div>
        )}

      </div>
    )
  }
}


export default GeneralForm;
