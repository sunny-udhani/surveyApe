package com.surveyApe.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;
import java.util.Date;
import java.util.List;

@Entity
public class Survey {
    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid",
            strategy = "uuid")
    private String surveyId;

    @ManyToOne
    @JoinColumn(name = "EMAIL_ID")
    private User surveyorEmail;
    private int surveyType; //numbers would be better to play around with...
    private String surveyURI;
    private String surveyTitle;
    private double surveyQRNumber;
    private Date startDate;
    private Date endDate;
    private boolean publishedInd;

    @OneToMany(mappedBy = "surveyId")
    private List<SurveyQuestion> questionList;

    @OneToMany(mappedBy = "surveyId")
    private List<SurveyResponse> responseList;

    public List<SurveyQuestion> getQuestionList() {
        return questionList;
    }

    public void setQuestionList(List<SurveyQuestion> questionList) {
        this.questionList = questionList;
    }

    public List<SurveyResponse> getResponseList() {
        return responseList;
    }

    public void setResponseList(List<SurveyResponse> responseList) {
        this.responseList = responseList;
    }

    public String getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(String surveyId) {
        this.surveyId = surveyId;
    }

    public User getSurveyorEmail() {
        return surveyorEmail;
    }

    public void setSurveyorEmail(User surveyorEmail) {
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

    public String getSurveyTitle() {
        return surveyTitle;
    }

    public void setSurveyTitle(String surveyTitle) {
        this.surveyTitle = surveyTitle;
    }
}
