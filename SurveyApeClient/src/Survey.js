import React, {Component} from 'react';
import {withRouter} from 'react-router';
import StarRatingComponent from 'react-star-rating-component';

import './Survey.css';
import * as API from './api/API';

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
  API.getSurvey1()
            .then((res) => {

                    console.log(res);
                    
                    this.setState({
                      questionList: res.questionList,
                      responseList: res.responseList
                    })

            });
}

onStarClick(nextValue, prevValue, name) {
    this.setState({rating: nextValue});
  }


renderOptions (question) {

  if(question.questionType === 1){  {/* Dropdown */}
      return (

            <div className="question">
              <h3>{question.questionText}</h3>
              <select>
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
            <h3>{question.questionText}</h3>

            {question.questionOptionList.map(option => (
              <div>
                <input type="radio" name="gender" value={option.option_text} /> {option.option_text}<br />
              </div>
            ))}
          </div>

    );
  }

  else if(question.questionType === 3){  {/*  CheckBox */}
      return (

            <div className="question">
              <h3>{question.questionText}</h3>

              {question.questionOptionList.map(option => (
                <div>
                  <input type="checkbox" name={question.surveyQuestionId} /> {option.option_text}
                </div>
              ))}
            </div>

      );
    }

    else if(question.questionType === 4){    {/*  Yes/NO  */}
        return (

              <div className="question">
                <h3>{question.questionText}</h3>

                {question.questionOptionList.map(option => (
                  <div>
                    <input type="radio" name="gender" value={option.optionText} /> {option.optionText}<br />
                  </div>
                ))}
              </div>

        );
      }

      else if(question.questionType === 5){ {/* Text */}
          return (

                <div className="question">
                  <h3>{question.questionText}</h3>

                  <input type="text" name={question.surveyQuestionId} />
                  <button className="btn btn-primary" style={{marginLeft: 10}}>Save</button>
                </div>

          );
        }

        else if(question.questionType === 6){  {/* Date */}
            return (

                  <div className="question">
                    <h3>{question.questionText}</h3>


                      <div>
                        <input type="date" name={question.surveyQuestionId} />
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
          <div className="mainPageSurvey">
            {this.state.questionList.map(question => (

                this.renderOptions(question)

            ))}
          </div>
    );

}

}

export default withRouter(Survey);
