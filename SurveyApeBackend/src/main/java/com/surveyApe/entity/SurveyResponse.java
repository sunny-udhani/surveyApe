package com.surveyApe.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.List;

public class SurveyResponse {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid",
            strategy = "uuid")
    private String surveyResponseId;

    @ManyToOne
    @JoinColumn(name = "SURVEY_ID")
    private Survey surveyId;
    private String userEmail; //not a foreign key as per case 3
    private String surveyURI;
    private boolean completeInd;
    private boolean surveyURIValidInd; //case 3

    @OneToMany(mappedBy = "surveyResponseId")
    private List<QuestionResponse> questionResponseList;

    public List<QuestionResponse> getQuestionResponseList() {
        return questionResponseList;
    }

    public void setQuestionResponseList(List<QuestionResponse> questionResponseList) {
        this.questionResponseList = questionResponseList;
    }

    public String getSurveyResponseId() {
        return surveyResponseId;
    }

    public void setSurveyResponseId(String surveyResponseId) {
        this.surveyResponseId = surveyResponseId;
    }

    public Survey getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Survey surveyId) {
        this.surveyId = surveyId;
    }

    public String getUserEmail() {
        return userEmail;
    }

    public void setUserEmail(String userEmail) {
        this.userEmail = userEmail;
    }

    public String getSurveyURI() {
        return surveyURI;
    }

    public void setSurveyURI(String surveyURI) {
        this.surveyURI = surveyURI;
    }

    public boolean isCompleteInd() {
        return completeInd;
    }

    public void setCompleteInd(boolean completeInd) {
        this.completeInd = completeInd;
    }

    public boolean isSurveyURIValidInd() {
        return surveyURIValidInd;
    }

    public void setSurveyURIValidInd(boolean surveyURIValidInd) {
        this.surveyURIValidInd = surveyURIValidInd;
    }
}
