package com.surveyApe.service;

import com.surveyApe.entity.User;
import com.surveyApe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class UserService {

    @Autowired
    private UserRepository userRepository;

    public String getUserById(String id, MediaType mediaType) {
return "";
    }

    public Optional<User> getUserById(String email) {
        return userRepository.findByEmailEquals(email);
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
