package com.surveyApe.entity;

import org.hibernate.annotations.GenericGenerator;

import javax.persistence.Entity;
import javax.persistence.GeneratedValue;
import javax.persistence.Id;

@Entity
public class QuestionOption {

    @Id
    @GeneratedValue(generator = "system-uuid")
    @GenericGenerator(name = "system-uuid",
                      strategy = "uuid")
    private String questionOptionId;
    private String questionId;
    private String optionText;
    private int optionType; //numbers would be better to play around with...
    private int optionOrderNumber;

    public String getQuestionOptionId() {
        return questionOptionId;
    }

    public void setQuestionOptionId(String questionOptionId) {
        this.questionOptionId = questionOptionId;
    }

    public String getQuestionId() {
        return questionId;
    }

    public void setQuestionId(String questionId) {
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
}
