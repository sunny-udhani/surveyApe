import React, {Component} from 'react';
import {withRouter} from 'react-router';
import StarRatingComponent from 'react-star-rating-component';

import './Survey.css';
import * as API from './api/API';
import Logo from './logo.png';

class Survey extends Component {
    constructor(props) {
        super(props);
        this.state = {
            "questionList": [],
            "responseList": [],
            "rating": 1,
            "surveyResponses": [],
            "surveyId": '',
            "email": null,
            "bool":false

        }
    }


    componentWillMount() {

        console.log("http://localhost:3000" + this.props.match.url);
        console.log("surveyType: ", this.props.match.params.surveyType);
        console.log("SurveyRandomNumber: ", this.props.match.params.randSurvey);

        {/*  Sending the URl and SurveyType to the backend */
        }

        var data = {
            "url": "http://localhost:3000" + this.props.match.url,
            "surveyType": this.props.match.params.surveyType
        }

        console.log("payload");
        console.log(data);

        if (this.props.match.params.surveyType == 1) {
            API.getSurveyId(data)
                .then((res) => {
                    console.log(res);
                    console.log("surveyId Fetched: ");
                    console.log(res.survey_id);
                    this.setState({surveyId: res.survey_id, surveyResponse_id: res.surveyResponse_id});
                    var payload={surveyId:res.survey_id,surveyResponse_id:res.surveyResponse_id};
                    if(this.props.email){
                      payload.email=this.props.email;
                    }
                    API.getSurveyAndResp(payload)
                        .then((res) => {
                            console.log(res.responses);
                            this.setState({
                                surveyId: res.survey.surveyId,
                                surveyTitle: res.survey.surveyTitle,
                                questionList: res.survey.questionList,
                                responseList: res.responses,
                                answerObj: []
                            },function(){
                              if(this.state.responseList.length>0){
                                console.log('a');
                                for(var i=0;i<this.state.responseList.length;i++){
                                  for(var j=0;j<this.state.questionList.length;j++){
                                    if(this.state.responseList[i].questionId===this.state.questionList[j].surveyQuestionId){
                                      console.log('ala');

                                      this.state.questionList[j].response=JSON.parse(JSON.stringify(this.state.responseList[i].response));

                                    }
                                  }
                                }
                              }

                              for(var i=0;i<this.state.questionList.length;i++){
                                console.log(this.state.questionList[i]);
                              }
                              var temp=[];
                              for(var i=0;i<this.state.responseList.length;i++){
                                var one=this.state.responseList[i].questionId;
                                var two=this.state.responseList[i].response;
                                  var obj={ one: two};
                                  temp.push(obj);
                              }
                              console.log("State variable:");
                              console.log(this.state);
                              this.setState({...this.state, respObj:temp,"bool":true});
                            })
                        });
                });
        }
        else {
            API.getSurveyId(data)
                .then((aaj) => {

                    if (aaj.status !== 403) {

                        aaj.json().then(res => {
                            console.log("surveyId Fetched for Non-General Surveys: ");
                            console.log(res.toString());
                            // if()

                            this.setState({
                                surveyId: res.survey_id,
                                email: res.email, surveyResponse_id: res.surveyResponse_id
                            });
                            var payload={surveyId:res.survey_id,surveyResponse_id:res.surveyResponse_id,email:res.email};

                            API.getSurveyAndResp(payload)
                                .then((res) => {

                                    this.setState({
                                        surveyId: res.survey.surveyId,
                                        surveyResponse_id: res.survey.surveyResponse_id,
                                        surveyTitle: res.survey.surveyTitle,
                                        questionList: res.survey.questionList,
                                        responseList: res.responses,
                                        answerObj: []
                                    },function(){
                                      console.log('a');
                                      if(this.state.responseList.length>0){
                                        for(var i=0;i<this.state.responseList.length;i++){
                                          for(var j=0;j<this.state.questionList.length;j++){
                                            if(this.state.responseList[i].questionId===this.state.questionList[j].surveyQuestionId){
                                              console.log('ala');
                                              this.state.questionList[j].response=JSON.parse(JSON.stringify(this.state.responseList[i].response));

                                            }
                                          }
                                        }
                                      }

                                      for(var i=0;i<this.state.questionList.length;i++){
                                        console.log(this.state.questionList[i]);
                                      }
                                    })
                                });

                            console.log(this.state.responseList);
                            for(var i=0;i<this.state.questionList.length;i++){
                              console.log(this.state.questionList[i]);
                            }
                            var temp=[];
                            for(var i=0;i<this.state.responseList.length;i++){
                              var one=this.state.responseList[i].questionId;
                              var two=this.state.responseList[i].response;
                                var obj={ one: two};
                                temp.push(obj);
                            }
                            this.setState({...this.state, respObj:temp,"bool":true});
                        })
                            .catch(err => {
                                console.log("aaj");
                                console.log(err);
                            });
                    }else{
                        this.props.submitResponses();
                    }
                })
        }
    }


