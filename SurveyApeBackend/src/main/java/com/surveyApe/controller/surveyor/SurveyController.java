package com.surveyApe.controller.surveyor;

import com.surveyApe.repository.SurveyQuestionRepository;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.surveyApe.config.QuestionTypeEnum;
import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.*;
import com.surveyApe.repository.SurveyQuestionRepository;
import com.surveyApe.service.*;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import javax.servlet.http.HttpSession;
import java.io.*;
import java.nio.charset.StandardCharsets;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.*;


@Controller
@CrossOrigin(origins = "*", allowCredentials = "true")
//requires you to run react server on port 3000
@RequestMapping(path = "/survey")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;
    @Autowired
    private SurveyQuestionRepository surveyQuestionRepository;
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
        JSONObject response = new JSONObject();

        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String surveyTitle = reqObj.getString("surveyTitle");
        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        //String surveyorEmail = "aaj@aaj.com";

        if (!surveyService.validSurveyType(surveyType)) {
            response.put("message", "Invalid Survey Type");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }


        Survey surveyVO = new Survey();
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.FORBIDDEN);
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

        try {
            if (reqObj.has("endTime")) {
                String endTime = reqObj.getString("endTime");
                if (!endTime.equals("")) {
                    Date endDate = new SimpleDateFormat("yyyy-MM-dd").parse(endTime);
                    Date date = new Date();
                    if (endDate.getTime() > date.getTime()) {
                        surveyVO.setEndDate(endDate);
//                    surveyVO.setSurveyCompletedInd(true);
                    } else {
                        response.put("message", "Invalid End Date");
                        return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
                    }
                }
            }
        } catch (ParseException ex) {
            System.out.println(ex.toString());
        }

        if (reqObj.has("publish")) {
            boolean publishInd = reqObj.getBoolean("publish");
            surveyVO.setPublishedInd(publishInd);
            surveyVO.setStartDate(new Date());
        }

        surveyService.createSurvey(surveyVO);

        JSONArray questionArray = reqObj.getJSONArray("questions");


        for (int i = 0; i < questionArray.length(); i++) {
            JSONObject questionOnj = questionArray.getJSONObject(i);

            String questionText = questionOnj.getString("questionText");
            String questionType = questionOnj.getString("questionType");
            int questionTypeInt = Integer.parseInt(questionType);
            if (!validQuestionType(Integer.parseInt(questionType))) {
                response.put("message", "Invalid Question Type");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            }

            String optionList = questionOnj.getString("optionList");


            SurveyQuestion surveyQuestion = createNewQuestionWithOptions(surveyVO.getSurveyId(), questionText, questionTypeInt, optionList);

            if (surveyQuestion == null) {
                response.put("message", "Question Creation Exception");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            }

        }

        if (reqObj.has("attendeesList")) {

            JSONArray attendeesArray = reqObj.getJSONArray("attendeesList");

            for (int i = 0; i < attendeesArray.length(); i++) {
                JSONObject attendeesObj = attendeesArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");
                String surveyeeURI = attendeesObj.getString("url");

                SurveyResponse surveyResponse = surveyResponseService.findAttendee(surveyVO, surveyeeEmail);
                if (surveyResponse != null) {
                    System.out.println("Attendee already exists!!!");
                    continue;
                }

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(surveyVO.getSurveyId(), surveyeeEmail, surveyeeURI);
                if (newSurveyeeResponseEntry == null) {
                    response.put("message", "response entity not created");
                    return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
                }

            }
        }

        if (reqObj.has("inviteeList")) {

            JSONArray invitedEmailsArray = reqObj.getJSONArray("inviteeList");

            for (int i = 0; i < invitedEmailsArray.length(); i++) {
                JSONObject attendeesObj = invitedEmailsArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");

                SurveyResponse surveyResponse = surveyResponseService.findAttendee(surveyVO, surveyeeEmail);
                if (surveyResponse != null) {
                    System.out.println("Attendee already exists!!!");
                    continue;
                }

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(surveyVO.getSurveyId(), surveyeeEmail, surveyVO.getSurveyURI());

                if (newSurveyeeResponseEntry == null) {
                    response.put("message", "response entity not created");
                    return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
                }

            }
        }

        sendEmailtoAttendees(surveyVO);
