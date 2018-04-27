package com.surveyApe.controller.surveyor;

import com.surveyApe.entity.Message;
import com.surveyApe.entity.Survey;
import com.surveyApe.entity.User;
import com.surveyApe.service.SurveyService;
import com.surveyApe.service.UserService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:3000") //requires you to run react server on port 3000
@RequestMapping(path = "/survey")
public class SurveyController {

    @Autowired
    private SurveyService surveyService;
    @Autowired
    private UserService userService;

    @PostMapping(path = "/create", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<?> create(@RequestParam Map<String, String> params, HttpSession session){


        int surveyType = Integer.parseInt(params.get("surveyType"));
        if(!surveyService.validSurveyType(surveyType)){
            return new ResponseEntity<Object>("Invalid Survey Type",HttpStatus.BAD_REQUEST);
        }

        String surveyTitle = params.get("surveyTitle");
//        String lname = params.get("lastname");
//        String age = params.get("age");
//        String gender = params.get("gender");
//        String phone = params.get("phone");

        String surveyorEmail = session.getAttribute("surveyorEmail").toString();

        Survey surveyVO = new Survey();
        User userVO = userService.getUserById(surveyorEmail).orElse(null);
        if(userVO == null){
            return new ResponseEntity<Object>("Invalid user / user id",HttpStatus.BAD_REQUEST);
        }
        surveyVO.setSurveyorEmail(userVO);
        surveyVO.setSurveyTitle(surveyTitle);
        surveyVO.setSurveyType(surveyType);

        return new ResponseEntity<Object>("lols", HttpStatus.OK);
    }

}
