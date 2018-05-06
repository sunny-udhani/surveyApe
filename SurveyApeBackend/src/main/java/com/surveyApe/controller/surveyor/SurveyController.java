package com.surveyApe.controller.surveyor;

import com.surveyApe.config.QuestionTypeEnum;
import com.surveyApe.entity.*;
import com.surveyApe.service.*;
import netscape.javascript.JSObject;
import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;


@Controller
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
//requires you to run react server on port 3000
@RequestMapping(path = "/survey")
public class SurveyController {

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

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> createSurvey(@RequestBody String req, @RequestParam Map<String, String> params, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);

        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String surveyTitle = reqObj.getString("surveyTitle");
        String surveyorEmail = "aaj@aaj.com";

        if (!surveyService.validSurveyType(surveyType)) {
            return new ResponseEntity<Object>("Invalid Survey Type", HttpStatus.BAD_REQUEST);
        }


        Survey surveyVO = new Survey();
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {

            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.FORBIDDEN);
        }

        surveyVO.setSurveyorEmail(userVO);
        surveyVO.setSurveyTitle(surveyTitle);
        surveyVO.setSurveyType(surveyType);
        surveyService.createSurvey(surveyVO);

        JSONArray questionArray = reqObj.getJSONArray("questions");


        for (int i = 0; i < questionArray.length(); i++) {
            JSONObject questionOnj = questionArray.getJSONObject(i);

            String questionText = questionOnj.getString("questionText");
            String questionType = questionOnj.getString("questionType");
            int questionTypeInt = Integer.parseInt(questionType);
            if (!validQuestionType(Integer.parseInt(questionType))) {
                return new ResponseEntity<Object>("Invalid Question Type", HttpStatus.BAD_REQUEST);
            }

            String optionList = questionOnj.getString("optionList");


            SurveyQuestion surveyQuestion = createNewQuestionWithOptions(surveyVO.getSurveyId(), questionText, questionTypeInt, optionList);

            if (surveyQuestion == null) {
                return new ResponseEntity<Object>("question not created", HttpStatus.BAD_REQUEST);
            }

        }

        if (reqObj.has("attendeesList")) {

            JSONArray attendeesArray = reqObj.getJSONArray("attendeesList");

            for (int i = 0; i < attendeesArray.length(); i++) {
                JSONObject attendeesObj = attendeesArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");
                String surveyeeURI = attendeesObj.getString("URI");

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(surveyVO.getSurveyId(), surveyeeEmail, surveyeeURI);

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }

        JSONObject resp = new JSONObject();
        resp.append("survey_id", surveyVO.getSurveyId().toString());
        return new ResponseEntity<Object>(resp, HttpStatus.OK);
    }

    @PostMapping(path = "/edit/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> editSurvey(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String survey_id, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);


        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String surveyTitle = reqObj.getString("surveyTitle");
        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = params.get("survey_id");
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(survey_id, userVO);
        if (survey == null) {
            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
        }
        survey.setSurveyTitle(surveyTitle);
        survey.setSurveyType(surveyType);
        surveyService.saveSurvey(survey);

        survey.getQuestionList().clear();
        surveyService.saveSurvey(survey);

        JSONArray questionArray = reqObj.getJSONArray("questions");


        for (int i = 0; i < questionArray.length(); i++) {
            JSONObject questionOnj = questionArray.getJSONObject(i);

            String questionText = questionOnj.getString("questionText");
            String questionType = questionOnj.getString("questionType");
            int questionTypeInt = Integer.parseInt(questionType);
            if (!validQuestionType(Integer.parseInt(questionType))) {
                return new ResponseEntity<Object>("Invalid Question Type", HttpStatus.BAD_REQUEST);
            }

            String optionList = reqObj.getString("optionList");

            SurveyQuestion surveyQuestion = createNewQuestionWithOptions(survey.getSurveyId(), questionText, questionTypeInt, optionList);

            if (surveyQuestion == null) {
                return new ResponseEntity<Object>("question not created", HttpStatus.BAD_REQUEST);
            }

        }


        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }


    /**
     * Get all surveys for a surveyor
     */
    @GetMapping(path = "surveyor/getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveAllSurveys(@RequestParam Map<String, String> params, HttpSession session) {

        System.out.println(params);
        String surveyorEmail = params.get("surveyorEmail");
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.BAD_REQUEST);
        }

        List<Survey> surveyList = surveyService.findBySurveyorEmail(userVO);
        if (surveyList.size() == 0) {
            return new ResponseEntity<Object>("No survey", HttpStatus.OK);
        }

        return new ResponseEntity<Object>(surveyList, HttpStatus.OK);
    }

    @GetMapping(path = "surveyor/getSurvey/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveASurvey(@PathVariable String id, @RequestParam Map<String, String> params, HttpSession session) {

        Survey survey = surveyService.findBySurveyId(id);
        if (survey == null) {
            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
        }
        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    public SurveyQuestion createNewQuestionWithOptions(String surveyId, String questionText, int questionType, String optionList) {
        Survey survey = surveyService.findBySurveyId(surveyId);

        if (survey == null) {
            return null;
        }

        System.out.println("TEXT,TYPE:" + questionText + "," + questionType);
        SurveyQuestion question = new SurveyQuestion(questionText, questionType);

        boolean successFlag = createOptions(optionList, question);
        addQuestionToSurveyEntity(question, survey);

        questionService.addQuestion(question);
        surveyService.saveSurvey(survey);
        return question;
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
        survey.getResponseList().add(response);
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

}
