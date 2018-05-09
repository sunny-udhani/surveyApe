package com.surveyApe.controller.surveyor;

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
    @Autowired
    private MailServices mailServices;

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> createSurvey(@RequestBody String req, @RequestParam Map<String, String> params, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);

        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String surveyTitle = reqObj.getString("surveyTitle");
        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        //String surveyorEmail = "aaj@aaj.com";

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

        if (reqObj.has("url")) {
            String url = reqObj.getString("url");
            if (!url.equals("")) {
                surveyVO.setSurveyURI(url);
            }
        }
        if (reqObj.has("qr")) {
            String qr = reqObj.getString("qr");
            if (!qr.equals("")) {
                surveyVO.setSurveyQRNumber(qr);
            }
        }
        if (reqObj.has("endTime")) {
            String endTime = reqObj.getString("endTime");
            if (!endTime.equals("")) {
                Date endDate = new Date(Long.getLong(endTime));
                if (endDate.after(new Date()))
                    surveyVO.setEndDate(endDate);
                else
                    return new ResponseEntity<Object>("Invalid End Date", HttpStatus.BAD_REQUEST);
            }
        }

        if (reqObj.has("publish")) {
            boolean publishInd = reqObj.getBoolean("publish");
            surveyVO.setPublishedInd(publishInd);
        }

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

                System.out.println(attendeesObj);

                String surveyeeEmail = attendeesObj.getString("email");
                String surveyeeURI = attendeesObj.getString("url");

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(surveyVO.getSurveyId(), surveyeeEmail, surveyeeURI);

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }

        if (reqObj.has("inviteeList")) {

            JSONArray invitedEmailsArray = reqObj.getJSONArray("inviteeList");

            for (int i = 0; i < invitedEmailsArray.length(); i++) {
                JSONObject attendeesObj = invitedEmailsArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(surveyVO.getSurveyId(), surveyeeEmail, "");

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }

        sendEmailtoAttendees(surveyVO);

        JSONObject resp = new JSONObject();
        resp.put("survey_id", surveyVO.getSurveyId());
        System.out.println(resp);

        String response = "survey_id : " + surveyVO.getSurveyId();
        return new ResponseEntity<Object>(surveyVO, HttpStatus.OK);
    }

    @PostMapping(path = "/edit/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> editSurvey(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);


        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String surveyTitle = reqObj.getString("surveyTitle");
        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        if (survey == null) {
            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
        }
        survey.setSurveyTitle(surveyTitle);
        survey.setSurveyType(surveyType);

        if (reqObj.has("url")) {
            String url = reqObj.getString("url");
            if (!url.equals("")) {
                survey.setSurveyURI(url);
            }
        }
        if (reqObj.has("qr")) {
            String qr = reqObj.getString("qr");
            if (!qr.equals("")) {
                survey.setSurveyQRNumber(qr);
            }
        }
        if (reqObj.has("endTime")) {
            String endTime = reqObj.getString("endTime");
            if (!endTime.equals("")) {
                Date endDate = new Date(Long.getLong(endTime));
                if (endDate.after(new Date()))
                    survey.setEndDate(endDate);
                else
                    return new ResponseEntity<Object>("Invalid End Date", HttpStatus.BAD_REQUEST);
            }
        }

        if (reqObj.has("publish")) {
            boolean publishInd = reqObj.getBoolean("publish");
            survey.setPublishedInd(publishInd);
        }

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

            String optionList = questionOnj.getString("optionList");

            SurveyQuestion surveyQuestion = createNewQuestionWithOptions(survey.getSurveyId(), questionText, questionTypeInt, optionList);

            if (surveyQuestion == null) {
                return new ResponseEntity<Object>("question not created", HttpStatus.BAD_REQUEST);
            }

        }

        if (reqObj.has("attendeesList")) {
            survey.getResponseList().clear();
            surveyService.saveSurvey(survey);
            JSONArray attendeesArray = reqObj.getJSONArray("attendeesList");

            for (int i = 0; i < attendeesArray.length(); i++) {
                JSONObject attendeesObj = attendeesArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");
                String surveyeeURI = attendeesObj.getString("URI");

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(survey.getSurveyId(), surveyeeEmail, surveyeeURI);

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }

        if (reqObj.has("inviteeList")) {
            survey.getResponseList().clear();
            surveyService.saveSurvey(survey);

            JSONArray invitedEmailsArray = reqObj.getJSONArray("inviteeList");

            for (int i = 0; i < invitedEmailsArray.length(); i++) {
                JSONObject attendeesObj = invitedEmailsArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(survey.getSurveyId(), surveyeeEmail, "");

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }

        sendEmailtoAttendees(survey);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    @PostMapping(path = "/addAttendees/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> addNewAttendees(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        if (survey == null) {
            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
        }


        if (reqObj.has("addAttendeesList")) {
//            survey.getResponseList().clear();
//            surveyService.saveSurvey(survey);
            JSONArray attendeesArray = reqObj.getJSONArray("addAttendeesList");

            for (int i = 0; i < attendeesArray.length(); i++) {
                JSONObject attendeesObj = attendeesArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");
                String surveyeeURI = attendeesObj.getString("URI");

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(survey.getSurveyId(), surveyeeEmail, surveyeeURI);

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }
        if (reqObj.has("addInviteeList")) {
//            survey.getResponseList().clear();
//            surveyService.saveSurvey(survey);

            JSONArray invitedEmailsArray = reqObj.getJSONArray("addInviteeList");

            for (int i = 0; i < invitedEmailsArray.length(); i++) {
                JSONObject attendeesObj = invitedEmailsArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(survey.getSurveyId(), surveyeeEmail, "");

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }
        sendEmailtoAttendees(survey);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    @PostMapping(path = "/publish/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> publishSurvey(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        if (survey == null) {
            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
        }

        if (reqObj.has("publish")) {
            boolean publishInd = reqObj.getBoolean("publish");
            survey.setPublishedInd(publishInd);
        }

        sendEmailtoAttendees(survey);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    @PostMapping(path = "/endSurvey/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> endSurvey(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        if (survey == null) {
            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
        }

        if (reqObj.has("publish")) {
            boolean publishInd = reqObj.getBoolean("publish");
            survey.setPublishedInd(publishInd);
        }

        sendEmailtoAttendees(survey);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    /**
     * Get all surveys for a surveyor
     */
    @GetMapping(path = "surveyor/getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveAllSurveys(@RequestParam Map<String, String> params, HttpSession session) {
        System.out.println(params);
        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        //String surveyorEmail="chandan.paranjape@gmail.com";
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

    //region utilities
    public SurveyQuestion createNewQuestionWithOptions(String surveyId, String questionText, int questionType, String optionList) {
        Survey survey = surveyService.findBySurveyId(surveyId);

        if (survey == null) {
            return null;
        }

//        System.out.println("TEXT,TYPE:" + questionText + "," + questionType);
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

        if (!(attendeeURI.equals(""))) {
            attendeeResponseEntity.setSurveyURI(attendeeURI);
            attendeeResponseEntity.setSurveyURIValidInd(true);
        }
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
