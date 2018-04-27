package com.surveyApe.service;

import com.surveyApe.config.QuestionTypeEnum;
import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.QuestionOption;
import com.surveyApe.entity.Survey;
import com.surveyApe.entity.SurveyQuestion;
import com.surveyApe.repository.QuestionOptionRepository;
import com.surveyApe.repository.SurveyQuestionRepository;
import com.surveyApe.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionService {
    @Autowired
    public SurveyQuestionRepository surveyQuestionRepository;
    @Autowired
    public QuestionOptionRepository questionOptionRepository;
    @Autowired
    public SurveyRepository surveyRepository;

    public int createNewQuestionWithOptions(String surveyId, String questionText, int questionType, String optionList) {
        Survey survey = surveyRepository.findBySurveyIdEquals(surveyId).orElse(null);
        if (survey == null) {
            return 403;
        }

        SurveyQuestion question = new SurveyQuestion(questionText, questionType);

        boolean successFlag = createOptions(optionList, question);

        addQuestionToSurveyEntity(question, survey);

        surveyQuestionRepository.save(question);
        surveyRepository.save(survey);
        return 200;
    }

    public void addQuestionToSurveyEntity(SurveyQuestion question, Survey survey) {
        survey.getQuestionList().add(question);
        question.setSurveyId(survey);
    }

    public void addOptionToQuestionEntity(QuestionOption option, SurveyQuestion question) {
        question.getQuestionOptionList().add(option);
        option.setQuestionId(question);
    }

    public void removeQuestionFromSurveyEntity(SurveyQuestion question, Survey survey) {
        survey.getQuestionList().remove(question);
        question.setSurveyId(null);
    }

    public boolean createOptions(String optionList, SurveyQuestion question) {

        for (String options : optionList.split(",")) {
            QuestionOption option = new QuestionOption(options);
            addOptionToQuestionEntity(option, question);
            questionOptionRepository.save(option);
        }

        return true;
    }

    public boolean validQuestionType(int questionType) {

        for (QuestionTypeEnum e : QuestionTypeEnum.values()) {
            if (e.getEnumCode() == questionType)
                return true;
        }
        return false;
    }

}
