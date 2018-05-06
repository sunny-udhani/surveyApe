package com.surveyApe.service;


import com.surveyApe.entity.Survey;
import com.surveyApe.entity.SurveyQuestion;
import com.surveyApe.repository.SurveyQuestionRepository;
import com.surveyApe.repository.SurveyRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.List;
@Service
public class  MailServices {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to,String Message,String from,String subject)
    {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
            System.out.println(to + Message + from + subject);
            mail.setTo(to);
            mail.setFrom(from);
            mail.setSubject(subject);
            mail.setText(Message);
            javaMailSender.send(mail);

        }

        catch(Exception e)
        {
            e.printStackTrace();
        }


    }
}
