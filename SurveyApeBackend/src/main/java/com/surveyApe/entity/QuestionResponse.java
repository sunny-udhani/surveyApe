package com.surveyApe.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
public class QuestionResponse {

        @Id
        @GeneratedValue(generator = "system-uuid")
        @GenericGenerator(name = "system-uuid",
                strategy = "uuid")
        private String questionResponseId;

        //TODO: yet to decide cardinality for this

        @ManyToOne
        @JoinColumn(name = "QUESTION_ID")
        private SurveyQuestion questionId;
        private String response;        //  can be used to store option id or answer text in case of text box
        @ManyToOne
        @JoinColumn(name = "SURVEY_RESPONSE_ID")
        private SurveyResponse surveyResponseId;

        public String getQuestionResponseId() {
                return questionResponseId;
        }

        public void setQuestionResponseId(String questionResponseId) {
                this.questionResponseId = questionResponseId;
        }

        public SurveyQuestion getQuestionId() {
                return questionId;
        }

        public void setQuestionId(SurveyQuestion questionId) {
                this.questionId = questionId;
        }

        public String getResponse() {
                return response;
        }

        public void setResponse(String response) {
                this.response = response;
        }

        public SurveyResponse getSurveyResponseId() {
                return surveyResponseId;
        }

        public void setSurveyResponseId(SurveyResponse surveyResponseId) {
                this.surveyResponseId = surveyResponseId;
        }
}
