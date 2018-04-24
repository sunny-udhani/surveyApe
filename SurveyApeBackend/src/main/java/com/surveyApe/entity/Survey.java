package com.surveyApe.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.annotation.Generated;
import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;
import java.util.Date;

@Entity
public class Survey {
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid",
            strategy = "uuid")
    private String surveyId;
    private String surveyorEmail;
    private int surveyType; //numbers would be better to play around with...
    private String surveyURI;
    private double surveyQRNumber;
    private Date startDate;
    private Date endDate;
    private boolean publishedInd;

    public String getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(String surveyId) {
        this.surveyId = surveyId;
    }

    public String getSurveyorEmail() {
        return surveyorEmail;
    }

    public void setSurveyorEmail(String surveyorEmail) {
        this.surveyorEmail = surveyorEmail;
    }

    public int getSurveyType() {
        return surveyType;
    }

    public void setSurveyType(int surveyType) {
        this.surveyType = surveyType;
    }

    public String getSurveyURI() {
        return surveyURI;
    }

    public void setSurveyURI(String surveyURI) {
        this.surveyURI = surveyURI;
    }

    public double getSurveyQRNumber() {
        return surveyQRNumber;
    }

    public void setSurveyQRNumber(double surveyQRNumber) {
        this.surveyQRNumber = surveyQRNumber;
    }

    public Date getStartDate() {
        return startDate;
    }

    public void setStartDate(Date startDate) {
        this.startDate = startDate;
    }

    public Date getEndDate() {
        return endDate;
    }

    public void setEndDate(Date endDate) {
        this.endDate = endDate;
    }

    public boolean isPublishedInd() {
        return publishedInd;
    }

    public void setPublishedInd(boolean publishedInd) {
        this.publishedInd = publishedInd;
    }
}
