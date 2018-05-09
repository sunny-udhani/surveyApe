import React, {Component} from 'react';
import {withRouter} from 'react-router';
import StarRatingComponent from 'react-star-rating-component';

import './Survey.css';
import * as API from './api/API';
import Logo from './logo.png';

class Survey extends Component {
constructor(props) {
  super(props);
this.state={
    "questionList": [],
    "responseList": [],
    "rating": 1,
    "surveyResponses": []

}
}


componentWillMount()
{
  console.log(this.props.match.params);

  {/* fetching the survey from database */}
  API.getSurvey1(this.props.match.params.surveyType,this.props.match.params.randSurvey)
            .then((res) => {

                    console.log(res);

                    this.setState({
                      surveyId:res.surveyId,
                      surveyTitle: res.surveyTitle,
                      questionList: res.questionList,
                      responseList: res.responseList,
                      answerObj: []
                    })

            });
}

submitResponses = (surveyId,answerObj,submit)=>{

}

onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }


renderOptions (question) {

  if(question.questionType === 1){  {/* Dropdown */}
      return (

            <div className="question">
              <h3>{question.questionText}</h3>
              <select onChange={(event)=>{
                  var temp=this.state.answerObj;
                  for(var i=0;i<temp.length;i++){
                    if(temp[i].qid===question.surveyQuestionId){
                      temp.splice(i,1);
                      break;
                    }
                  }
                  temp.push({qid:question.surveyQuestionId,answer:event.target.value});
                  this.setState({answerObj:temp});
                }}>
              {question.questionOptionList.map(option => (

                  <option value={option.optionText}>{option.optionText}</option>

              ))}
              </select>
            </div>

      );
    }

else if(question.questionType === 2){ { /* Radio */}
    return (

          <div className="question">
          <div className="col-lg-12" style={{backgroundColor: "gray"}}>
            <h3>{question.questionText}</h3>
          </div>

            {question.questionOptionList.map(option => (
              <div>
                <input type="radio" name="a" onClick={(event)=>{
                      var temp=this.state.answerObj;
                      for(var i=0;i<temp.length;i++){
                        if(temp[i].qid===question.surveyQuestionId){
                          temp.splice(i,1);
                          break;
                        }
                      }
                      temp.push({qid:question.surveyQuestionId,answer:event.target.value});
                      this.setState({answerObj:temp});
                  }} value={option.option_text} /> {option.option_text}<br />
              </div>
            ))}
          </div>

    );
  }

  else if(question.questionType === 3){  {/*  CheckBox */}
      return (

            <div className="question">


            <div className="col-lg-12" style={{backgroundColor: "gray"}}>
              <h3>{question.questionText}</h3>
            </div>

              {question.questionOptionList.map(option => (
                <div>
                  <input type="checkbox" onClick={(event)=>{
                        var temp=this.state.answerObj;
                        var temp2=[];
                      if(event.checked){
                        for(var i=0;i<temp.length;i++){
                          if(temp[i].qid===question.surveyQuestionId){
                            temp2=temp[i].amswer;
                            var bool=false
                            for(var j=0;j<temp2.length;j++){
                              if(temp2[j]===event.target.value){
                                temp2.splice(j,1);
                                bool=true;
                              }
                            }
                            if(!bool){
                              temp2.push(event.target.value);
                            }
                          }
                        }
                      }
                      else if(!event.checked){
                        for(var i=0;i<temp.length;i++){
                          if(temp[i].qid===question.surveyQuestionId){
                            temp2=temp[i].answer;
                            for(var j=0;j<temp2.length;j++){
                              if(temp2[j]===event.target.value){
                                temp2.splice(j,1);
                                bool=true;
                              }
                            }
                          }
                        }
                      }

                      temp.push({qid:question.surveyQuestionId,answer:temp2});
                      this.setState({answerObj:temp});
                    }} name={question.surveyQuestionId} /> {option.option_text}
                </div>
              ))}
            </div>

      );
    }

    else if(question.questionType === 4){    {/*  Yes/NO  */}
        return (

              <div className="question">
              <div className="col-lg-12" style={{backgroundColor: "gray", textAlign: "left", paddingLeft: 20, fontSize: 18}}>
                <h3>{question.questionText}</h3>
              </div>

                {question.questionOptionList.map(option => (
                  <div style={{textAlign: "left", paddingLeft: 20}}>
                    <input type="radio" name="yn" onClick={(event)=>{
                          var temp=this.state.answerObj;
                          for(var i=0;i<temp.length;i++){
                            if(temp[i].qid===question.surveyQuestionId){
                              temp.splice(i,1);
                              break;
                            }
                          }
                          temp.push({qid:question.surveyQuestionId,answer:event.target.value});
                          this.setState({answerObj:temp});
                      }} value={option.optionText} /> {option.optionText}<br />
                  </div>
                ))}
              </div>

        );
      }

      else if(question.questionType === 5){ {/* Text */}
          return (

                <div className="question">
                  <h3>{question.questionText}</h3>

                  <input type="text" name={question.surveyQuestionId} onChange={(event)=>{
                      var temp=this.state.answerObj;
                      for(var i=0;i<temp.length;i++){
                        if(temp[i].qid===question.surveyQuestionId){
                          temp.splice(i,1);
                          break;
                        }
                      }
                      temp.push({qid:question.surveyQuestionId,answer:event.target.value});
                      this.setState({answerObj:temp});
                    }} />
                  <button className="btn btn-primary" style={{marginLeft: 10}}>Save</button>
                </div>

          );
        }

        else if(question.questionType === 6){  {/* Date */}
            return (

                  <div className="question">
                    <h3>{question.questionText}</h3>


                      <div>
                        <input type="date" onChange={(event)=>{
                            var temp=this.state.answerObj;
                            for(var i=0;i<temp.length;i++){
                              if(temp[i].qid===question.surveyQuestionId){
                                temp.splice(i,1);
                                break;
                              }
                            }
                            temp.push({qid:question.surveyQuestionId,answer:event.target.value});
                            this.setState({answerObj:temp});
                          }} name={question.surveyQuestionId} />
                        <button className="btn btn-primary" style={{marginLeft: 10}}>Save</button>
                      </div>
                  </div>

            );
          }

        else {

          return (

                <div className="question">
                  <h3>{question.questionText}</h3>


                    <div>
                    <StarRatingComponent
                      name="rate1"
                      starCount={5}
                      value={this.state.rating}
                      onStarClick={this.onStarClick.bind(this)}
                    />
                    </div>

                </div>

          );

        }
}


    render() {

      return (
        <div>
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
          <h2> Survey Name: {this.state.surveyTitle}</h2>
          <div className="row mainPageSurvey">
            {this.state.questionList.map(question => (

                this.renderOptions(question)

            ))}
            </div>
            <br/>
            <div className="row">
              <div className="col-lg-4">
              </div>

              <div className="col-lg-1" style={{marginLeft: 80}}>
                <button className="btn btn-primary save" onClick={()=>this.submitResponses(this.state.surveyId,this.state.answerObj,false)}>
                  Save
                </button>
              </div>
              <div className="col-lg-1">
                <button className="btn btn-primary submit" onClick={()=>this.submitResponses(this.state.surveyId,this.state.answerObj,true)}>
                  Submit
                </button>
              </div>

            </div>



          </div>
    );

}

}

export default withRouter(Survey);
