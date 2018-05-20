package com.surveyApe.service;


import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.stereotype.Service;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.surveyApe.entity.*;
import com.surveyApe.service.*;
import net.glxn.qrgen.core.image.ImageType;
import net.glxn.qrgen.javase.QRCode;
import org.json.JSONArray;
import net.*;
import org.json.JSONException;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;

import javax.mail.internet.MimeMessage;
import javax.servlet.http.HttpSession;
import javax.ws.rs.Produces;
import java.io.ByteArrayOutputStream;
import java.io.File;
import java.io.FileOutputStream;
import java.io.OutputStream;
import java.nio.charset.StandardCharsets;
import java.util.Map;
import java.util.UUID;

@Service
public class MailServices {

    @Autowired
    private JavaMailSender javaMailSender;

    public void sendEmail(String to, String Message, String from, String subject, String URL, Boolean indicator) {


        if (!indicator) {

            try {
                SimpleMailMessage mail = new SimpleMailMessage();
//            System.out.println(to + Message + from + subject);
                mail.setTo(to);
                mail.setFrom(from);
                mail.setSubject(subject);
                mail.setText(Message);
                javaMailSender.send(mail);

            } catch (Exception e) {
                e.printStackTrace();
            }


        } else {
            ByteArrayOutputStream bout =
                    QRCode.from(URL)
                            .withSize(250, 250)
                            .to(ImageType.PNG)
                            .stream();

            // bout has


            try {

                File ob = new File("src/qr.png");
                String abs = ob.getAbsolutePath();

                OutputStream out = new FileOutputStream(abs);

                bout.writeTo(out);
                out.flush();
                out.close();
                MimeMessage message2 = javaMailSender.createMimeMessage();
                MimeMessageHelper helper2 = new MimeMessageHelper(message2,
                        MimeMessageHelper.MULTIPART_MODE_MIXED_RELATED,
                        StandardCharsets.UTF_8.name());
                // File obj = new File("C:\\Users\\hp\\Desktop\\Gao\\qr-code.png");

                helper2.addAttachment(ob.getName(), ob);
                helper2.setText(Message);

                String inlineImage = "<img src=\"cid:logo.png\"></img><br/>";

                helper2.setSubject(subject);
                helper2.setTo(to);

                helper2.setFrom(from);

                javaMailSender.send(message2);


            } catch (Exception e) {
                e.printStackTrace();
            }

        }

    }

}