    submitResponses = (surveyId, answerObj, submit) => {
        var payload = {
            surveyId: surveyId,
            answerObj: answerObj,
            submit: submit,
            surveyee_id: this.state.email,
            surveyResponse_id: this.state.surveyResponse_id
        };
        API.submitResponse(payload)
            .then((res) => {
                console.log(res);

                this.props.submitResponses();
            })
            .catch(err => {
                console.log(err);
            })

    }

    onStarClick1(nextValue, prevValue, name) {
        this.setState({rating: nextValue});
    }


    renderOptions(question, index) {

        if (question.questionType === 1) {
            {/* Dropdown */
            }
            return (

                <div className="question">
                    <h3>{question.questionText}</h3>
                    <select onChange={(event) => {
                        var temp = this.state.answerObj;
                        for (var i = 0; i < temp.length; i++) {
                            if (temp[i].qid === question.surveyQuestionId) {
                                temp.splice(i, 1);
                                break;
                            }
                        }
                        temp.push({qid: question.surveyQuestionId, answer: event.target.value});
                        this.setState({answerObj: temp});
                        var payload={question_id:question.surveyQuestionId,response:event.target.value,survey_id:this.state.surveyId,survey_response_id:this.state.surveyResponse_id};
                        console.log(payload);
                        API.sendOneResp(payload);
                    }}>
                        {question.questionOptionList.map(option => (

                            <option value={option.optionText}>{option.optionText}</option>

                        ))}
                    </select>
                </div>

            );
        }

        else if (question.questionType === 2) {
            { /* Radio */
            }
            return (

                <div className="question">
                    <div className="col-lg-12" style={{backgroundColor: "gray"}}>
                        <h3>{question.questionText}</h3>
                    </div>

                    {question.questionOptionList.map(option => (
                        <div>
                            <input type="radio" name="a" checked={option.option_text===question.response} onChange={(event)=>{

                              var payload={question_id:question.surveyQuestionId,response:event.target.value,survey_id:this.state.surveyId,survey_response_id:this.state.surveyResponse_id};
                              console.log("jhasbxa"+payload);
                              API.sendOneResp(payload);
                              var qList=this.state.questionList;
                              for(var i=0;i<qList.length;i++){
                                if(i===index){
                                  qList[i].response=event.target.value;
                                }
                              }
                              this.setState({...this.state, questionList:qList})
                              }} onClick={(event) => {
                                console.log("asklndasnjdasjkndasjkdjknasnjkas");

                            }} value={option.option_text}/> {option.option_text}<br/>
                        </div>
                    ))}
                </div>

            );
        }

        else if (question.questionType === 3) {
            {/*  CheckBox */
            }
            return (

                <div className="question">


                    <div className="col-lg-12" style={{backgroundColor: "gray"}}>
                        <h3>{question.questionText}</h3>
                    </div>

                    {question.questionOptionList.map(option => (
                        <div>
                            <input type="checkbox" onChange={(event)=>{
                              var payload={question_id:question.surveyQuestionId,response:event.target.value,survey_id:this.state.surveyId,survey_response_id:this.state.surveyResponse_id};
                              console.log(payload);
                              API.sendOneResp(payload);
                              }} onClick={(event) => {
                                var temp = this.state.answerObj;
                                var temp2 = [];
                                if (event.checked) {
                                    for (var i = 0; i < temp.length; i++) {
                                        if (temp[i].qid === question.surveyQuestionId) {
                                            temp2 = temp[i].amswer;
                                            var bool = false
                                            for (var j = 0; j < temp2.length; j++) {
                                                if (temp2[j] === event.target.value) {
                                                    temp2.splice(j, 1);
                                                    bool = true;
                                                }
                                            }
                                            if (!bool) {
                                                temp2.push(event.target.value);
                                            }
                                        }
                                    }
                                }
                                else if (!event.checked) {
                                    for (var i = 0; i < temp.length; i++) {
                                        if (temp[i].qid === question.surveyQuestionId) {
                                            temp2 = temp[i].answer;
                                            for (var j = 0; j < temp2.length; j++) {
                                                if (temp2[j] === event.target.value) {
                                                    temp2.splice(j, 1);
                                                    bool = true;
                                                }
                                            }
                                        }
                                    }
                                }

                                temp.push({qid: question.surveyQuestionId, answer: temp2});

                                this.setState({answerObj: temp});
                            }} name={question.surveyQuestionId}/> {option.optionText}
                        </div>
                    ))}
                </div>

            );
        }

        else if (question.questionType === 4) {
            {/*  Yes/NO  */
            }
            return (

                <div className="question">
                    <div className="col-lg-12"
                         style={{backgroundColor: "gray", textAlign: "left", paddingLeft: 20, fontSize: 18}}>
                        <h3>{question.questionText}</h3>
                    </div>

                    {question.questionOptionList.map(option => (
                        <div style={{textAlign: "left", paddingLeft: 20}}>
                            <input type="radio" checked={option.optionText===question.response} onChange={(event)=>{

                              }} name="yn" onClick={(event) => {
                                var payload={question_id:question.surveyQuestionId,response:event.target.value,survey_id:this.state.surveyId,survey_response_id:this.state.surveyResponse_id};
                                console.log(payload);
                                var qList=this.state.questionList;
                                for(var i=0;i<qList.length;i++){
                                  if(i===index){
                                    qList[i].response=event.target.value;
                                  }
                                }
                                this.setState({...this.state, questionList:qList})

                                API.sendOneResp(payload);
                            }} value={option.optionText}/> {option.optionText}<br/>
                        </div>
                    ))}
                </div>

            );
        }

        else if (question.questionType === 5) {
            {/* Text */
            }
            var val="";
             if(this.state.resp){
               console.log("ITHE TRI ALA");
             this.state.resp.map((item)=>{
               if(item[question.surveyQuestionId]){
                 val=item[question.surveyQuestionId];
               }
             });
           }

            return (

                <div className="question">
                    <h3>{question.questionText}</h3>

                    <input onChange={(event)=>{
                      console.log("IN ON CHANGE");
                      var temp=this.state.questionList;
                      for(var i=0;i<temp.length;i++){
                        if(temp[i].surveyQuestionId===question.surveyQuestionId){
                          temp[i].response=event.target.value;
                        }
                      }

                        this.setState({...this.state,questionList:temp});
                    }}  type="text" onFocus={(event)=>{
                      event.target.value=question.response;
                    }}  onBlur={(event)=>{
                      var payload={question_id:question.surveyQuestionId,response:event.target.value,survey_id:this.state.surveyId,survey_response_id:this.state.surveyResponse_id};
                      console.log(payload);
                      API.sendOneResp(payload);
                      }}
                      name={question.surveyQuestionId}
                      onChange={(event) => {
                        var qList=this.state.questionList;
                        for(var i=0;i<qList.length;i++){
                          if(i===index){
                            qList[i].response=event.target.value;
                          }
                        }
                        this.setState({...this.state, questionList:qList})
                        var temp = this.state.answerObj;
                        for (var i = 0; i < temp.length; i++) {
                            if (temp[i].qid === question.surveyQuestionId) {
                                temp.splice(i, 1);
                                break;
                            }
                        }
                        temp.push({qid: question.surveyQuestionId, answer: event.target.value});
                        this.setState({answerObj: temp});
                    }}
                     value={this.state.questionList[index].response} />

                </div>

            );
        }

        else if (question.questionType === 6) {
            {/* Date */
            }
            return (

                <div className="question">
                <div className="col-lg-12"
                     style={{backgroundColor: "#157EFB", textAlign: "left", paddingLeft: 20, fontSize: 16}}>
                    <h3>{question.questionText}</h3>
                </div>


                    <div>
                    <div className="col-lg-12"
                         style={{textAlign: "left", paddingLeft: 20, fontSize: 16}}>

                        <input type="date" onChange={(event) => {
                            var temp = this.state.answerObj;
                            for (var i = 0; i < temp.length; i++) {
                                if (temp[i].qid === question.surveyQuestionId) {
                                    temp.splice(i, 1);
                                    break;
                                }
                            }
                            temp.push({qid: question.surveyQuestionId, answer: event.target.value});
                            this.setState({answerObj: temp});
                            var payload={question_id:question.surveyQuestionId,response:event.target.value,survey_id:this.state.surveyId,survey_response_id:this.state.surveyResponse_id};
                            console.log(payload);
                            API.sendOneResp(payload);
                        }} name={question.surveyQuestionId}/>
                        </div>

                    </div>
                </div>

            );
        }

        else {

            return (

              <div className="question">
                <div className="col-lg-12"
                     style={{backgroundColor: "#157EFB", textAlign: "left", paddingLeft: 20, fontSize: 16}}>
                    <h3>{question.questionText}</h3>
                </div>

                  <div style={{paddingLeft: 20}}>
                    <div className="col-lg-12"
                         style={{textAlign: "left", paddingLeft: 20, fontSize: 24}}>
                        <StarRatingComponent
                            name="rate1"
                            starCount={parseInt(question.response)}
                            value={this.state.rating}
                            onStarClick={(next, pre, name) => {
                                this.onStarClick1.bind(this)
                                this.setState({rating: next});
                                var temp = this.state.answerObj;
                                for (var i = 0; i < temp.length; i++) {
                                    if (temp[i].qid === question.surveyQuestionId) {
                                        temp.splice(i, 1);
                                        break;
                                    }
                                }
                                temp.push({qid: question.surveyQuestionId, answer: next.toString()});
                                console.log(temp);
                                this.setState({answerObj: temp});
                                var payload={question_id:question.surveyQuestionId,response:next.toString(),survey_id:this.state.surveyId,survey_response_id:this.state.surveyResponse_id};
                                console.log(payload);
                                API.sendOneResp(payload);
                                var qList=this.state.questionList;
                                for(var i=0;i<qList.length;i++){
                                  if(i===index){
                                    qList[i].response=next.toString();
                                  }
                                }
                                this.setState({...this.state, questionList:qList})
                            }}
                            name={question.surveyQuestionId}/>
                      </div>

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
          <div>
            <div className="row mainPageSurvey">

              {this.state.questionList.map((question,index) => (

                  this.renderOptions(question, index)

              ))}
              </div>
              <br/>
              <div className="row">
                <div className="col-lg-4">
                </div>
                <div className="col-lg-1">
                  <button className="btn btn-primary submit" onClick={()=>this.submitResponses(this.state.surveyId,this.state.answerObj,true)}>
                    Submit
                  </button>
                </div>

              </div>
          </div>




          </div>
    );

}

}

export default withRouter(Survey);
