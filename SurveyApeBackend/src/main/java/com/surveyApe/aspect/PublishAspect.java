package com.surveyApe.aspect;

import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.Survey;
import com.surveyApe.service.SurveyService;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Aspect
@Component
public class PublishAspect {

    @Autowired
    private SurveyService surveyService;

    @Pointcut("within(@org.springframework.stereotype.Controller *) && " +
            "@annotation(requestMapping) && " +
            "execution(* com.surveyApe.controller.surveyor.SurveyController.*(..))"
    )
    public void controller(PostMapping requestMapping) {
    }

    @Around("controller(requestMapping)")
    public Object beforeAll(ProceedingJoinPoint joinPoint, PostMapping requestMapping) throws Throwable {
        System.out.println(joinPoint.getSignature());
        System.out.println(joinPoint.getSignature().getName());

        String methodName = joinPoint.getSignature().getName();

        Object[] args = joinPoint.getArgs();
        String requestBody = (String) args[0];
        Map<String, String> requestParams = (Map<String, String>) args[1];
        JSONObject reqObj = new JSONObject(requestBody);

        String publishInd = (reqObj.has("publishInd")) ? reqObj.getString("publishInd") : "";

        if (publishInd.equals("")) {
            return joinPoint.proceed();
        } else {
            int intPublishInd = Integer.parseInt(publishInd);
            if (intPublishInd == 1) {

                if (methodName.contains("edit")) {

                    int surveyType = Integer.parseInt(reqObj.getString("surveyType"));

                    if (!surveyService.validSurveyType(surveyType)) {
                        return new ResponseEntity<Object>("Invalid Survey Type", HttpStatus.BAD_REQUEST);
                    }
                    if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode()) {

                        if (!(reqObj.has("attendeesList"))) {
                            String surveyId = (String) args[2];

                            Survey survey = surveyService.findBySurveyId(surveyId);
                            if (survey == null) {
                                return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
                            }

                            if (survey.getResponseList() != null) {
                                int numberOfattendees = survey.getResponseList().size();
                                if (numberOfattendees > 0)
                                    return joinPoint.proceed();
                                else
                                    return new ResponseEntity<Object>("No attendees added, so can't publish", HttpStatus.BAD_REQUEST);
                            } else
                                return new ResponseEntity<Object>("No attendees added, so can't publish", HttpStatus.BAD_REQUEST);
                        } else
                            return joinPoint.proceed();
//                        JSONArray attendeesArray = reqObj.getJSONArray("attendeesList");
                    }

                } else {
                    int surveyType = Integer.parseInt(reqObj.getString("surveyType"));

                    if (!surveyService.validSurveyType(surveyType)) {
                        return new ResponseEntity<Object>("Invalid Survey Type", HttpStatus.BAD_REQUEST);
                    }
                    if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode()) {

                        if (!(reqObj.has("attendeesList")))
                            return new ResponseEntity<Object>("No attendees added, so can't publish", HttpStatus.BAD_REQUEST);
                        else
                            return joinPoint.proceed();
//                        JSONArray attendeesArray = reqObj.getJSONArray("attendeesList");
                    }
                }

            } else {
                return joinPoint.proceed();
            }
        }
//
//        if (session.getAttribute("company") == null) {
//            System.out.println("Redirecting to login");
//            return "/login";
//        }
        return joinPoint.proceed();
    }
}
