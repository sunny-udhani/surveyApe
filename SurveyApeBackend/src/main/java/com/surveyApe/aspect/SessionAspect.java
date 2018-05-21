package com.surveyApe.aspect;

import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.Survey;
import com.surveyApe.service.SurveyService;
import org.aspectj.lang.JoinPoint;
import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.json.JSONArray;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.annotation.Order;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpSession;
import java.util.Map;

@Aspect
@Component
@Order(0)
public class SessionAspect {

    @Autowired
    private SurveyService surveyService;

    @Pointcut("within(@org.springframework.stereotype.Controller *) && " +
            "(@annotation(org.springframework.web.bind.annotation.GetMapping) || @annotation(org.springframework.web.bind.annotation.PostMapping) ) && " +
            "execution(* com.surveyApe.controller.surveyor.SurveyController.*(..))"
    )
    public void controller() {
    }

    @Around("controller()")
    public Object checkSession(ProceedingJoinPoint joinPoint) throws Throwable {
        System.out.println(joinPoint.getSignature());
        System.out.println(joinPoint.getSignature().getName());

        int result = checkForSession(joinPoint);

        if (result == 0) {
            return joinPoint.proceed();

        } else if (result == 1) {
            JSONObject resp = new JSONObject();
            resp.put("message", "No session");
            return new ResponseEntity<Object>(resp.toString(), HttpStatus.BAD_REQUEST);
        }
//
//        if (session.getAttribute("company") == null) {
//            System.out.println("Redirecting to login");
//            return "/login";
//        }
        return joinPoint.proceed();
    }

    public int checkForSession(JoinPoint jp) {

        Object[] args = jp.getArgs();
        HttpSession session = null;
        for (Object arg : args) {
            if (arg instanceof HttpSession) {
                session = (HttpSession) arg;
            }
        }

        try {
            if (session.getAttribute("surveyorEmail") == null) {
                return 1;
            }
        } catch (NullPointerException ex) {
            return 1;
        }

        return 0;
    }

}
