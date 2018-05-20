package com.surveyApe.controller.surveyee;

import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.QuestionResponse;
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
import java.util.Date;
import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
//requires you to run react server on port 3000
@RequestMapping(path = "/surveyee/responses")
public class ResponseController {

    @Autowired
    private SurveyService surveyService;
    @Autowired
    private QuestionResponseService questionResponseService;

    @PostMapping(path = "/question/answer", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> fillResponseForQuestion(@RequestBody String req, @RequestParam Map<String, String> params, HttpSession session) {
        JSONObject reqObj = new JSONObject(req);
        JSONObject response = new JSONObject();
        System.out.println("ALA ithe");
        if (!reqObj.has("survey_id")) {
            response.put("message", "please specify which survey");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }
        if (!reqObj.has("survey_response_id")) {
            response.put("message", "please specify which user or response");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }
        if (!reqObj.has("question_id")) {
            response.put("message", "please specify which question");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }
        if (!reqObj.has("response")) {
            response.put("message", "please specify which response");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        String responseId = reqObj.getString("survey_response_id");
        String questionId = reqObj.getString("question_id");
        String response1 = reqObj.getString("response");
        Survey survey = surveyService.findBySurveyId(reqObj.getString("survey_id"));



        if (survey == null) {
            response.put("message", "invalid survey id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        SurveyResponse userResponseEntity = survey.getResponseList().stream()
                .filter(r -> r.getSurveyResponseId().equals(responseId))
                .findAny()
                .orElse(null);

        if (userResponseEntity == null) {
            response.put("message", "invalid survey response id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        SurveyQuestion questionEntity = survey.getQuestionList().stream()
                .filter(r -> r.getSurveyQuestionId().equals(questionId))
                .findAny()
                .orElse(null);

        if (questionEntity == null) {
            response.put("message", "invalid survey question id");
            return new ResponseEntity<Object>(response.toString(), HttpStatus.BAD_REQUEST);
        }

        QuestionResponse questionResponse = questionEntity.getQuestionResponseList().stream()
                .filter(r -> r.getSurveyResponseId().equals(userResponseEntity.getSurveyResponseId()))
                .findAny()
                .orElse(null);

        if (questionResponse == null) {
            QuestionResponse newAnswer = new QuestionResponse();
            newAnswer.setQuestionId(questionEntity);
            newAnswer.setSurveyResponseId(userResponseEntity);
            newAnswer.setResponse(response1);
            questionResponseService.saveResponse(questionResponse);
        } else {
            questionResponse.setResponse(response1);
            questionResponseService.saveResponse(questionResponse);
        }

        response.put("message", "invalid request");
        return new ResponseEntity<>(response.toString(), HttpStatus.BAD_REQUEST);
    }

}
