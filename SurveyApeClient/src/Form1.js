import React, {Component} from 'react';
import './Form1.css';

var id = 1;

class Form1 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            formType: null,
            surveyName: null,
            closedSurveyStr: "",
            endTime: null,
            closedSurveyList: [],
            inviteeStr: "",
            inviteeList: [],
            questions: [],
            type: null,
            choice: null,
            ans: null,
            style: null,
            question: "",
            options: "",
        }
    }

    createS = (survey) => {
        if (this.state.inviteeStr != "") {
            //this.addInvitees();
            var temp = this.state.inviteeStr.split(",");
            console.log("TEMP: " + temp);
            this.setState({inviteeList: temp, inviteeStr: ""}, function () {
                this.props.createSurvey(survey, this.state.closedSurveyList, this.state.inviteeList);
            });
        }
        else if (this.state.closedSurveyStr != "") {
            var temp = this.state.closedSurveyStr.split(",");
            this.setState({closedSurveyList: temp, closedSurveyStr: ""}, function () {
                this.props.createSurvey(survey, this.state.closedSurveyList, this.state.inviteeList);
            });
        }
        else {
            this.props.createSurvey(survey, this.state.closedSurveyList, this.state.inviteeList);
        }

        this.setState({
            closedSurveyList: [], formType: null,
            surveyName: null,
            closedSurveyStr: "",
        });
    }

    addRecipients = () => {
        var temp = this.state.closedSurveyStr.split(",");
        this.setState({closedSurveyList: temp, closedSurveyStr: ""});
        console.log(this.state.closedSurveyStr);
    }

    addInvitees = () => {
        var temp = this.state.inviteeStr.split(",");
        console.log("TEMP: " + temp);
        this.setState({inviteeList: temp, inviteeStr: ""});
        console.log(this.state.inviteeStr);
    }

    addQuestion(ques, options = null) {
        var temp = this.state.questions;
        var type = this.state.type;
        var choice = this.state.choice;
        var style = this.state.style;
        var ans = this.state.ans;
        var formType = this.props.formType;
        if (ans === "") {
            ans = "SINGLE";
        }
        if (style === "") {
            style = "DROP";
        }
        if (choice === "") {
            choice = "TEXT";
        }

        //yn date short
        if (style === "DROP") {
            type = "1";
        }
        else if (style === "RADIO") {
            type = "2";
        }
        else if (style === "CHECK") {
            type = "3";
        }
        else if (type === "YN") {
            type = "4";
        }
        else if (type === "DATE") {
            type = "6";
        }
        else if (type === "SHORT") {
            type = "5";
        }
        else if (type === "STAR") {
            type = "7";
        }
        else {

        }

        if (!options) {
            temp.push({id: id, questionText: ques, questionType: type, optionList: []});

        }
        else {
            var optionArr = options.split(',');
            temp.push({
                id: id,
                questionText: ques,
                optionList: optionArr,
                questionType: type,
                choice: choice,
                style: style,
                answerType: ans
            });
        }
        id++;
        this.setState({
            type: null,
            choice: null,
            ans: null,
            style: null,
            question: "",
            options: "",
            questions: temp
        });
    }

    deleteQuestion(id1) {
        console.log(id1);
        var temp = this.state.questions;
        var index = null;
        for (var i = 0; i < temp.length; i++) {
            console.log(temp[i]);
            if (temp[i].id == id1) {
                index = i;
                break;
            }
        }
        console.log(index);
        temp.splice(index, 1);
        this.setState({
            questions: temp
        })
    }

    render() {
        return (
            <div>
                <div className="container-fluid">
                    <form className="form-group">
                        <div>
                            <h2 style={{textAlign: "center"}}>Create Survey</h2>
                            <br/><br/>
                        </div>
                        <div>
                            <div style={{marginLeft: "20%"}}>
                                <div>
                                    <h4>Survey Name:</h4>
                                    <input type="text" className="borderBottom" style={{width: "80%", height: 30}}
                                           value={this.state.surveyName}
                                           onChange={(event) => this.setState({surveyName: event.target.value})}/>
                                </div>

                                <br/>
                            </div>

                            <div style={{marginLeft: "20%"}}>
                                <div>
                                    <h4>Survey Type:</h4>
                                    <select style={{width: "80%", height: 30}} onChange={(event) => {
                                        this.setState({formType: event.target.value})
                                    }}>
                                        <option disabled selected value> -- select a form type--</option>
                                        <option value="General">General</option>
                                        <option value="Closed">Closed</option>
                                        <option value="Open">Open</option>
                                        <option value="Anonymous">Anonymous</option>
                                    </select>

                                </div>
                            </div>
                            <br/>


                            <div style={{marginLeft: "20%"}}>
                                <div>
                                    <h4>End Time:</h4>
                                    <input type="date" style={{width: "50%"}} style={{width: "80%", height: 30}}
                                           onChange={(event) => this.setState({endTime: event.target.value})}/>
                                </div>
                            </div>

                            {this.state.formType === "Closed" ? (<div style={{marginLeft: "20%"}}>
                                <br/>
                                <h4>Select Recipients:</h4><input type="text" style={{width: "80%", height: 30}}
                                                                  value={this.state.closedSurveyStr}
                                                                  onChange={(event) => this.setState({closedSurveyStr: event.target.value})}/>
                            </div>) : (<div>

                                {this.state.formType === "General" || this.state.formType === "Open" ? (
                                    <div style={{marginLeft: "20%"}}>
                                        <br/>
                                        <h4>Select Invitees:</h4><input type="text" value={this.state.inviteeStr}
                                                                        style={{width: "80%", height: 30}}
                                                                        onChange={(event) => this.setState({inviteeStr: event.target.value})}/>
                                    </div>) : (<div>
                                    {/*<GeneralForm createSurvey={this.createS} formType={this.state.formType} surveyName={this.state.surveyName}/>*/}
                                </div>)
                                }
                            </div>)
                            }
                        </div>

                        <div style={{marginLeft: "20%"}}>
                            <br/>
                            <h4>Select a Question Type :</h4>
                            <select style={{width: "80%", height: 30}} onChange={(event) => {
                                this.setState({type: event.target.value})
                            }}>
                                <option disabled selected value> -- select a question type--</option>
                                <option value="MCQ">MCQ</option>
                                <option value="YN">Yes/No</option>
                                <option value="SHORT">Short Answers</option>
                                <option value="DATE">Date Time</option>
                                <option value="STAR">Star Based</option>
                            </select>

                        </div>
                        <div>
                            <br/>
                            <div style={{marginLeft: "20%"}}>

                                {this.state.type === "MCQ" ? (
                                    <div>

                                        <div>
                                            <div>
                                                <h4>Select a choice type:</h4>

                                                <select style={{width: "80%"}} onChange={(event) => {
                                                    this.setState({choice: event.target.value})
                                                }}>
                                                    <option disabled selected value> -- select a choice--</option>
                                                    <option value="TEXT">Text</option>
                                                    <option value="IMAGE">Image</option>
                                                </select>

                                            </div>
                                        </div>


                                        <br/>

                                        <div>
                                            <div>
                                                <h4>Answer type:</h4>


                                                <select style={{width: "80%"}} onChange={(event) => {
                                                    this.setState({ans: event.target.value})
                                                }}>
                                                    <option disabled selected value> -- select answer type--</option>
                                                    <option value="SINGLE">Single Answer</option>
                                                    <option value="MULTIPLE">Multiple Answers</option>
                                                </select>

                                            </div>
                                        </div>


                                        <br/>

                                        <div>
                                            <div>
                                                <h4>Visual Style:</h4>


                                                <select style={{width: "80%"}} onChange={(event) => {
                                                    this.setState({style: event.target.value})
                                                }}>
                                                    <option disabled selected value> -- select answer type--</option>
                                                    <option value="DROP">Dropdown</option>
                                                    <option value="RADIO">Radio button</option>
                                                    <option value="CHECK">Checkbox</option>
                                                </select>

                                            </div>
                                        </div>


                                        {(this.state.choice === "TEXT" && this.state.ans != null && this.state.style != null) ? (
                                            <div>

                                                <div>
                                                    <div>
                                                        <h4>Question:</h4>
                                                        <input type="text" style={{width: "80%"}}
                                                               value={this.state.question} onChange={(event) => {
                                                            this.setState({question: event.target.value});
                                                        }}/>

                                                    </div>
                                                </div>

                                                <br/>

                                                <div>
                                                    <div>
                                                        <h4>Options (Give comma separated):</h4>

                                                        <input type="text" style={{width: "80%"}}
                                                               value={this.state.options} onChange={(event) => {
                                                            this.setState({options: event.target.value});
                                                        }}/>

                                                    </div>
                                                </div>


                                                <div>
                                                    <div>

                                                        <input type="button" className="btn btn-primary"
                                                               onClick={() => this.addQuestion(this.state.question, this.state.options)}
                                                               value="Add Question"/>
                                                    </div>
                                                </div>

                                            </div>
                                        ) : this.state.choice === "IMAGE" && this.state.ans != null && this.state.style != null ? (
                                                <div>
                                                    IMAGE OPTIONS
                                                    <div>
                                                        <div>
                                                            <h4>Question</h4>

                                                            <input type="text" style={{width: "80%"}}
                                                                   value={this.state.question} onChange={(event) => {
                                                                this.setState({question: event.target.value});
                                                            }}/>

                                                        </div>
                                                    </div>

                                                    <div>
                                                        <div>
                                                            <h4>Options (Give images )</h4>

                                                            <input type="text" style={{width: "80%"}}
                                                                   value={this.state.options} onChange={(event) => {
                                                                this.setState({options: event.target.value});
                                                            }}/>
                                                        </div>
                                                    </div>


                                                    <div>
                                                        <div>
                                                            <input type="button" className="btn btn-primary"
                                                                   onClick={() => this.addQuestion(this.state.question, this.state.options)}
                                                                   value="Add Question"/>
                                                        </div>
                                                    </div>

                                                </div>
                                            ) :
                                            (
                                                <div>


                                                    <div>
                                                        <div>
                                                            <h4>Question</h4>

                                                            <input type="text" style={{width: "80%"}}
                                                                   value={this.state.question} onChange={(event) => {
                                                                this.setState({question: event.target.value});
                                                            }}/>

                                                        </div>

                                                    </div>

                                                    <br/>


                                                    <div>
                                                        <div>
                                                            <h4>Options (Give images )</h4>

                                                            <input type="text" style={{width: "80%"}}
                                                                   value={this.state.options} onChange={(event) => {
                                                                this.setState({options: event.target.value});
                                                            }}/>

                                                        </div>
                                                    </div>


                                                    <div>
                                                        <div>

                                                            <input type="button" className="btn btn-primary"
                                                                   onClick={() => this.addQuestion(this.state.question, this.state.options)}
                                                                   value="Add Question"/>

                                                        </div>
                                                    </div>


                                                </div>
                                            )}
                                        <br/>
                                    </div>
                                ) : this.state.type === "YN" ? (
                                    <div>

                                        <div>
                                            <div>
                                                <h4>Question</h4>
                                                <input type="text" style={{width: "80%"}} value={this.state.question}
                                                       onChange={(event) => {
                                                           this.setState({question: event.target.value});
                                                       }}/>
                                            </div>
                                        </div>


                                        <br/>

                                        <div>
                                            <div>
                                                <input type="button" className="btn btn-primary"
                                                       onClick={() => this.addQuestion(this.state.question, "Yes,No")}
                                                       value="Add Yes/No Question"/>

                                            </div>
                                        </div>

                                    </div>
                                ) : this.state.type === "SHORT" ? (
                                    <div>


                                        <div>
                                            <div>
                                                <h4>Question:</h4>
                                                <input type="text" style={{width: "80%"}} value={this.state.question}
                                                       onChange={(event) => {
                                                           this.setState({question: event.target.value});
                                                       }}/>
                                            </div>
                                        </div>


                                        <br/>

                                        <div>
                                            <div>
                                                <input type="button" className="btn btn-primary"
                                                       onClick={() => this.addQuestion(this.state.question)}
                                                       value="Add Short Answer Question"/>
                                            </div>
                                        </div>


                                    </div>
                                ) : this.state.type === "DATE" ? (
                                    <div>

                                        <div>
                                            <div>
                                                <h4>Question:</h4>
                                                <input type="text" style={{width: "80%"}} value={this.state.question}
                                                       onChange={(event) => {
                                                           this.setState({question: event.target.value});
                                                       }}/>
                                            </div>
                                        </div>

                                        <br/>

                                        <div>
                                            <div>
                                                <input type="button" className="btn btn-primary"
                                                       onClick={() => this.addQuestion(this.state.question)}
                                                       value="Add DateTime Question"/>
                                            </div>
                                        </div>


                                    </div>
                                ) : this.state.type === "STAR" ? (
                                    <div>


                                        <div>
                                            <div>
                                                <h4>Question</h4>
                                                <input type="text" style={{width: "80%"}} value={this.state.question}
                                                       onChange={(event) => {
                                                           this.setState({question: event.target.value});
                                                       }}/>
                                            </div>
                                        </div>

                                        <br/>

                                        <div>
                                            <div>
                                                <input type="button" className="btn btn-primary"
                                                       onClick={() => this.addQuestion(this.state.question, "0,1,2,3,4,5")}
                                                       value="Add Star Rating Question"/>
                                            </div>
                                        </div>


                                    </div>
                                ) : (<div></div>)
                                }
                            </div>
                        </div>
                        <div style={{marginLeft: "45%"}}>
                            <br/>
                            <h3>Questions Added</h3>
                            <br/>
                            <ul>
                                {this.state.questions.map((item) => {
                                    return <div>
                                        <li style={{listStyleType: "none", width: "80%"}}
                                            key={item.id}>Q: {item.questionText}
                                            <ul>
                                                {item.optionList.map((option) => {
                                                    return <li style={{listStyleType: "none", width: "60%"}}
                                                               key={option}><input type="radio"
                                                                                   value={option}/><label>{option}</label>
                                                    </li>
                                                })}
                                            </ul>
                                        </li>
                                        <input type="button" className="btn btn-primary" onClick={() => {
                                            this.deleteQuestion(item.id)
                                        }} value="Delete Question"/>
                                    </div>
                                })}
                            </ul>
                        </div>
                        <div>
                            <input type="button" className="btn btn-primary" value="Save and Publish"
                                   style={{margin: "100px 200px 100px 500px"}} onClick={() => {
                                this.createS({
                                    type: this.state.formType,
                                    questions: this.state.questions,
                                    name: this.state.surveyName,
                                    publish: true
                                });
                                this.setState({
                                    questions: [],
                                    type: null,
                                    choice: null,
                                    ans: null,
                                    style: null,
                                    question: "",
                                    options: ""
                                })
                            }}/>

                            <input type="button" className="btn btn-primary" style={{marginLeft: "15%"}} value="Save"
                                   onClick={() => {
                                       this.createS({
                                           type: this.state.formType,
                                           questions: this.state.questions,
                                           name: this.state.surveyName,
                                           publish: false
                                       });
                                       this.setState({
                                           questions: [],
                                           type: null,
                                           choice: null,
                                           ans: null,
                                           style: null,
                                           question: "",
                                           options: ""
                                       })
                                   }}/>
                        </div>


                    </form>
                </div>
            </div>
        );
    }
}


export default Form1;
