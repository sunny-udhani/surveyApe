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

    public void addQuestion(SurveyQuestion question){
        surveyQuestionRepository.save(question);
    }
}
