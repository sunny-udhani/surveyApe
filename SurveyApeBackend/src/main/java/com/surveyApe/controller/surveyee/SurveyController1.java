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

            if (survey.getEndDate() != null) {

                Date now = new Date();
                if (now.after(survey.getEndDate())) {

                    closeSurveyBasedonEndDate(survey);
                    if (survey.isSurveyCompletedInd())
                        return new ResponseEntity<Object>("Survey has ended", HttpStatus.SERVICE_UNAVAILABLE);
                    else
                        return new ResponseEntity<Object>("Survey has ended", HttpStatus.SERVICE_UNAVAILABLE);

                }
            }

            JSONObject res = new JSONObject();
            res.put("survey_id", survey.getSurveyId());
            return new ResponseEntity<Object>(res.toString(), HttpStatus.OK);

        } else if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode() || surveyType == SurveyTypeEnum.OPEN.getEnumCode()) {

            SurveyResponse surveyResponse = surveyResponseService.getSurveyResponseEntityFromUrl(url);
            if (surveyResponse == null)
                return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);

            if (!surveyResponse.getSurveyId().isPublishedInd())
                return new ResponseEntity<Object>("Survey not available", HttpStatus.NOT_ACCEPTABLE);

            if (!surveyResponse.isSurveyURIValidInd())
                return new ResponseEntity<Object>("Your URL is no longer valid", HttpStatus.FORBIDDEN);

            if (surveyResponse.getSurveyId().getEndDate() != null) {
                Date now = new Date();
                if (now.after(surveyResponse.getSurveyId().getEndDate())) {

                    Survey survey = closeSurveyBasedonEndDate(surveyResponse.getSurveyId());
                    if (survey.isSurveyCompletedInd())
                        return new ResponseEntity<Object>("Survey has ended", HttpStatus.SERVICE_UNAVAILABLE);
                    else
                        return new ResponseEntity<Object>("Survey has ended", HttpStatus.SERVICE_UNAVAILABLE);
                }
            }

            JSONObject response = new JSONObject();
            response.put("surveyResponse_id", surveyResponse.getSurveyResponseId());
            response.put("email", surveyResponse.getUserEmail());
            response.put("survey_id", surveyResponse.getSurveyId().getSurveyId());

            return new ResponseEntity<Object>(response.toString(), HttpStatus.OK);


        } else {
            return new ResponseEntity<Object>("invalid region", HttpStatus.OK);

        }
//        return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
//        return null;
    }


    @PostMapping(path = "/getSurvey/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> retrieveASurveyFromId(@RequestBody String req, @PathVariable String id, @RequestParam Map<String, String> params, HttpSession session) {

        Survey survey = surveyService.findBySurveyId(id);
        if (survey == null) {
            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
        }

        if (survey.getSurveyType() == SurveyTypeEnum.CLOSED.getEnumCode()) {
            String userEmail = session.getAttribute("email").toString();
            if (!userEmail.equals("")) {

            }
        }

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

    //region utilities

    public Survey closeSurveyBasedonEndDate(Survey survey) {

        survey.setSurveyCompletedInd(true);
        surveyService.saveSurvey(survey);
        return survey;
    }

    //endregion

}
