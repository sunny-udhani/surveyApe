package com.surveyApe.config;

public enum QuestionTypeEnum {
    DropDown(1),
    Radio(2),
    CheckBox(3),
    YesNo(4),
    Text(5),
    DateTime(6),
    Rating(7),
    Images(8);

    private final int enumCode;

    QuestionTypeEnum(int enumCode) {
        this.enumCode = enumCode;
    }

    public int getEnumCode() {
        return this.enumCode;
    }
}
