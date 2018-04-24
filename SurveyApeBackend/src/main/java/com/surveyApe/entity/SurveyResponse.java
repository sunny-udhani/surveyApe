package com.surveyApe.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.GeneratedValue;
import javax.persistence.Id;

public class SurveyResponse {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid",
            strategy = "uuid")
    private String surveyResponseId;
    private String surveyId;
    private String userEmail; //not a foreign key as per case 3
    private String surveyURI;
    private boolean completeInd;
    private boolean surveyURIValidInd; //case 3

    public String getSurveyResponseId() {
        return surveyResponseId;
    }

    public void setSurveyResponseId(String surveyResponseId) {
        this.surveyResponseId = surveyResponseId;
    }

    public String getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(String surveyId) {
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
