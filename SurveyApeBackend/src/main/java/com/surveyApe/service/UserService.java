package com.surveyApe.service;

import com.surveyApe.entity.User;
import com.surveyApe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String getUserById(String id, MediaType mediaType) {
return "";
    }

    public String getUserById(String id) {
       return "";
    }

//    @Transactional
    public String createUser(User p) {
        userRepository.save(p);
        return "";
    }

//    public Iterable<Users> getAllUsers(){
//        return pr.findAll();
//    }

    public String updateUser(String id, String fname, String lname,
                                  String phone)  {
       return "";
    }

}
