package com.surveyApe.controller.surveyee;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.surveyApe.config.QuestionTypeEnum;
import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.*;
import com.surveyApe.service.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Map;


@Controller
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
//requires you to run react server on port 3000
@RequestMapping(path = "/surveyee")
public class SurveyController1 {

    @Autowired
    private SurveyService surveyService;
    @Autowired
    private UserService userService;
    @Autowired
    private QuestionService questionService;
    @Autowired
    private QuestionOptionService questionOptionService;
    @Autowired
    private SurveyResponseService surveyResponseService;
    @Autowired
    private MailServices mailServices;

    @PostMapping(path = "/getSurvey/uri", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveASurvey(@RequestBody String req, @RequestParam Map<String, String> params, HttpSession session) {
        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();

        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String url = reqObj.getString("url");

        if (!surveyService.validSurveyType(surveyType)) {
            response.put("message", "invalid survey type");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        if (surveyType == SurveyTypeEnum.GENERAL.getEnumCode()) {
            Survey survey = surveyService.findSurveyByURL(url);
            if (survey == null) {
                response.put("message", "No such survey");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            }

            if (!survey.isPublishedInd()) {
                response.put("message", "Survey not available");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_ACCEPTABLE);
            }

            if (survey.getEndDate() != null) {

                Date now = new Date();
                if (now.after(survey.getEndDate())) {

                    closeSurveyBasedonEndDate(survey);

                    response.put("message", "Survey has ended!");
                    return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);

                }
            }

            if (survey.isSurveyCompletedInd()) {
                response.put("message", "The survey has been marked complete");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
            }

            if (session != null) {
                String user_email = session.getAttribute("surveyorEmail").toString();
                if (!user_email.isEmpty()) {
                    SurveyResponse surveyResponse = surveyResponseService.findBySurveyIdAndEmail(survey, user_email);
                    response.put("surveyResponse_id", surveyResponse.getSurveyResponseId());
                    response.put("email", surveyResponse.getUserEmail());
                }
            }

            response.put("survey_id", survey.getSurveyId());
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);

        } else if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode() || surveyType == SurveyTypeEnum.OPEN.getEnumCode()) {

            SurveyResponse surveyResponse = surveyResponseService.getSurveyResponseEntityFromUrl(url);
            if (surveyResponse == null) {
                response.put("message", "No such survey");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            }

            if (!surveyResponse.getSurveyId().isPublishedInd()) {
                response.put("message", "Survey not available");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_ACCEPTABLE);
            }

            if (surveyResponse.getSurveyId().getEndDate() != null) {
                Date now = new Date();
                if (now.after(surveyResponse.getSurveyId().getEndDate())) {

                    Survey survey = closeSurveyBasedonEndDate(surveyResponse.getSurveyId());

                    response.put("message", "Your survey has expired");
                    return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);

                }
            }

            if (surveyResponse.getSurveyId().isSurveyCompletedInd()) {
                response.put("message", "The survey has been marked complete");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
            }

            if (!surveyResponse.isSurveyURIValidInd()) {
                response.put("message", "Your URL is no longer valid");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.FORBIDDEN);
            }

            response.put("surveyResponse_id", surveyResponse.getSurveyResponseId());
            response.put("email", surveyResponse.getUserEmail());
            response.put("survey_id", surveyResponse.getSurveyId().getSurveyId());

            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);


        } else {
            response = new JSONObject();
            response.put("message", "invalid region");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);

        }
//        return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
//        return null;
    }


    @PostMapping(path = "/getSurvey/id", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveASurveyFromId(@RequestBody String req, @RequestParam Map<String, String> params, HttpSession session) {
        try {
            JSONObject reqJSON = new JSONObject(req);
            ObjectMapper responseJSON = new ObjectMapper();
            String surveyID = reqJSON.getString("surveyId");
            String surveyResponse_id = "";
            String userEmail = "";

            String surveyResponseStr = "";

            if (reqJSON.has("surveyResponse_id")) {
                surveyResponse_id = reqJSON.getString("surveyResponse_id");
            }
            if (reqJSON.has("email")) {
                userEmail = reqJSON.getString("email");
            }

            Survey survey = surveyService.findBySurveyId(surveyID);

            if (survey == null) {
                JSONObject resp = new JSONObject();
                resp.put("message", "No such survey");
                return new ResponseEntity<Object>(resp.toString(), HttpStatus.BAD_REQUEST);
            }

            if (survey.getEndDate() != null) {
                Date now = new Date();
                if (now.after(survey.getEndDate())) {

                    survey = closeSurveyBasedonEndDate(survey);
                    JSONObject resp = new JSONObject();

                    resp.put("message", "Your survey has expired");
                    return new ResponseEntity<Object>(resp.toString(), HttpStatus.SERVICE_UNAVAILABLE);

                }
            }

            for (SurveyQuestion ques : survey.getQuestionList()) {
                ques.setQuestionResponseList(null);
            }

            if (!surveyResponse_id.isEmpty() || !userEmail.isEmpty()) {

                if (!surveyResponse_id.isEmpty()) {
                    SurveyResponse surveyResponse = surveyResponseService.getSurveyResponseEntityFromId(surveyResponse_id);
                    if (surveyResponse != null) {
                        surveyResponseStr = responseJSON.writeValueAsString(surveyResponse.getQuestionResponseList());
                    }
                } else {
                    SurveyResponse surveyResponse = surveyResponseService.findBySurveyIdAndEmail(survey, userEmail);
                    if (surveyResponse != null) {
                        surveyResponseStr = responseJSON.writeValueAsString(surveyResponse.getQuestionResponseList());
                    }
                }

            }

//        if (survey.getSurveyType() == SurveyTypeEnum.CLOSED.getEnumCode()) {
//            String userEmail = session.getAttribute("email").toString();
//            if (!userEmail.equals("")) {
//
//            }
//        }

            JSONObject jsonObject = new JSONObject(responseJSON.writeValueAsString(survey));
            JSONObject resp = new JSONObject();

            resp.put("survey", jsonObject);

            if(!surveyResponseStr.isEmpty()) {
                JSONArray jsonObject1 = new JSONArray(surveyResponseStr);
                resp.put("responses", jsonObject1);
            }

            return new ResponseEntity<Object>(resp.toString(), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<Object>(ex.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    //region utilities

    public Survey closeSurveyBasedonEndDate(Survey survey) {

        survey.setSurveyCompletedInd(true);
        surveyService.saveSurvey(survey);
        return survey;
    }

    //endregion

}
