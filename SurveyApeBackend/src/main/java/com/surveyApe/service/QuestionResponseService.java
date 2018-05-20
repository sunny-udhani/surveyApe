package com.surveyApe.service;

import com.surveyApe.entity.QuestionResponse;
import com.surveyApe.repository.QuestionOptionRepository;
import com.surveyApe.repository.QuestionResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class QuestionResponseService {

    @Autowired
    private QuestionResponseRepository questionResponseRepository;

    public String saveResponse(QuestionResponse questionResponse) {
        questionResponseRepository.save(questionResponse);
        return questionResponse.getQuestionResponseId();
    }

}
