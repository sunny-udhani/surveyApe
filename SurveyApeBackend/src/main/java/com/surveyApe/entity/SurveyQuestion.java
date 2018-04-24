package com.surveyApe.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class SurveyQuestion {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid",
            strategy = "uuid")
    private String surveyQuestionId;
    private String surveyId;
    private String questionText;
    private int questionType; //numbers would be better to play around with...
    private int questionOrderNumber;

    public String getSurveyQuestionId() {
        return surveyQuestionId;
    }

    public void setSurveyQuestionId(String surveyQuestionId) {
        this.surveyQuestionId = surveyQuestionId;
    }

    public String getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(String surveyId) {
        this.surveyId = surveyId;
    }

    public String getQuestionText() {
        return questionText;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public int getQuestionType() {
        return questionType;
    }

    public void setQuestionType(int questionType) {
        this.questionType = questionType;
    }

    public int getQuestionOrderNumber() {
        return questionOrderNumber;
    }

    public void setQuestionOrderNumber(int questionOrderNumber) {
        this.questionOrderNumber = questionOrderNumber;
    }
}
