package com.surveyApe.controller.surveyor;

import com.surveyApe.entity.Message;
import com.surveyApe.entity.Survey;
import com.surveyApe.entity.User;
import com.surveyApe.service.SurveyService;
import com.surveyApe.service.UserService;
import netscape.javascript.JSObject;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
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

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> createSurvey(@RequestParam Map<String, String> params, HttpSession session) {

        int surveyType = Integer.parseInt(params.get("surveyType"));
        if (!surveyService.validSurveyType(surveyType)) {
            return new ResponseEntity<Object>("Invalid Survey Type", HttpStatus.BAD_REQUEST);
        }

        String surveyTitle = params.get("surveyTitle");

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();

        Survey surveyVO = new Survey();
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.BAD_REQUEST);
        }
        surveyVO.setSurveyorEmail(userVO);
        surveyVO.setSurveyTitle(surveyTitle);
        surveyVO.setSurveyType(surveyType);
        surveyService.createSurvey(surveyVO);

        JSONObject resp = new JSONObject();
        resp.append("survey_id", surveyVO.getSurveyId());

        return new ResponseEntity<Object>(resp, HttpStatus.OK);
    }

    @PostMapping(path = "/edit/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> editSurvey(@PathVariable String survey_id ,@RequestParam Map<String, String> params, HttpSession session) {

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();
        String surveyId = params.get("survey_id");
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if (userVO == null) {
            return new ResponseEntity<Object>("Invalid user / user id", HttpStatus.BAD_REQUEST);
        }

        Survey survey = surveyService.editSurvey(survey_id,userVO).orElse(null);

        return new ResponseEntity<Object>(survey, HttpStatus.OK);
    }

}
