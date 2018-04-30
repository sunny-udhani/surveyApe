package com.surveyApe.service;

import com.surveyApe.entity.QuestionOption;
import com.surveyApe.entity.Survey;
import com.surveyApe.repository.QuestionOptionRepository;
import com.surveyApe.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionOptionService {

    @Autowired
    private QuestionOptionRepository questionOptionRepository;


    public void saveOption(QuestionOption questionOption) {
        questionOptionRepository.save(questionOption);
    }
}