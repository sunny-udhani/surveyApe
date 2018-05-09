package com.surveyApe.service;


import com.surveyApe.entity.Survey;
import com.surveyApe.entity.SurveyResponse;
import com.surveyApe.entity.User;
import com.surveyApe.repository.SurveyRepository;
import com.surveyApe.repository.SurveyResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class SurveyResponseService {

    @Autowired
    private SurveyRepository surveyRepository;

    @Autowired
    private SurveyResponseRepository surveyResponseRepository;


    public void saveResponseEntity(SurveyResponse response) {
        surveyResponseRepository.save(response);
    }

    public SurveyResponse findAttendee(String survey_id, String attendee_email) {
        return surveyResponseRepository.findBySurveyIdEqualsAndUserEmailEquals(survey_id, attendee_email).orElse(null);
    }

    public void deleteAttendee(SurveyResponse response) {
        surveyResponseRepository.delete(response);
    }

    public String surveyResponse(Survey surveyID , String userEmail,String surveyURI,boolean completeInd,boolean uriind) {

        SurveyResponse s = new SurveyResponse();

        s.setCompleteInd(completeInd);
        s.setSurveyURI(surveyURI);
        s.setUserEmail(userEmail);
        s.setSurveyURIValidInd(uriind);
        s.setSurveyId(surveyID);
        SurveyResponse sr = surveyResponseRepository.save(s);

        return sr.getSurveyResponseId();
    }

    public Survey getSurvey(String id)
    {
        Optional<Survey> s = surveyRepository.findById(id);

        return s.get();
    }

    public String getResponse(String id)
    {

        Optional<SurveyResponse> st = surveyResponseRepository.findById(id);

        SurveyResponse s = st.get();
        String response = s.getSurveyResponseId();

        return response;
    }

    public SurveyResponse getSurveyResponse(String id)
    {
        Optional<SurveyResponse> t = surveyResponseRepository.findById(id);

        return t.get();
    }

}
