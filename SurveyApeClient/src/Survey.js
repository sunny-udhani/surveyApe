import React, {Component} from 'react';

import './Survey.css';

class Survey extends Component {

state={
  "questionList": [
        {
            "surveyQuestionId": "1",
            "questionText": "what is your favourite fruit ?",
            "questionType": 3,
            "questionOrderNumber": 1,
            "questionOptionList": [
              {
                "option_order_number": 1,
                "option_text": "Orange"
              },
              {
                "option_order_number": 2,
                "option_text": "Mango"
              },
              {
                "option_order_number": 3,
                "option_text": "Banana"
              },
              {
                "option_order_number": 4,
                "option_text": "Pineapple"
              }
            ],
            "questionResponseList": []
        },
        {
            "surveyQuestionId": "2",
            "questionText": "what is your favourite Animal ?",
            "questionType": 1,
            "questionOrderNumber": 1,
            "questionOptionList": [
              {
                "option_order_number": 1,
                "option_text": "Dog"
              },
              {
                "option_order_number": 2,
                "option_text": "Cat"
              },
              {
                "option_order_number": 3,
                "option_text": "Horse"
              },
              {
                "option_order_number": 4,
                "option_text": "Shivanku"
              }
            ],
            "questionResponseList": []
        },
        {
            "surveyQuestionId": "1",
            "questionText": "what is your Gender ?",
            "questionType": 2,
            "questionOrderNumber": 1,
            "questionOptionList": [
              {
                "option_order_number": 1,
                "option_text": "Male"
              },
              {
                "option_order_number": 2,
                "option_text": "Female"
              },
              {
                "option_order_number": 3,
                "option_text": "Chakka"
              }
            ],
            "questionResponseList": []
        },
        {
            "surveyQuestionId": "1",
            "questionText": "what is your favourite fruit ?",
            "questionType": 4,
            "questionOrderNumber": 1,
            "questionOptionList": [
              {
                "option_order_number": 1,
                "option_text": "Orange"
              },
              {
                "option_order_number": 2,
                "option_text": "Mango"
              },
              {
                "option_order_number": 3,
                "option_text": "Banana"
              },
              {
                "option_order_number": 4,
                "option_text": "Pineapple"
              }
            ],
            "questionResponseList": []
        },
        {
            "surveyQuestionId": "1",
            "questionText": "what is your favourite fruit ?",
            "questionType": 5,
            "questionOrderNumber": 1,
            "questionOptionList": [

            ],
            "questionResponseList": []
        },
        {
            "surveyQuestionId": "1",
            "questionText": "what is your Date of Birth ?",
            "questionType": 6,
            "questionOrderNumber": 1,
            "questionOptionList": [

            ],
            "questionResponseList": []
        }

    ]
}






renderOptions (question) {

  if(question.questionType === 1){
      return (

            <div className="question">
              <h3>{question.questionText}</h3>
              <select>
              {question.questionOptionList.map(option => (

                  <option value={option.option_text}>{option.option_text}</option>


              ))}
              </select>
            </div>

      );
    }

else if(question.questionType === 2){
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

  else if(question.questionType === 3){
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

    else if(question.questionType === 4){
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

      else if(question.questionType === 5){
          return (

                <div className="question">
                  <h3>{question.questionText}</h3>

                  <input type="text" name={question.surveyQuestionId} />
                  <button className="btn btn-primary" style={{marginLeft: 10}}>Save</button>
                </div>

          );
        }

        else if(question.questionType === 6){
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

                  {question.questionOptionList.map(option => (
                    <div>
                      <input type="checkbox" name={question.surveyQuestionId} /> {option.option_text}
                    </div>
                  ))}
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

export default Survey;
