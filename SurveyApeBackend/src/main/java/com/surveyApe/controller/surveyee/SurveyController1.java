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
@CrossOrigin(origins = "*", allowCredentials = "true")
//requires you to run react server on port 3000
@RequestMapping(path = "/surveyee")
public class SurveyController1 {

    @Autowired
    private SurveyService surveyService;
    @Autowired
    private UserService userService;
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
            int checkForValidations = surveyValidations(survey);
            if (checkForValidations == 1) {
                response.put("message", "No such survey");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            } else if (checkForValidations == 2) {
                response.put("message", "Survey not available");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_ACCEPTABLE);
            } else if (checkForValidations == 3) {
                response.put("message", "Survey has ended!");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
            } else if (checkForValidations == 4) {
                response.put("message", "The survey has been marked complete");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
            } else {

                if (session != null && session.getAttribute("surveyorEmail") != null) {
                    String user_email = session.getAttribute("surveyorEmail").toString();
                    if (!user_email.isEmpty()) {
                        SurveyResponse surveyResponse = surveyResponseService.findBySurveyIdAndEmail(survey, user_email);

                        if (surveyResponse != null) {

//                            int checkValidations = surveyResponseValidations(surveyResponse);
//                            if (checkValidations == 1) {
//                                response.put("message", "No such survey");
//                                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
//                            } else if (checkValidations == 2) {
//                                response.put("message", "URI Invalid");
//                                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_ACCEPTABLE);
//                            } else if (checkValidations == 3) {
//                                response.put("message", "You have submitted the survey");
//                                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
//                            }

                            response.put("surveyResponse_id", surveyResponse.getSurveyResponseId());
                            response.put("email", surveyResponse.getUserEmail());
                        } else {
                            //generate new response id for email to coorelate responses
                            response.put("surveyResponse_id", createNewEmailResponseEntity(survey, user_email, ""));
                            response.put("email", user_email);
                        }
                    } else
                        //generate new response id to coorelate responses
                        response.put("surveyResponse_id", createNewAnonymousResponseEntity(survey));

                } else {

                    //generate new response id to coorelate responses
                    response.put("surveyResponse_id", createNewAnonymousResponseEntity(survey));
//                response.put("email", surveyResponse.getUserEmail());
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

            System.out.println("logging inside surveyefor openUnique");
            System.out.println(surveyResponse.getSurveyResponseId());
            System.out.println(surveyResponse.getUserEmail());
            System.out.println(surveyResponse.getSurveyId().getSurveyId());

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

                        JSONObject responses = new JSONObject();
                        JSONArray resp = new JSONArray();
                        surveyResponse.getQuestionResponseList().stream().forEach(sr -> {
                            JSONObject ne = new JSONObject();
                            ne.put("questionId", sr.getQuestionId().getSurveyQuestionId());
                            ne.put("response", sr.getResponse());
                            resp.put(ne);
                        });

                        surveyResponseStr = resp.toString();
//                        surveyResponseStr = responseJSON.writeValueAsString(surveyResponse.getQuestionResponseList());
                    }
                } else {
                    SurveyResponse surveyResponse = surveyResponseService.findBySurveyIdAndEmail(survey, userEmail);
                    if (surveyResponse != null) {
                        JSONArray resp = new JSONArray();
                        surveyResponse.getQuestionResponseList().stream().forEach(sr -> {
                            JSONObject ne = new JSONObject();
                            ne.put("questionId", sr.getQuestionId().getSurveyQuestionId());
                            ne.put("response", sr.getResponse());
                            resp.put(ne);
                        });

                        surveyResponseStr = resp.toString();
//
//                        surveyResponseStr = responseJSON.writeValueAsString(surveyResponse.getQuestionResponseList());
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

            if (!surveyResponseStr.isEmpty()) {
                JSONArray jsonObject1 = new JSONArray(surveyResponseStr);
                resp.put("responses", jsonObject1);
            }

            return new ResponseEntity<Object>(resp.toString(), HttpStatus.OK);
        } catch (Exception ex) {
            System.out.println("---------------------------------------");
            System.out.println(ex.toString());
            System.out.println("---------------------------------------");
            return new ResponseEntity<Object>(ex.toString(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    @GetMapping(path = "survey/getAll", produces = MediaType.APPLICATION_JSON_VALUE)
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

        List<Survey> surveyList = surveyResponseService.findAssignedSurveys(userVO.getEmail());
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

    @PostMapping(path = "/open/getSurvey/uri", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> getSurveyIdForOpenUnique(@RequestBody String req, @RequestParam Map<String, String> params, HttpSession session) {
        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();

        int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
        String url = reqObj.getString("url");

        if (!surveyService.validSurveyType(surveyType)) {
            response.put("message", "invalid survey type");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        if (surveyType == SurveyTypeEnum.OPEN.getEnumCode()) {
            Survey survey = surveyService.findSurveyByURL(url);
            System.out.println(survey.getSurveyId());
            int checkForValidations = surveyValidations(survey);
            if (checkForValidations == 1) {
                response.put("message", "No such survey");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            } else if (checkForValidations == 2) {
                response.put("message", "Survey not available");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_ACCEPTABLE);
            } else if (checkForValidations == 3) {
                response.put("message", "Survey has ended!");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
            } else if (checkForValidations == 4) {
                response.put("message", "The survey has been marked complete");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
            } else {
                //passes all checks
                response.put("survey_id", survey.getSurveyId());
                return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);
            }
        } else {
            response = new JSONObject();
            response.put("message", "invalid region");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }
    }

    @PostMapping(path = "/open/create/surveyResponse/", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> generateResponseEntityForOpenUnique(@RequestBody String req, @RequestParam Map<String, String> params, HttpSession session) {
        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();

        String surveyID = reqObj.getString("surveyId");
        String email = reqObj.getString("email");
        String newUniqueUrlForEmail = reqObj.getString("url");

        Survey survey = surveyService.findBySurveyId(surveyID);

        if (survey.getSurveyType() == SurveyTypeEnum.OPEN.getEnumCode()) {

            //checks for survey
            int checkForValidations = surveyValidations(survey);
            if (checkForValidations == 1) {
                response.put("message", "No such survey");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
            } else if (checkForValidations == 2) {
                response.put("message", "Survey not available");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.NOT_ACCEPTABLE);
            } else if (checkForValidations == 3) {
                response.put("message", "Survey has ended!");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
            } else if (checkForValidations == 4) {
                response.put("message", "The survey has been marked complete");
                return new ResponseEntity<Object>(response.toString(), HttpStatus.SERVICE_UNAVAILABLE);
            } else {

                SurveyResponse surveyResponse = surveyResponseService.findBySurveyIdAndEmail(survey, email);
                if (surveyResponse != null) {
                    response.put("message", "Attendee already added");
                    return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
                }

                createNewEmailResponseEntity(survey, email, newUniqueUrlForEmail);
                mailServices.sendEmail(email, "You must fill this survey: " + newUniqueUrlForEmail, "survayape.noreply@gmail.com", "Survey Filling request", newUniqueUrlForEmail, true);

//                mailServices.sendEmail(email, );

            }
        } else {
            response.put("message", "invalid request");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }
        //passes all checks
        response.put("survey_id", survey.getSurveyId());
        return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);

    }


    //region utilities

    public Survey closeSurveyBasedonEndDate(Survey survey) {

        survey.setSurveyCompletedInd(true);
        surveyService.saveSurvey(survey);
        return survey;
    }

    public String createNewAnonymousResponseEntity(Survey survey) {

        SurveyResponse surveyResponse = new SurveyResponse();
        surveyResponse.setSurveyId(survey);
        surveyResponse.setUserEmail("anonymous");
        surveyResponse.setSurveyURI(survey.getSurveyURI());
        surveyResponse.setSurveyURIValidInd(true);
        surveyResponseService.saveResponseEntity(surveyResponse);
        return surveyResponse.getSurveyResponseId();
    }

    public String createNewEmailResponseEntity(Survey survey, String email, String url) {

        SurveyResponse surveyResponse = new SurveyResponse();
        surveyResponse.setSurveyId(survey);
        surveyResponse.setUserEmail(email);
        surveyResponse.setSurveyURI((url.isEmpty()) ? survey.getSurveyURI() : url);
        surveyResponse.setSurveyURIValidInd(true);
        surveyResponseService.saveResponseEntity(surveyResponse);
        return surveyResponse.getSurveyResponseId();
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

    public int surveyResponseValidations(SurveyResponse surveyResponse) {

        if (surveyResponse == null) {
            return 1;
        }

        if (!surveyResponse.isSurveyURIValidInd()) {
            return 2;
        }

        if (surveyResponse.isCompleteInd()) {
            return 3;
        }

        return 0;
    }

//endregion

}
