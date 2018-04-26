package com.surveyApe.controller.surveyor;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@CrossOrigin(origins = "http://localhost:3000") //requires you to run react server on port 3000
@RequestMapping(path = "/survey")
public class SurveyController {

}
