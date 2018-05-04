package com.surveyApe.aspect;

import org.aspectj.lang.ProceedingJoinPoint;
import org.aspectj.lang.annotation.Around;
import org.aspectj.lang.annotation.Aspect;
import org.aspectj.lang.annotation.Pointcut;
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
    public void controller(PostMapping requestMapping) {}

    @Around("controller(requestMapping)")
    public Object beforeAll(ProceedingJoinPoint joinPoint, PostMapping requestMapping) throws Throwable {
        System.out.println(joinPoint.getSignature());
        Object[] args = joinPoint.getArgs();
        HttpSession session = (HttpSession) args[args.length - 1];
        if (session.getAttribute("company") == null) {
            System.out.println("Redirecting to login");
            return "/login";
        }
        return joinPoint.proceed();
    }
}
