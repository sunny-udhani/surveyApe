package com.surveyApe.service;

import com.surveyApe.entity.SurveyQuestion;
import com.surveyApe.entity.SurveyResponse;
import com.surveyApe.repository.QuestionOptionRepository;
import com.surveyApe.repository.SurveyQuestionRepository;
import com.surveyApe.repository.SurveyRepository;
import com.surveyApe.repository.SurveyResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyResponseService {
    @Autowired
    public SurveyResponseRepository surveyResponseRepository;

    public void saveResponseEntity(SurveyResponse response) {
        surveyResponseRepository.save(response);
    }

    public SurveyResponse findAttendee(String survey_id, String attendee_email) {
        return surveyResponseRepository.findBySurveyIdEqualsAndUserEmailEquals(survey_id, attendee_email).orElse(null);
    }

    public void deleteAttendee(SurveyResponse response) {
        surveyResponseRepository.delete(response);
    }
}
