package com.surveyApe.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class QuestionResponse {

        @Id
        @GeneratedValue(generator = "system-uuid")
        @GenericGenerator(name = "system-uuid",
                strategy = "uuid")
        private String questionResponseId;

        //TODO: yet to decide cardinality for this
        private String questionId;
        private String optionId;        //  can be used to store option id or answer text in case of text box
        private String surveyResponseId;

        public String getQuestionResponseId() {
                return questionResponseId;
        }

        public void setQuestionResponseId(String questionResponseId) {
                this.questionResponseId = questionResponseId;
        }

        public String getQuestionId() {
                return questionId;
        }

        public void setQuestionId(String questionId) {
                this.questionId = questionId;
        }

        public String getOptionId() {
                return optionId;
        }

        public void setOptionId(String optionId) {
                this.optionId = optionId;
        }

        public String getSurveyResponseId() {
                return surveyResponseId;
        }

        public void setSurveyResponseId(String surveyResponseId) {
                this.surveyResponseId = surveyResponseId;
        }
}
