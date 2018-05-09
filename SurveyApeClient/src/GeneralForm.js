import React, {Component} from 'react';
import {BrowserRouter} from 'react-router-dom';
import './CreateSurvey.css';
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
      options:"",
    }
  }

  addQuestion(ques,options=null){
      var temp=this.state.questions;
      var type=this.state.type;
      var choice=this.state.choice;
      var style=this.state.style;
      var ans=this.state.ans;
      var formType=this.props.formType;
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


  render(){
    return (
      <div>
      <div>
        {!this.state.type?(


          <div className="row">
              <div className="col-lg-6 survey-name">
                  <span className="labels">Select a Question Type :</span>

                  <span className="inputs" style={{marginLeft: "3.3%"}}>

                  <select style={{width: "50%", height:30}} onChange={(event)=>{this.setState({type:event.target.value})}}>
                    <option disabled selected value> -- select a question type-- </option>
                    <option value="MCQ">MCQ</option>
                    <option value="YN">Yes/No</option>
                    <option value="SHORT">Short Answers</option>
                    <option value="DATE">Date Time</option>
                    <option value="STAR">Star Based</option>
                  </select>

                  </span>
              </div>
          </div>

  ):(<div>

    {this.state.type==="MCQ"?(
      <div>

      <div className="row">
          <div className="col-lg-6 survey-name">
              <span className="labels">Select a choice type: </span>

              <span className="inputs" style={{marginLeft: "3.3%"}}>

              <select onChange={(event)=>{this.setState({choice:event.target.value})}}>
                <option disabled selected value> -- select a choice-- </option>
                <option value="TEXT">Text</option>
                <option value="IMAGE">Image</option>
              </select>

              </span>
          </div>
      </div>


        <br/>

        <div className="row">
            <div className="col-lg-6 survey-name">
                <span className="labels">Answer type: </span>

                <span className="inputs" style={{marginLeft: "3.3%"}}>

                <select onChange={(event)=>{this.setState({ans:event.target.value})}}>
                  <option disabled selected value> -- select answer type-- </option>
                  <option value="SINGLE">Single Answer</option>
                  <option value="MULTIPLE">Multiple Answers</option>
                </select>

                </span>
            </div>
        </div>


      <br/>

      <div className="row">
          <div className="col-lg-6 survey-name">
              <span className="labels">Visual Style: </span>

              <span className="inputs" style={{marginLeft: "3.3%"}}>

              <select onChange={(event)=>{this.setState({style:event.target.value})}}>
                <option disabled selected value> -- select answer type-- </option>
                <option value="DROP">Dropdown</option>
                <option value="RADIO">Radio button</option>
                <option value="CHECK">Checkbox</option>
              </select>

              </span>
          </div>
      </div>


      {(this.state.choice==="TEXT" && this.state.ans!=null && this.state.style!=null)?(
        <div>

        <div className="row">
              <div className="col-lg-6 survey-name">
                <span className="labels">Question</span>
                <span className="inputs">
                  <input type="text" value={this.state.question} onChange={(event)=>{
                      this.setState({question:event.target.value});
                    }}/>
                </span>
              </div>
        </div>

          <br/>

          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="labels">Options (Give comma separated )</span>
                  <span className="inputs">
                    <input type="text" value={this.state.options} onChange={(event)=>{
                        this.setState({options:event.target.value});
                      }}/>
                  </span>
                </div>
          </div>


          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="inputs-add"><br/>
                    <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,this.state.options)} value="Add Question"/>
                  </span>
                </div>
          </div>

        </div>
      ):this.state.choice==="IMAGE" && this.state.ans!=null && this.state.style!=null ?(
        <div>
          IMAGE OPTIONS
          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="labels">Question</span>
                  <span className="inputs">
                    <input type="text" value={this.state.question} onChange={(event)=>{
                        this.setState({question:event.target.value});
                      }}/>
                  </span>
                </div>
          </div>

          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="labels">Options (Give images )</span>
                  <span className="inputs">
                      <input type="text" value={this.state.options} onChange={(event)=>{
                          this.setState({options:event.target.value});
                        }}/>
                  </span>
                </div>
          </div>


          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="inputs-add"><br/>
                    <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,this.state.options)} value="Add Question"/>
                  </span>
                </div>
          </div>

        </div>
      ):
      (
        <div>


        <div className="row">
              <div className="col-lg-6 survey-name">
                <span className="labels">Question</span>
                <span className="inputs">
                  <input type="text" value={this.state.question} onChange={(event)=>{
                      this.setState({question:event.target.value});
                    }}/>
                </span>
              </div>

        </div>

          <br/>


          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="labels">Options (Give images )</span>
                  <span className="inputs">
                      <input type="text" value={this.state.options} onChange={(event)=>{
                          this.setState({options:event.target.value});
                        }}/>
                  </span>
                </div>
          </div>


          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="inputs-add"><br/>
                    <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,this.state.options)} value="Add Question"/>
                  </span>
                </div>
          </div>


        </div>
      )}
      <br/>
      </div>
    ):this.state.type==="YN"?(
      <div>

      <div className="row">
            <div className="col-lg-6 survey-name">
              <span className="labels">Question</span>
              <span className="inputs">
              <input type="text" value={this.state.question} onChange={(event)=>{
                  this.setState({question:event.target.value});
                }}/>
              </span>
            </div>
      </div>



        <br/>

        <div className="row">
              <div className="col-lg-6 survey-name">
                <span className="inputs-add"><br/>
                  <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,"Yes,No")} value="Add Yes/No Question"/>
                </span>
              </div>
        </div>

      </div>
    ):this.state.type==="SHORT"?(
      <div>


      <div className="row">
            <div className="col-lg-6 survey-name">
              <span className="labels">Question</span>
              <span className="inputs">
              <input type="text" value={this.state.question} onChange={(event)=>{
                  this.setState({question:event.target.value});
                }}/>
              </span>
            </div>
      </div>


          <br/>

          <div className="row">
                <div className="col-lg-6 survey-name">
                  <span className="inputs-add"><br/>
                    <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question)} value="Add Short Answer Question"/>
                  </span>
                </div>
          </div>


      </div>
    ):this.state.type==="DATE"?(
      <div>

      <div className="row">
            <div className="col-lg-6 survey-name">
              <span className="labels">Question</span>
              <span className="inputs">
              <input type="text" value={this.state.question} onChange={(event)=>{
                  this.setState({question:event.target.value});
                }}/>
              </span>
            </div>
      </div>

        <br/>

        <div className="row">
              <div className="col-lg-6 survey-name">
                <span className="inputs-add"><br/>
                  <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question)} value="Add DateTime Question"/>
                </span>
              </div>
        </div>


      </div>
    ):this.state.type==="STAR"?(
      <div>



      <div className="row">
            <div className="col-lg-6 survey-name">
              <span className="labels">Question</span>
              <span className="inputs">
              <input type="text" value={this.state.question} onChange={(event)=>{
                  this.setState({question:event.target.value});
                }}/>
              </span>
            </div>
      </div>

        <br/>

        <div className="row">
              <div className="col-lg-6 survey-name">
                <span className="inputs-add"><br/>
                  <input type="button" className="btn btn-primary" onClick={()=>this.addQuestion(this.state.question,"0,1,2,3,4,5")} value="Add Star Rating Question"/>
                </span>
              </div>
        </div>


      </div>
    ):(<div></div>)
    }
  </div>)}


      </div>

        {this.state.questions.length?(
          <div>
            <ul>
              {this.state.questions.map((item)=>{
                return <div><li key={item.id}>{item.questionText}
                        <ul>
                      {item.optionList.map((option)=>{
                        return <li key={option}>{option}</li>
                      })}
                    </ul>
                     </li>
                     <input type="button" className="btn btn-primary" onClick={()=>{this.deleteQuestion(item.id)}} value="Delete Question"/>
                   </div>
              })}
            </ul>

            <div className="row">

              <div className="col-lg-2">
                  <input type="button" className="btn btn-primary" value="Save and Publish" onClick={()=>{
                      this.props.createSurvey({type:this.props.formType,questions:this.state.questions,name:this.props.surveyName,publish:true});
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
            </div>
            <br/>

            <div className="row">

              <div className="col-lg-2">

                  <input type="button" className="btn btn-primary" value="Save" onClick={()=>{
                      this.props.createSurvey({type:this.props.formType,questions:this.state.questions,name:this.props.surveyName,publish:false});
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
            </div>

          </div>
        ):(
          <div></div>
        )}

      </div>
    )
  }
}


export default GeneralForm;
