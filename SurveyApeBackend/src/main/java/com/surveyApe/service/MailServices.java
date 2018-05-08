package com.surveyApe.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
@Service
public class  MailServices {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to,String Message,String from,String subject)
    {
        try {
            SimpleMailMessage mail = new SimpleMailMessage();
//            System.out.println(to + Message + from + subject);
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
