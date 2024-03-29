package com.surveyApe.entity;

import com.fasterxml.jackson.annotation.JsonBackReference;
import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonManagedReference;
import org.hibernate.annotations.GenericGenerator;

import javax.persistence.*;

@Entity
public class QuestionOption {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid",
                      strategy = "uuid")
    private String questionOptionId;

    @ManyToOne(cascade = CascadeType.ALL)
    @JsonBackReference
    @JoinColumn(name = "QUESTION_ID")
    private SurveyQuestion questionId;

    private String optionText;
    private int optionType; //numbers would be better to play around with...
    private int optionOrderNumber;

    public String getQuestionOptionId() {
        return questionOptionId;
    }

    public void setQuestionOptionId(String questionOptionId) {
        this.questionOptionId = questionOptionId;
    }

//    @JsonIgnore
    public SurveyQuestion getQuestionId() {
        return questionId;
    }

    public void setQuestionId(SurveyQuestion questionId) {
        this.questionId = questionId;
    }

    public String getOptionText() {
        return optionText;
    }

    public void setOptionText(String optionText) {
        this.optionText = optionText;
    }

    public int getOptionType() {
        return optionType;
    }

    public void setOptionType(int optionType) {
        this.optionType = optionType;
    }

    public int getOptionOrderNumber() {
        return optionOrderNumber;
    }

    public void setOptionOrderNumber(int optionOrderNumber) {
        this.optionOrderNumber = optionOrderNumber;
    }

    public QuestionOption(String optionText){
        this.setOptionText(optionText);
    }
    public QuestionOption(){
//        this.setOptionText(optionText);
    }
}
