package com.surveyApe.config;

public enum SurveyTypeEnum {
    GENERAL(1),  //calls constructor with value 3
    OPEN(2),  //calls constructor with value 2
    CLOSED(3),   //calls constructor with value 1
    OTHER(4); //

    private final int enumCode;

    SurveyTypeEnum(int enumCode) {
        this.enumCode = enumCode;
    }

    public int getEnumCode() {
        return this.enumCode;
    }
}
