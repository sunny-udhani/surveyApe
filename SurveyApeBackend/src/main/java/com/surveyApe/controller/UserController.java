package com.surveyApe.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.surveyApe.entity.*;
import com.surveyApe.service.*;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpRequest;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.mail.SimpleMailMessage;

import javax.servlet.http.HttpSession;
import javax.servlet.http.HttpSessionListener;
import javax.ws.rs.Produces;
import java.util.Map;
import java.util.UUID;

import org.json.JSONObject;

@Controller
//requires you to run react server on port 3000
@CrossOrigin(origins = "http://localhost:3000", allowCredentials = "true")
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    private UserService userService;

    @Autowired
    private QuestionService questionService;

    @Autowired
    private SurveyService surveyService;

    @Autowired
    private MailServices mailServices;

    @Autowired
    private SurveyResponseService surveyResponseService;


    @GetMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    @Produces(MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> getPassenger(@PathVariable("id") String id) throws JSONException {

//        String p = userService.getUserById(id);
//        System.out.println(passengerService.getUserById(id) + "adhjbnsdjhbashj");

        return new ResponseEntity<Object>("", HttpStatus.OK);

    }

    @GetMapping(path = "/{id}", params = "xml", produces = MediaType.APPLICATION_XML_VALUE)
//    @Consumes(MediaType.ALL_VALUE)
    @Produces(MediaType.APPLICATION_XML_VALUE)
    public @ResponseBody
    ResponseEntity<?> getUserXML(@PathVariable("id") String id, @RequestParam Map<String, String> params) throws JSONException {
        // This returns a XML/JSON based on contentconfig.
//        String resp = userService.getUserById(id, MediaType.APPLICATION_XML);
        return new ResponseEntity<Object>("", HttpStatus.OK);
    }

    @PostMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> create(@RequestParam Map<String, String> params) throws JSONException {

        String fname = params.get("firstname");
        String lname = params.get("lastname");
        String age = params.get("age");
        String gender = params.get("gender");
        String phone = params.get("phone");
        String resp = null;

        return new ResponseEntity<Object>("", HttpStatus.OK);
    }

    @PutMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> updateUser(@PathVariable("id") String id, @RequestParam Map<String, String> params) throws JsonProcessingException, JSONException {

        Message errorMessage = null;
        boolean errorFlag = false;
        String fname = params.get("firstname");
        String lname = params.get("lastname");
        int age = Integer.parseInt(params.get("age"));
        String gender = params.get("gender");
        String phone = params.get("phone");

        String resp = "";

        return new ResponseEntity<Object>(resp, HttpStatus.OK);
    }

    @DeleteMapping(path = "/{id}", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> deleteUser(@PathVariable("id") String id) throws JSONException {
        Message success = new Message("User with id " + id + " is deleted successfully ", "200");
        Message error = new Message("User with id " + id + " does not exist", "404");

        return new ResponseEntity<Object>(success.getXML(), HttpStatus.OK);
    }

    @PostMapping(value = "/login", consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> loginUser(@RequestBody String data, HttpSession session) {

        // check if the email id exists

        System.out.println("Email id recieived " + data);


        JSONObject jso = new JSONObject(data);
        //String email = (String) jso.get("email");
        String password = (String) jso.get("password");
        int surveyType = Integer.parseInt(jso.getString("surveyType"));
        String surveyTitle = jso.getString("surveyTitle");
        String email = session.getAttribute("surveyorEmail").toString();


        System.out.println("Email id recieived " + email);
        System.out.println("password  recieived " + password);

        if (userService.userExists(email)) {

            User u = userService.getUser(email);
            if (u.getPassword().equals(password) && u.isVerificationInd() == true) {
                session.setAttribute("surveyorEmail", email);
                return new ResponseEntity<Object>(HttpStatus.OK);
            }
            if (u.getPassword().equals(password) && u.isVerificationInd() == false) {
                return new ResponseEntity<Object>(HttpStatus.CONFLICT);
            }

            if (u.getPassword() != password) {
                return new ResponseEntity<Object>(HttpStatus.valueOf(900));
            }


        } else {

            return new ResponseEntity<Object>(HttpStatus.NOT_FOUND);
        }

        return null;
    }


    @PostMapping(value = "/verify", consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> verifyUser(@RequestBody String data)

    {

        JSONObject jso = new JSONObject(data);
        String email = (String) jso.get("email");
        String code = (String) jso.get("confirmation");

        String uniqueCode = userService.getVerificationCode(email);

        if (code.equals(uniqueCode)) {

            userService.updateInd(email);
            return new ResponseEntity<Object>(HttpStatus.OK);

        } else {

            return new ResponseEntity<Object>(HttpStatus.CONFLICT);
        }

    }

    @PostMapping(value = "/signup", consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> signupUser(@RequestBody String data) {
        System.out.println("body");
        JSONObject jso = new JSONObject(data);
        System.out.println(jso.get("firstName"));
        System.out.print(jso.get("firstName"));
        System.out.print(jso.get("lastName"));
        System.out.print(jso.get("email"));
        String firstName = (String) jso.get("firstName");
        String lastName = (String) jso.get("lastName");
        String email = (String) jso.get("email");
        String password = (String) jso.get("password");
        String phone = (String) jso.get("phone");
        String uid = UUID.randomUUID().toString();


        if (userService.userExists(email)) {
            System.out.print("User exists");
            if (!userService.userStatus(email)) {
                // user exists but not verified , verify your account! // Status Code 409
                return new ResponseEntity<Object>(HttpStatus.CONFLICT);
            }
            // User Already Exists & Status Verifed Status Code 302 Sent please login with your  credentials

            return new ResponseEntity<Object>(HttpStatus.FOUND);
        } else {

            //  javaMailSender.send(mail);
            userService.createUser(firstName, lastName, email, password, phone, uid, false);
            mailServices.sendEmail(email, "Hello "+ firstName+ ","+'\n'+ "Confirmation Code: "+uid+'\n'+"Thanks & Regards ,"+'\n'+"SurveyApe Team", "aviralkum@gmail.com", "Please Confirm Your SurveyApe Account");


        }

        // User Created Successfully with Verification Pending


        return new ResponseEntity<Object>(HttpStatus.OK);

    }
    @PostMapping(value="/submitSurvey",consumes = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody ResponseEntity<?> surveySubmit(@RequestBody String data,HttpSession session )
    {

        System.out.println(data);
        JSONObject jso = new JSONObject(data);

        String surveyID = String.valueOf(jso.get("surveyId"));
        String surveyee_ID = (String)jso.get("surveyee_id");
       // String email = (String)jso.get("email");
        String surveyuri = "surveyuri";
        String uind = "complete_ind";
        String cind = "surveyurivalid_ind";
        String surveyur = "surveyuri";
        String submit = (String)jso.get("submit");
        Boolean uindicator = true;
        Boolean cindicator = false;

        if(submit.equals("true"))
        {
            cindicator = true;
            uindicator=false;

            mailServices.sendEmail(surveyee_ID, "Survey Submitted Successfully", "aviralkum@gmail.com", "Survey Submitted from SurveyApp");

        }
        else
        {
            cindicator = false;
            uindicator = true;
        }



        System.out.println(jso.get("surveyId"));
     //   System.out.println(jso.get("surveyee_id"));
     //   System.out.println(jso.get("responses"));
        //String res = (String)jso.get("response_text");
        //  JSONObject obj2 = new JSONObject("response_text");
        // Table 1 : Update :  complete_ind , surveuri, survey
        // fetch the survey id based on the given survey ud
        Survey s = surveyResponseService.getSurvey(surveyID);

        String responseId = surveyResponseService.surveyResponse(s,surveyee_ID,surveyur,cindicator,uindicator);

        // save in question_response table
        // get the survey response id from survey_response table where email = current email

        SurveyResponse sr = surveyResponseService.getSurveyResponse(responseId);
        SurveyQuestion sq = questionService.getSurveyQuestion(surveyID);
        // insert this response id
        JSONArray c = jso.getJSONArray("answerObj");

        for(int i=0;i<c.length();i++)
        {
            JSONObject n = c.getJSONObject(i);
            System.out.println(n.get("qid"));
            String ques = String.valueOf(n.get("qid"));
            String reste = String.valueOf((n.get("answer")));
            String array="";
            if(reste.charAt(0)=='[')
            {
                int length = reste.length();
                array = reste.substring(1,length-1);

            }
            else {
                array = reste;
            }
            SurveyQuestion q = new SurveyQuestion();
            q.setSurveyQuestionId(ques);

            questionService.createResponse(sr,array,q);



        }

        return new ResponseEntity<Object>(null,HttpStatus.OK);


    }


}
