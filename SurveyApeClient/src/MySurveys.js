import React, {Component} from 'react';
import * as API from './api/API';
import './MySurvey.css';
import Logo from './logo.png';

class MySurveys extends Component {
    constructor(props) {
        super(props);
        this.state = {
            inviteMore: ""
        }

        this.filename = "";
        API.getMySurveys()
            .then((res) => {
                console.log('AAAAAAA');
                console.log(res);
                this.setState({surveysArr: res.surveys});
                console.log(this.state.surveysArr);
            });
    }

    componentWillMount() {

    }

    exportAsJson(surveyId) {

        console.log(surveyId);
        console.log(this.filename);
        let payload = {"surveyId": surveyId, "filename": this.filename};
        API.exportAsJSON(payload).then(res => {
            console.info(res);
            res.json().then(data => {
                console.log(data);
                var sampleArr = this.base64ToArrayBuffer(data.byteArray);
                this.saveByteArray(this.filename, sampleArr);
            })
        })

    }
     base64ToArrayBuffer (base64) {
        var binaryString = window.atob(base64);
        var binaryLen = binaryString.length;
        var bytes = new Uint8Array(binaryLen);
        for (var i = 0; i < binaryLen; i++) {
            var ascii = binaryString.charCodeAt(i);
            bytes[i] = ascii;
        }
        return bytes;
    }

     saveByteArray(reportName, byte) {
        var blob = new Blob([byte]);
        var link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        var fileName = reportName + ".json";
        link.download = fileName;
        link.click();
    };

    giveStrSurveyType(id) {
        if (id === 1) {
            return "General";
        }
        else if (id === 2) {
            return "Open";
        }
        else if (id === 3) {
            return "Closed";
        }
        else if (id === 4) {
            return "Odiver";
        }
    }

    render() {
        return (
            <div>

                <div className="row bar">
                    <div className="col-lg-1 logo">
                        <img src={Logo}/>
                    </div>
                    <div className="col-lg-3 textLogo">
                        Survey Ape
                    </div>
                    <div className="col-lg-4">

                    </div>

                </div>

                <br/>

                {this.state.surveysArr ? (<div>
                    <div>

                        {this.state.surveysArr.map((item) => {
                            return (
                                <div style={{
                                    width: "100%",
                                    paddingLeft: 15,
                                    border: "1px solid black",
                                    marginTop: 20,
                                    borderRadius: 5
                                }}>

                                    <div className="row" style={{marginTop: 10, fontSize: 22, fontWeight: 700}}>

                                        <div className="col-lg-4"><label>Survey Name: &nbsp;</label>{item.surveyTitle}
                                        </div>

                                        <div className="col-lg-4"><label>Survey
                                            Type: &nbsp;</label>{this.giveStrSurveyType(item.surveyType)}</div>
                                    </div>

                                    <div className="row" style={{marginTop: 10, fontSize: 18, fontWeight: 500}}>
                                        <div className="col-lg-4"><input type="button" className="butt2"
                                                                         value="Edit Survey"
                                                                         onClick={() => this.props.EditSurvey(item.surveyId)}/>
                                        </div>

                                        <div className="col-lg-4">{item.publishedInd == 0 ? (
                                            <div><input type="button" className="butt2" value="Publish"
                                                        onClick={() => this.props.PublishSurvey(item.surveyId)}/>
                                            </div>) : (<div>Already Published</div>)}</div>

                                        <div className="col-lg-4">{item.publishedInd == 1 ? (
                                            <div style={{paddingLeft: 117}}><input type="button" className="butt2"
                                                                                   value="End Survey"
                                                                                   onClick={() => this.props.EndSurvey(item.surveyId)}/>
                                            </div>) : (<div>Survey Inactive</div>)}</div>
                                    </div>

                                    <div className="row"
                                         style={{marginTop: 10, marginBottom: 20, fontSize: 18, fontWeight: 500}}>

                                        <div className="col-lg-6"><input type="button" style={{width: 160}}
                                                                         className="butt2" value="Get Survey Stats"
                                                                         onClick={() => this.props.GetSurveyStats(item.surveyId)}/>
                                        </div>

                                        <div className="col-lg-6"><label>Invite people: &nbsp;</label> <input
                                            type="text" onFocus={(event) => {
                                            event.target.value = this.state.inviteMore
                                        }} onChange={(event) => this.setState({inviteMore: event.target.value})}/>
                                            <input type="button" className="butt2" value="Send Invite"
                                                   style={{marginLeft: 10}} onClick={() => {
                                                this.props.AddInvitees(item.surveyId, this.state.inviteMore);
                                                this.setState({inviteMore: ""});
                                            }}/>
                                        </div>
                                    </div>

                                    <div className="row"
                                         style={{marginTop: 10, marginBottom: 20, fontSize: 18, fontWeight: 500}}>


                                        <div className="col-lg-6"><label>Export as JSON File&nbsp;</label>
                                            <input type="button" style={{width: 120}} onClick={(event) => this.exportAsJson(item.surveyId)}/>
                                            <div className="col-lg-6"><label>Filename &nbsp;</label> <input
                                                type="text" onChange={(event) => this.filename = event.target.value}/>
                                            </div>

                                        </div>
                                    </div>

                                </div>)

                        })}
                    </div>

                </div>) : (
                    <div>

                    </div>
                )}
            </div>
        );
    }
}

export default MySurveys;
