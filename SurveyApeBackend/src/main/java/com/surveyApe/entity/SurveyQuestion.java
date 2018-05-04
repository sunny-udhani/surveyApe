package com.surveyApe.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import org.hibernate.annotations.GenericGenerator;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
public class SurveyQuestion {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid",
            strategy = "uuid")
    private String surveyQuestionId;
    private String questionText;
    private int questionType; //numbers would be better to play around with...
    @Column(nullable = true)
    private int questionOrderNumber;
    @JsonIgnore
    @ManyToOne
    @JoinColumn(name = "SURVEY_ID")
    private Survey surveyId;


    @OneToMany(mappedBy = "questionId", cascade = CascadeType.REMOVE, fetch = FetchType.EAGER)
    private List<QuestionOption> questionOptionList=new ArrayList<QuestionOption>();

    @OneToMany(mappedBy = "questionId", cascade = CascadeType.REMOVE, fetch = FetchType.LAZY)
    private List<QuestionResponse> questionResponseList;

    public List<QuestionOption> getQuestionOptionList() {
        return questionOptionList;
    }

    public void setQuestionOptionList(List<QuestionOption> questionOptionList) {
        this.questionOptionList = questionOptionList;
    }

    public List<QuestionResponse> getQuestionResponseList() {
        return questionResponseList;
    }

    public void setQuestionResponseList(List<QuestionResponse> questionResponseList) {
        this.questionResponseList =questionResponseList;
    }

    public String getSurveyQuestionId() {
        return surveyQuestionId;
    }

    public void setSurveyQuestionId(String surveyQuestionId) {
        this.surveyQuestionId = surveyQuestionId;
    }

    public Survey getSurveyId() {
        return surveyId;
    }

    public void setSurveyId(Survey surveyId) {
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

    @Override
    public boolean equals(Object o) {
        if (this == o) return true;
        if (!(o instanceof SurveyQuestion)) return false;
        return surveyQuestionId != null && surveyQuestionId.equals(((SurveyQuestion) o).surveyQuestionId);
    }

    public SurveyQuestion(String qTx, int qTy) {
        this.setQuestionText(qTx);
        this.setQuestionType(qTy);
    }

    public SurveyQuestion() {

    }

}
