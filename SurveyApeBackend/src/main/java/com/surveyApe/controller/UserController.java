package com.surveyApe.controller;

import com.fasterxml.jackson.core.JsonProcessingException;
import com.surveyApe.entity.Message;
import com.surveyApe.service.UserService;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.ws.rs.Produces;
import java.util.Map;

@Controller
@CrossOrigin(origins = "http://localhost:3000") //requires you to run react server on port 3000
@RequestMapping(path = "/user")
public class UserController {

    @Autowired
    private UserService userService;


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
        String resp = userService.getUserById(id, MediaType.APPLICATION_XML);
        return new ResponseEntity<Object>(resp, HttpStatus.OK);
    }

    @PostMapping(path = "", produces = MediaType.APPLICATION_JSON_VALUE)
    public @ResponseBody
    ResponseEntity<?> create(@RequestParam Map<String, String> params) throws JSONException {
        Message errorMessage = null;
        boolean errorFlag = false;
        String fname = params.get("firstname");
        String lname = params.get("lastname");
        String age = params.get("age");
        String gender = params.get("gender");
        String phone = params.get("phone");
        String resp = null;

        return new ResponseEntity<Object>(resp, HttpStatus.OK);
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

}