//
//        JSONObject resp = new JSONObject();
//        resp.put("survey_id", surveyVO.getSurveyId());
//        System.out.println(resp);
//
//        String response = "survey_id : " + surveyVO.getSurveyId();
        return new ResponseEntity<Object>(surveyVO, HttpStatus.OK);
    }

    @PostMapping(path = "/edit/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> editSurvey(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();


        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String surveyTitle = reqObj.getString("surveyTitle");
        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        if (survey == null) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
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
                if (endDate.after(new Date())) {
                    survey.setEndDate(endDate);
//                    survey.setSurveyCompletedInd(true);
                } else
                    response.put("message", "Invalid End Date");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            }
        }

        System.out.println(survey.getQuestionList());

        survey.getQuestionList().stream().forEach(q -> {
            surveyQuestionRepository.delete(q);
        });
        survey.getQuestionList().clear();
        surveyService.saveSurvey(survey);
        System.out.println(survey.getQuestionList());

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

        if (reqObj.has("addAttendeesList")) {
            //            survey.getResponseList().clear();
            //            surveyService.saveSurvey(survey);
            JSONArray attendeesArray = reqObj.getJSONArray("addAttendeesList");

            for (int i = 0; i < attendeesArray.length(); i++) {
                JSONObject attendeesObj = attendeesArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");
                String surveyeeURI = attendeesObj.getString("URI");

                SurveyResponse surveyResponse = surveyResponseService.findAttendee(survey, surveyeeEmail);
                if (surveyResponse != null) {
                    System.out.println("Attendee already exists!!!");
                    continue;
                }

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(survey.getSurveyId(), surveyeeEmail, surveyeeURI);

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }
        if (reqObj.has("removeAttendeesList")) {
            //            survey.getResponseList().clear();
            //            surveyService.saveSurvey(survey);
            JSONArray attendeesArray = reqObj.getJSONArray("removeAttendeesList");

            for (int i = 0; i < attendeesArray.length(); i++) {
                JSONObject attendeesObj = attendeesArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");

                boolean flag = removeAttendeeFromSurvey(survey.getSurveyId(), surveyeeEmail);

                if (flag == false) {
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

                SurveyResponse surveyResponse = surveyResponseService.findAttendee(survey, surveyeeEmail);
                if (surveyResponse != null) {
                    System.out.println("Attendee already exists!!!");
                    continue;
                }

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(survey.getSurveyId(), surveyeeEmail, survey.getSurveyURI());

                if (newSurveyeeResponseEntry == null) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }

        if (reqObj.has("removeInviteeList")) {
            //            survey.getResponseList().clear();
            //            surveyService.saveSurvey(survey);
            JSONArray attendeesArray = reqObj.getJSONArray("removeInviteeList");

            for (int i = 0; i < attendeesArray.length(); i++) {
                JSONObject attendeesObj = attendeesArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");

                boolean flag = removeAttendeeFromSurvey(survey.getSurveyId(), surveyeeEmail);

                if (flag == false) {
                    return new ResponseEntity<Object>("response entity not created", HttpStatus.BAD_REQUEST);
                }

            }
        }

        if (reqObj.has("publish")) {
            boolean publishInd = reqObj.getBoolean("publish");
            survey.setPublishedInd(publishInd);
            survey.setStartDate(new Date());
        }

        surveyService.saveSurvey(survey);

        sendEmailtoAttendees(survey);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    @PostMapping(path = "/addAttendees/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> addNewAttendees(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        if (survey == null) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        int checkForValidations = surveyValidations(survey);
        if (checkForValidations == 1) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }  else if (checkForValidations == 3) {
            response.put("message", "Survey has ended!");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
        } else if (checkForValidations == 4) {
            response.put("message", "The survey has been marked complete");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
        }

        if (reqObj.has("addAttendeesList")) {
//            survey.getResponseList().clear();
//            surveyService.saveSurvey(survey);
            JSONArray attendeesArray = reqObj.getJSONArray("addAttendeesList");

            for (int i = 0; i < attendeesArray.length(); i++) {
                JSONObject attendeesObj = attendeesArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.has("email") ? attendeesObj.getString("email") : "";
                String surveyeeURI = attendeesObj.has("URI") ? attendeesObj.getString("URI") : "";

                if (surveyeeEmail.isEmpty() || surveyeeURI.isEmpty()) {
                    response.put("message", "Proper data needed");
                    return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
                }

                SurveyResponse surveyResponse = surveyResponseService.findAttendee(survey, surveyeeEmail);
                if (surveyResponse != null) {
                    System.out.println("Attendee already exists!!!");
                    continue;
                }

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(survey.getSurveyId(), surveyeeEmail, surveyeeURI);

                if (newSurveyeeResponseEntry == null) {
                    response.put("message", "response entity not created");
                    return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
                }

                if (survey.isPublishedInd())
                    mailServices.sendEmail(surveyeeEmail, "You are invited to take this survey: " + survey.getSurveyTitle() + " at " + surveyeeURI, "survayape.noreply@gmail.com", "Survey filling request", surveyeeURI, true);

            }
        }

        if (reqObj.has("addInviteeList")) {
            JSONArray invitedEmailsArray = reqObj.getJSONArray("addInviteeList");

            for (int i = 0; i < invitedEmailsArray.length(); i++) {
                JSONObject attendeesObj = invitedEmailsArray.getJSONObject(i);

                String surveyeeEmail = attendeesObj.getString("email");

                SurveyResponse surveyResponse = surveyResponseService.findAttendee(survey, surveyeeEmail);
                if (surveyResponse != null) {
                    System.out.println("Attendee already exists!!!");
                    continue;
                }

                SurveyResponse newSurveyeeResponseEntry = createNewSurveyeeResponseEntry(survey.getSurveyId(), surveyeeEmail, survey.getSurveyURI());

                if (newSurveyeeResponseEntry == null) {
                    response.put("message", "response entity not created");
                    return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
                }

                if (survey.isPublishedInd())
                    mailServices.sendEmail(surveyeeEmail, "You are invited to take this survey: " + survey.getSurveyTitle() + " at " + survey.getSurveyURI(), "survayape.noreply@gmail.com", "Survey filling request", survey.getSurveyURI(), true);

            }
        }

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    @PostMapping(path = "/publish/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> publishSurvey(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        if (survey == null) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        int checkForValidations = surveyValidations(survey);
        if (checkForValidations == 1) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }  else if (checkForValidations == 3) {
            response.put("message", "Survey has ended!");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
        } else if (checkForValidations == 4) {
            response.put("message", "The survey has been marked complete");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
        }


        if (reqObj.has("publish")) {
            boolean publishInd = reqObj.getBoolean("publish");

            survey.setPublishedInd(publishInd);
            survey.setStartDate(new Date());
            surveyService.saveSurvey(survey);
        }

        sendEmailtoAttendees(survey);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    @PostMapping(path = "/endSurvey/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> endSurvey(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        //Todo: validations for ending survey

        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        if (survey == null) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        if(!survey.isPublishedInd()){
            response.put("message", "Survey not yet published");
            return new ResponseEntity<Object>(survey, HttpStatus.BAD_REQUEST);
        }

        if (reqObj.has("endSurvey")) {
            boolean endSurvey = reqObj.getBoolean("endSurvey");
            survey.setSurveyCompletedInd(endSurvey);
            survey.setEndDate(new Date());
            surveyService.saveSurvey(survey);
        } else {
            response.put("message", "No end survey indicator");
            return new ResponseEntity<Object>(survey, HttpStatus.BAD_REQUEST);

        }

//        sendEmailtoAttendees(survey);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    @PostMapping(path = "/unpublish/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> unPublishSurvey(@RequestBody String req, @RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        //Todo: validations for ending survey

        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        //Check user first
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        //check survey id
        if (survey == null) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        if (!survey.isPublishedInd()) {
            response.put("message", "Survey not yet published");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        int count = surveyResponseService.countCompletedSurveyResponses(survey);
        if (count > 0) {

            response.put("message", "Cannot unpublish, survey has been completed by " + count + " attendees");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);

        } else if (count == 0) {

            survey.setPublishedInd(false);
            survey.setStartDate(null);
            surveyService.saveSurvey(survey);

            List<String> userEmails = surveyResponseService.findSurveyResponseEmails(survey);
            userEmails.stream().forEach(emailId -> {
                if (!emailId.isEmpty() && !emailId.equals("anonymous")) {
                    mailServices.sendEmail(emailId, "The survey: " + survey.getSurveyTitle() + " has been unpublished", "survayape.noreply@gmail.com", "Survey Unpublish notification", "", false);
                }
            });
        }

//        sendEmailtoAttendees(survey);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    @GetMapping(path = "/export/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> exportAsJSON(@RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {

        //Todo: validations for ending survey

        JSONObject response = new JSONObject();
        String jsonData = "";
        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String fileName = params.containsKey("filename") ? params.get("filename") : "file.txt";
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        //Check user first
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        //check survey id
        if (survey == null) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        try {

            survey.setResponseList(null);
            survey.setSurveyorEmail(null);
            survey.getQuestionList().stream().forEach(q -> q.setQuestionResponseList(null));
            jsonData = new ObjectMapper().writeValueAsString(survey);

        } catch (Exception ex) {
            ex.printStackTrace();
        }

        byte[] base64 = Base64.getEncoder().encode(jsonData.getBytes(StandardCharsets.UTF_8));
//        sendEmailtoAttendees(survey);
        JSONObject resp = new JSONObject();
        resp.put("byteArray", new String(base64));

        return new ResponseEntity<Object>(resp.toString(), HttpStatus.OK);
    }


    @PostMapping(path = "/import/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> importJSON(@RequestParam("file") MultipartFile uploadfile, @PathVariable String id, HttpSession session) {

        //Todo: validations for ending survey

        JSONObject response = new JSONObject();
        String jsonData = "";
        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
//        String fileName = params.containsKey("filename") ? params.get("filename") : "file.txt";
        String surveyId = id;
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        //Check user first
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.findBySurveyIdAndSurveyorEmail(surveyId, userVO);
        //check survey id
        if (survey == null) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        try {

            byte[] bytes = uploadfile.getBytes();
            Path path = Paths.get("./src/jsonfiles/" + uploadfile.getOriginalFilename());
            Files.write(path, bytes);

            Map<?, ?> surveyMap = new ObjectMapper().readValue(new FileInputStream("./src/jsonfiles/" + uploadfile.getOriginalFilename()), Map.class);
            if (!surveyMap.containsKey("questionList")) {
                response.put("message", "no questions to import");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
            }
            System.out.println(surveyMap);
            System.out.println(surveyMap.get("questionList"));

            ArrayList<LinkedHashMap<?, ?>> questions = (ArrayList) surveyMap.get("questionList");
            questions.stream().forEach(q -> {
                String qtx = q.get("questionText").toString();
                String gty = q.get("questionType").toString();
                String questionOrderNumber = q.get("questionOrderNumber").toString();

                SurveyQuestion suq = new SurveyQuestion(qtx, Integer.parseInt(gty));
                suq.setQuestionOrderNumber(Integer.parseInt(questionOrderNumber));


                ArrayList<LinkedHashMap<?, ?>> options = (ArrayList) q.get("questionOptionList");
                options.stream().forEach(o -> {
                    String otc = o.get("optionText").toString();
                    String oty = o.get("optionType").toString();
                    String otr = o.get("optionOrderNumber").toString();

                    QuestionOption option = new QuestionOption(otc);
                    option.setQuestionId(suq);
                    questionOptionService.saveOption(option);
                    suq.getQuestionOptionList().add(option);

                });

                suq.setSurveyId(survey);
                survey.getQuestionList().add(suq);
                questionService.addQuestion(suq);
                surveyService.saveSurvey(survey);

            });
//            String str = surveyMap.get("questionList").toString();tionList").toString());

        } catch (IOException ex) {
            System.out.println(ex.toString());
        }
        return new ResponseEntity<Object>("", HttpStatus.OK);
    }

    @GetMapping(path = "/endSurvey/info/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> infoBeforeEndSurvey(@RequestParam Map<String, String> params, @PathVariable String id, HttpSession session) {
        JSONObject response = new JSONObject();

        Survey survey = surveyService.findBySurveyId(id);
        if (survey == null) {
            response.put("message", "No such survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        int countRemaining = countIncompleteResponses(survey);
        if (countRemaining == -1) {
            response.put("message", "Survey not yet published");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        } else {
            response.put("count", countRemaining);
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }
//        return new ResponseEntity<Object>(survey, HttpStatus.OK);

    }

    /**
     * Get all surveys for a surveyor
     */
    @GetMapping(path = "surveyor/getAll", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveAllSurveys(@RequestParam Map<String, String> params, HttpSession session) {
        System.out.println(params);
        JSONObject response = new JSONObject();

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        //String surveyorEmail="chandan.paranjape@gmail.com";
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            response.put("message", "Invalid user / user id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        List<Survey> surveyList = surveyService.findBySurveyorEmail(userVO);
        if (surveyList.size() == 0) {
            response.put("surveys", new JSONArray());
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        }

        surveyList.stream().forEach(s -> {
            if (s.getEndDate() != null && new Date().after(s.getEndDate())) {
                s.setSurveyCompletedInd(true);
                surveyService.saveSurvey(s);
            }
        });

        try {
            JSONArray list = new JSONArray(new ObjectMapper().writeValueAsString(surveyList));
            response.put("surveys", list);
            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
        } catch (Exception ex) {
            response.put("message", ex.getMessage());
            return new ResponseEntity<Object>(response.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "surveyor/getSurvey/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveASurvey(@PathVariable String id, @RequestParam Map<String, String> params, HttpSession session) {
        try {
            JSONObject response = new JSONObject();
            ObjectMapper responseJSON = new ObjectMapper();

            Survey survey = surveyService.findBySurveyId(id);
            if (survey == null) {
                response.put("message", "No such survey");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            }

            JSONObject jsonObject = new JSONObject(responseJSON.writeValueAsString(survey));
            JSONObject resp = new JSONObject();

            resp.put("survey", jsonObject);

            int competedResponses = surveyResponseService.countCompletedSurveyResponses(survey);
            resp.put("competedResponses", competedResponses);

            return new ResponseEntity<Object>(resp.toString(), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<Object>(ex.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

    }


    @GetMapping(path = "surveyor/delete/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> deleteSurvey(@PathVariable String id, @RequestParam Map<String, String> params, HttpSession session) {
        try {
            JSONObject response = new JSONObject();
            ObjectMapper responseJSON = new ObjectMapper();

            JSONObject resp = new JSONObject();

            if (surveyService.deleteSurvey(id))
                resp.put("message", "done");
            else resp.put("message", "not done");

            return new ResponseEntity<Object>(resp.toString(), HttpStatus.OK);
        } catch (Exception ex) {
            return new ResponseEntity<Object>(ex.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }

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
        if (!successFlag)
            return null;

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

        if(survey.getSurveyType() == SurveyTypeEnum.OPEN.getEnumCode()){
            mailServices.sendEmail(attendeeEmail, "You are invited to take this survey: " + attendeeURI, "survayape.noreply@gmail.com", "Survey Filling request", attendeeURI, true);
            return new SurveyResponse();
        }

        SurveyResponse attendeeResponseEntity = new SurveyResponse();
        attendeeResponseEntity.setSurveyId(survey);
        // no check for email in user table as only survey type closed requires users to be preregistered
        attendeeResponseEntity.setUserEmail(attendeeEmail);

        if (!attendeeURI.isEmpty()) {
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

    public boolean removeAttendeeFromSurvey(String surveyId, String attendeeEmail) {
        Survey survey = surveyService.findBySurveyId(surveyId);

        if (survey == null) {
            return false;
        }

        SurveyResponse attendeeResponseEntity = surveyResponseService.findAttendee(survey, attendeeEmail);

        if (attendeeResponseEntity == null) {
            return false;
        }

        //remove attendee response entity to survey for two way binding
        removeAttendeeFromSurveyEntity(attendeeResponseEntity, survey);

        //save each entity
        surveyResponseService.deleteAttendee(attendeeResponseEntity);
        surveyService.saveSurvey(survey);
        return true;
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

    public void removeAttendeeFromSurveyEntity(SurveyResponse surveyResponse, Survey survey) {
        survey.getResponseList().remove(surveyResponse);
        surveyResponse.setSurveyId(null);
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

                        if (!attendeeEmail.isEmpty() && !attendeeEmail.equals("anonymous"))
                            mailServices.sendEmail(attendeeEmail, "You must fill this survey: " + attendeeURL, "survayape.noreply@gmail.com", "Survey Filling request", attendeeURL, true);

//                        return 0;
                    }

                } else {

                    String surveyURL = survey.getSurveyURI();
                    for (SurveyResponse response : surveyResponseList) {

                        String attendeeEmail = response.getUserEmail();
                        if (!attendeeEmail.isEmpty() && !attendeeEmail.equals("anonymous"))
                            mailServices.sendEmail(attendeeEmail, "You are invited to take this survey: " + surveyURL, "survayape.noreply@gmail.com", "Survey Filling request", surveyURL, true);

//                        return 0;
                    }
                }
            }
        } else {
            return 0;
        }
        return 0;
    }

    public int countIncompleteResponses(Survey survey) {
        boolean publishInd = survey.isPublishedInd();

        if (publishInd) {
            return surveyResponseService.countIncompleteResponses(survey);
        }
        return -1;
    }

    public Survey closeSurveyBasedonEndDate(Survey survey) {

        survey.setSurveyCompletedInd(true);
        surveyService.saveSurvey(survey);
        return survey;
    }

    public int surveyValidations(Survey survey) {

        if (survey == null) {
            return 1;
        }

        if (!survey.isPublishedInd()) {
            return 2;
        }

        if (survey.getEndDate() != null) {

            Date now = new Date();
            if (now.after(survey.getEndDate())) {

                closeSurveyBasedonEndDate(survey);

                return 3;

            }
        }

        if (survey.isSurveyCompletedInd()) {
            return 4;
        }

        return 0;
    }

    //endregion

    //region add/delete questions
//    survey.getQuestionList().clear();
//        surveyService.saveSurvey(survey);

    //add new questions if available
//        if(reqObj.has("newQuestions")){
//        JSONArray questionArray = reqObj.getJSONArray("newQuestions");
//
//        for (int i = 0; i < questionArray.length(); i++) {
//            JSONObject questionOnj = questionArray.getJSONObject(i);
//
//            String questionText = questionOnj.getString("questionText");
//            String questionType = questionOnj.getString("questionType");
//            int questionTypeInt = Integer.parseInt(questionType);
//            if (!validQuestionType(Integer.parseInt(questionType))) {
//                response.put("message", "Invalid Question Type");
//                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
//            }
//
//            String optionList = questionOnj.getString("optionList");
//
//            SurveyQuestion surveyQuestion = createNewQuestionWithOptions(survey.getSurveyId(), questionText, questionTypeInt, optionList);
//
//            if (surveyQuestion == null) {
//                response.put("message", "question not created");
//                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
//            }
//
//        }
//    }
//
//    //remove questions if available
//        if(reqObj.has("deletedQuestions")){
//        JSONArray questionArray = reqObj.getJSONArray("deletedQuestions");
//
//        for (int i = 0; i < questionArray.length(); i++) {
//            JSONObject questionOnj = questionArray.getJSONObject(i);
//
//            String questionId = questionOnj.getString("questionId");
//            SurveyQuestion question = questionService.getQuestionById(questionId);
//
//            if (question == null) {
//                response.put("message", "No question with id: "+questionId);
//                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
//            }
//
//            removeQuestionFromSurveyEntity(question,survey);
//            questionService.deleteQuestion(question);
//            surveyService.saveSurvey(survey);
//
//        }
//    }
    //endregion

}
