package com.surveyApe.service;


import com.surveyApe.entity.QuestionResponse;
import com.surveyApe.entity.Survey;
import com.surveyApe.entity.SurveyQuestion;
import com.surveyApe.entity.SurveyResponse;
import com.surveyApe.repository.QuestionResponseRepository;
import com.surveyApe.repository.SurveyQuestionRepository;
import com.surveyApe.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;

@Service
public class QuestionService {

    @Autowired
    private SurveyQuestionRepository surveyQuestionRepository;
    @Autowired
    private QuestionResponseRepository questionResponseRepository;

    public void addQuestion(SurveyQuestion question) {
        surveyQuestionRepository.save(question);
    }

    public SurveyQuestion getQuestionById(String id) {
        return surveyQuestionRepository.findBySurveyQuestionIdEquals(id).orElse(null);

    }

    public void deleteQuestion(SurveyQuestion question) {
         surveyQuestionRepository.delete(question);

    }

    public String createResponse(SurveyResponse responseId, String response, SurveyQuestion questionId)

    {

        QuestionResponse q = new QuestionResponse();
        q.setSurveyResponseId(responseId);
        q.setQuestionId(questionId);
        q.setResponse(response);
        questionResponseRepository.save(q);


        //
        return "";


    }

    public SurveyQuestion getSurveyQuestion(String id) {
        System.out.println(id);
        Optional<SurveyQuestion> s = surveyQuestionRepository.findById(id);

        return s.get();
    }

}
