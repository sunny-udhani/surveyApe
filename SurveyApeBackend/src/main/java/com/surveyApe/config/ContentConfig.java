//package com.minisocial.book.config;
//
//import org.springframework.context.annotation.Configuration;
//import org.springframework.http.MediaType;
//import org.springframework.web.servlet.config.annotation.ContentNegotiationConfigurer;
//import org.springframework.web.servlet.config.annotation.EnableWebMvc;
//import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;
//
//@Configuration
//@EnableWebMvc
//public class ContentConfig extends WebMvcConfigurerAdapter {
//
//    @Override
//    public void configureContentNegotiation(ContentNegotiationConfigurer configurer) {
//
//        //set path extension to true
//        configurer.favorPathExtension(false).
//                //set favor parameter to false
//                        favorParameter(true).
//                parameterName("xml").
//                //ignore the accept headers
//                        ignoreAcceptHeader(true).
//                //dont use Java Activation Framework since we are manually specifying the mediatypes required below
//                        useJaf(false).
//                defaultContentType(MediaType.APPLICATION_JSON).
//                mediaType("true", MediaType.APPLICATION_XML);
////                mediaType("json", MediaType.APPLICATION_JSON);
//    }
//}