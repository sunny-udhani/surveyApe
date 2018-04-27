package com.surveyApe.controller.surveyor;

import com.surveyApe.entity.QuestionOption;
import com.surveyApe.entity.Survey;
import com.surveyApe.entity.User;
import com.surveyApe.service.QuestionService;
import com.surveyApe.service.SurveyService;
import com.surveyApe.service.UserService;
import org.json.JSONArray;
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
@RequestMapping(path = "/survey/question")
public class QuestionController {

    @Autowired
    private SurveyService surveyService;
    @Autowired
    private QuestionService questionService;
    @Autowired
    private UserService userService;

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> createQuestion(@RequestBody String req, @RequestParam Map<String, String> params, HttpSession session) {

        JSONObject reqObj = new JSONObject(req);
        System.out.println(reqObj);
        System.out.println(params);

        String surveyId = reqObj.getString("surveyId");
        String questionText = reqObj.getString("questionText");
        String questionType = reqObj.getString("questionType");
        int questionTypeInt = Integer.parseInt(questionType);
        if (!questionService.validQuestionType(Integer.parseInt(questionType))) {
            return new ResponseEntity<Object>("Invalid Question Type", HttpStatus.BAD_REQUEST);
        }

        String optionList = reqObj.getString("optionList");


//        JSONArray optionList = userObj.getJSONArray("optionList");
//
//        for (int i = 0 ; i < optionList.length() ; i++){
//
//        }

        return new ResponseEntity<Object>("", HttpStatus.OK);
    }

}
