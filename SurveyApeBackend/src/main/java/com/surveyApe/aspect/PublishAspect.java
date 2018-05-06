package com.surveyApe.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
import org.json.JSONObject;
import org.springframework.stereotype.Component;
import org.springframework.web.bind.annotation.PostMapping;

import javax.servlet.http.HttpSession;

@Aspect
@Component
public class PublishAspect {

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
        Object[] args = joinPoint.getArgs();
        String requestBody = (String) args[0];
        JSONObject reqObj = new JSONObject(requestBody);

        String publishInd = (reqObj.has("publishInd")) ? reqObj.getString("publishInd") : "";

        if (publishInd.equals("")){
            return joinPoint.proceed();
        }else{
            int intPublishInd = Integer.parseInt(publishInd);
            if (intPublishInd == 1){

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
