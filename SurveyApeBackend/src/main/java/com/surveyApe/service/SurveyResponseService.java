package com.surveyApe.service;


import com.surveyApe.entity.Survey;
import com.surveyApe.entity.SurveyResponse;
import com.surveyApe.entity.User;
import com.surveyApe.repository.SurveyRepository;
import com.surveyApe.repository.SurveyResponseRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.List;
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

    public SurveyResponse findAttendee(Survey survey_id, String attendee_email) {
        return surveyResponseRepository.findBySurveyIdEqualsAndUserEmailEquals(survey_id, attendee_email).orElse(null);
    }

    public SurveyResponse findBySurveyIdAndEmail(Survey survey_id, String attendee_email) {
        return surveyResponseRepository.findBySurveyIdEqualsAndUserEmailEquals(survey_id, attendee_email).orElse(null);
    }

    public void deleteAttendee(SurveyResponse response) {
        surveyResponseRepository.delete(response);
    }

    public String surveyResponse(Survey surveyID, String userEmail, String surveyURI, boolean completeInd, boolean uriind, String surveyResponse_id) {

        SurveyResponse s = null;
        if (!surveyResponse_id.equals("")) {
            s = surveyResponseRepository.findBySurveyResponseIdEquals(surveyResponse_id).orElse(null);
        } else {
            s = new SurveyResponse();
        }

        if (s == null) {
            return "";
        }

        s.setCompleteInd(completeInd);
//        s.setSurveyURI(surveyURI);
        s.setUserEmail(userEmail);
        s.setSurveyURIValidInd(uriind);
//        s.setSurveyId(surveyID);
        SurveyResponse sr = surveyResponseRepository.save(s);

        return sr.getSurveyResponseId();
    }

    public Survey getSurvey(String id) {
        Optional<Survey> s = surveyRepository.findById(id);

        return s.get();
    }

    public String getResponse(String id) {

        Optional<SurveyResponse> st = surveyResponseRepository.findById(id);

        SurveyResponse s = st.get();
        String response = s.getSurveyResponseId();

        return response;
    }

    public SurveyResponse getSurveyResponse(String id) {
        Optional<SurveyResponse> t = surveyResponseRepository.findById(id);

        return t.get();
    }

    public SurveyResponse getSurveyResponseEntityFromUrl(String url) {

        return surveyResponseRepository.findFirstBySurveyURIEquals(url).orElse(null);
    }

    public SurveyResponse getSurveyResponseEntityFromId(String id) {

        return surveyResponseRepository.findBySurveyResponseIdEquals(id).orElse(null);
    }

    public int countIncompleteResponses(Survey survey) {

        return surveyResponseRepository.countIncompleteResponses(survey, false);
    }

    public int countCompletedSurveyResponses(Survey survey) {

        return surveyResponseRepository.countSurveyResponsesBySurveyIdEqualsAndCompleteInd(survey, true);
    }

    public List<String> findSurveyResponseEmails(Survey survey){
        return surveyResponseRepository.findUserEmailsForSurveyResponses(survey);
    }

    public List<Survey> findAssignedSurveys(String email){
        List<SurveyResponse> surveyAssigned = surveyResponseRepository.findAllByUserEmailEquals(email);
        List<Survey> result = new ArrayList<>();
         if(surveyAssigned.size() > 0){
             surveyAssigned.stream().forEach( s ->{
                 s.getSurveyId().setResponseList(null);
                 result.add(s.getSurveyId());
             });
         }

         return result;
    }

}
