//package com.surveyApe.aspect;
//
//import com.surveyApe.config.SurveyTypeEnum;
//import com.surveyApe.entity.Survey;
//import com.surveyApe.service.SurveyService;
//import org.aspectj.lang.ProceedingJoinPoint;
//import org.aspectj.lang.annotation.Around;
//import org.aspectj.lang.annotation.Aspect;
//import org.aspectj.lang.annotation.Pointcut;
//import org.json.JSONArray;
//import org.json.JSONObject;
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Component;
//import org.springframework.web.bind.annotation.PostMapping;
//
//import java.util.Map;
//
//@Aspect
//@Component
//public class SurveyeeGetSurveyAspect {
//
//    @Autowired
//    private SurveyService surveyService;
//
//    @Pointcut("within(@org.springframework.stereotype.Controller *) && " +
//            "@annotation(requestMapping) && " +
//            "execution(* com.surveyApe.controller.surveyee.SurveyController.*(..))"
//    )
//    public void controller(PostMapping requestMapping) {
//    }
//
//    @Around("controller(requestMapping)")
//    public Object beforeGetSurvey(ProceedingJoinPoint joinPoint, PostMapping requestMapping) throws Throwable {
//        System.out.println(joinPoint.getSignature());
//        System.out.println(joinPoint.getSignature().getName());
//
//        int result = checkForAttendees(joinPoint);
//
//        if (result == 0) {
//            return joinPoint.proceed();
//
//        } else if (result == 1) {
//            return new ResponseEntity<Object>("Invalid Survey Type", HttpStatus.BAD_REQUEST);
//
//        } else if (result == 2) {
//            return new ResponseEntity<Object>("No such survey", HttpStatus.BAD_REQUEST);
//
//        } else if (result == 3) {
//            return new ResponseEntity<Object>("No attendees added, so can't publish", HttpStatus.BAD_REQUEST);
//
//        }
////
////        if (session.getAttribute("company") == null) {
////            System.out.println("Redirecting to login");
////            return "/login";
////        }
//        return joinPoint.proceed();
//    }
//
//    public int checkForAttendees(ProceedingJoinPoint joinPoint) {
//        String methodName = joinPoint.getSignature().getName();
//
//        Object[] args = joinPoint.getArgs();
//        String requestBody = (String) args[0];
//        Map<String, String> requestParams = (Map<String, String>) args[1];
//        JSONObject reqObj = new JSONObject(requestBody);
//
//        String publishInd = (reqObj.has("publishInd")) ? reqObj.getString("publishInd") : "";
//
//        if (publishInd.equals("")) {
////            allow jointpoint to proceed, no error
//            return 0;
//        } else {
//            int intPublishInd = Integer.parseInt(publishInd);
//            if (intPublishInd == 1) {
//
//                if (methodName.contains("edit")) {
//
//                    int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
//
//                    if (!surveyService.validSurveyType(surveyType)) {
////                        send error, invalid survey type
//                        return 1;
//                    }
//                    if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode()) {
//
//                        if (!(reqObj.has("attendeesList"))) {
//                            String surveyId = (String) args[2];
//
//                            Survey survey = surveyService.findBySurveyId(surveyId);
//                            if (survey == null) {
////                                send error, no such survey found
//                                return 2;
//                            }
//
//                            if (survey.getResponseList() != null) {
//                                int numberOfAttendees = survey.getResponseList().size();
//                                if (numberOfAttendees > 0)
//                                    return 0;
//                                else
////                                    send error, no attendee added, so can't publish
//                                    return 3;
//                            } else
////                                send error, no attendee added, so can't publish
//                                return 3;
//                        } else {
//                            JSONArray attendeeList = reqObj.getJSONArray("attendeesList");
//                            if (attendeeList.length() == 0)
////                            send error, no attendee added, so can't publish
//                                return 3;
////                            allow jointpoint to proceed, no error
//                            return 0;
////                        JSONArray attendeesArray = reqObj.getJSONArray("attendeesList");
//                        }
//                    }
//
//                } else {
//                    int surveyType = Integer.parseInt(reqObj.getString("surveyType"));
//
//                    if (!surveyService.validSurveyType(surveyType)) {
////                        send error, invalid survey type
//                        return 1;
//                    }
//                    if (surveyType == SurveyTypeEnum.CLOSED.getEnumCode()) {
//
//                        if (!(reqObj.has("attendeesList")))
////                            send error, no attendee added, so can't publish
//                            return 3;
//                        else {
//                            JSONArray attendeeList = reqObj.getJSONArray("attendeesList");
//                            if (attendeeList.length() == 0)
////                            send error, no attendee added, so can't publish
//                                return 3;
////                            allow jointpoint to proceed, no error
//                            return 0;
////                        JSONArray attendeesArray = reqObj.getJSONArray("attendeesList");
//                        }
//                    }
//                }
//
//            } else {
//                return 0;
//            }
//        }
//        return 0;
//    }
//}
