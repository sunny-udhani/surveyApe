package com.surveyApe.controller.surveyee;

import com.surveyApe.config.QuestionTypeEnum;
import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.QuestionOption;
import com.surveyApe.entity.Survey;
import com.surveyApe.entity.SurveyQuestion;
import com.surveyApe.entity.SurveyResponse;
import com.surveyApe.service.*;
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


        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String url = reqObj.getString("url");

        if (!surveyService.validSurveyType(surveyType))
            return new ResponseEntity<Object>("invalid survey type", HttpStatus.BAD_REQUEST);

        if (surveyType == SurveyTypeEnum.GENERAL.getEnumCode()) {
            Survey survey = surveyService.findSurveyByURL(url);
            if (survey == null)
                return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);

            if (!survey.isPublishedInd())
                return new ResponseEntity<Object>("Survey not available", HttpStatus.NOT_ACCEPTABLE);

            Date now = new Date();
            if (now.after(survey.getEndDate())) {

                closeSurveyBasedonEndDate(survey);
                if (survey.isSurveyCompletedInd())
                    return new ResponseEntity<Object>("Survey has ended", HttpStatus.SERVICE_UNAVAILABLE);
                else
                    return new ResponseEntity<Object>("Survey has ended", HttpStatus.SERVICE_UNAVAILABLE);

            }

            return new ResponseEntity<Object>("{'survey_id' : '" + survey.getSurveyId() + "'}", HttpStatus.OK);

        } else if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode() || surveyType == SurveyTypeEnum.OPEN.getEnumCode()) {

            SurveyResponse surveyResponse = surveyResponseService.getSurveyResponseEntityFromUrl(url);
            if (surveyResponse == null)
                return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);

            if (!surveyResponse.getSurveyId().isPublishedInd())
                return new ResponseEntity<Object>("Survey not available", HttpStatus.NOT_ACCEPTABLE);

            if (!surveyResponse.isSurveyURIValidInd())
                return new ResponseEntity<Object>("Your URL is no longer valid", HttpStatus.FORBIDDEN);

            Date now = new Date();
            if (now.after(surveyResponse.getSurveyId().getEndDate())) {

                Survey survey = closeSurveyBasedonEndDate(surveyResponse.getSurveyId());
                if (survey.isSurveyCompletedInd())
                    return new ResponseEntity<Object>("Survey has ended", HttpStatus.SERVICE_UNAVAILABLE);
                else
                    return new ResponseEntity<Object>("Survey has ended", HttpStatus.SERVICE_UNAVAILABLE);

            }

            return new ResponseEntity<Object>(surveyResponse, HttpStatus.OK);


        } else {
            return new ResponseEntity<Object>("invalid region", HttpStatus.OK);

        }
//        return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
//        return null;
    }


    @GetMapping(path = "/getSurvey/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveASurveyFromId(@PathVariable String id, @RequestParam Map<String, String> params, HttpSession session) {

        Survey survey = surveyService.findBySurveyId(id);
        if (survey == null) {
            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    //region utilities

    public Survey closeSurveyBasedonEndDate(Survey survey) {

        survey.setSurveyCompletedInd(true);
        surveyService.saveSurvey(survey);
        return survey;
    }


    public SurveyResponse createNewSurveyeeResponseEntry(String surveyId, String attendeeEmail, String attendeeURI) {
        Survey survey = surveyService.findBySurveyId(surveyId);

        if (survey == null) {
            return null;
        }


        SurveyResponse attendeeResponseEntity = new SurveyResponse();
        attendeeResponseEntity.setSurveyId(survey);
        // no check for email in user table as only survey type closed requires users to be preregistered
        attendeeResponseEntity.setUserEmail(attendeeEmail);

        if (!(attendeeURI.equals("")))
            attendeeResponseEntity.setSurveyURI(attendeeURI);

        //add attendee response entity to survey for two way binding
        addSurveyResponseToSurveyEntity(attendeeResponseEntity, survey);

        //save each entity
        surveyResponseService.saveResponseEntity(attendeeResponseEntity);
        surveyService.saveSurvey(survey);
        return attendeeResponseEntity;
    }

    public void addQuestionToSurveyEntity(SurveyQuestion question, Survey survey) {
        survey.getQuestionList().add(question);
        question.setSurveyId(survey);
    }

    public void addSurveyResponseToSurveyEntity(SurveyResponse response, Survey survey) {
        List<SurveyResponse> responseList = survey.getResponseList();
        if (responseList == null)
            responseList = new ArrayList<>();

        responseList.add(response);
        survey.setResponseList(responseList);
        response.setSurveyId(survey);
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
            questionOptionService.saveOption(option);
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

    public int sendEmailtoAttendees(Survey survey) {
        boolean publishInd = survey.isPublishedInd();

        if (publishInd) {

            int surveyType = survey.getSurveyType();

            if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode() || surveyType == SurveyTypeEnum.GENERAL.getEnumCode()) {
                List<SurveyResponse> surveyResponseList = survey.getResponseList();
                if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode()) {

                    for (SurveyResponse response : surveyResponseList) {

                        String attendeeEmail = response.getUserEmail();
                        String attendeeURL = response.getSurveyURI();

                        mailServices.sendEmail(attendeeEmail, "You must fill this survey: " + attendeeURL, "aviralkum@gmail.com", "Survey Filling request");

                        return 0;
                    }

                } else {

                    String surveyURL = survey.getSurveyURI();
                    for (SurveyResponse response : surveyResponseList) {

                        String attendeeEmail = response.getUserEmail();
                        mailServices.sendEmail(attendeeEmail, "You are invited to take this survey: " + surveyURL, "aviralkum@gmail.com", "Survey Filling request");

                        return 0;
                    }
                }
            }
        } else {
            return 0;
        }
        return 0;
    }
    //endregion

}