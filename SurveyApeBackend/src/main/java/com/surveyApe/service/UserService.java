/*package com.surveyApe.service;

import com.surveyApe.entity.User;
import com.surveyApe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.*;

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

*/

package com.surveyApe.service;

import com.surveyApe.entity.User;
import com.surveyApe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;

import java.util.Optional;
import java.util.*;

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

    public User getUser(String email)
    {
        Optional<User> o = userRepository.findById(email);
        return o.get();
    }


    public String getVerificationCode(String email)
    {

        Optional<User> obj = userRepository.findById(email);
        User u = obj.get();
        String code = u.getUniqueVerificationCode();

        return code;
    }

    public boolean userStatus(String id)
    {


        Optional<User> o = userRepository.findById(id);
        User u = o.get();
        if(u.isVerificationInd()==true)
        {
            return true;
        }
        else {
            return false;
        }



    }

    public boolean userExists(String id) {

        if(userRepository.existsById(id))
        {
            return true;
        }
        else
        {
            return false;
        }
    }

    //    @Transactional
    public String createUser(String firstName, String lastName,String email,String password,String phone,String code,boolean status) {

        User u = new User();
        u.setFirstname(firstName);
        u.setLastname(lastName);
        u.setEmail(email);
        u.setPassword(password);
        u.setUniqueVerificationCode(code);
        u.setVerificationInd(status);

        userRepository.save(u);
        return "";
    }

//    public Iterable<Users> getAllUsers(){
//        return pr.findAll();
//    }

    public String updateUser(String id, String fname, String lname,
                             String phone)  {


        return "";
    }

    public Boolean updateInd(String email)
    {
        Optional<User> o = userRepository.findById(email);
        User u = o.get();

        u.setVerificationInd(true);
        userRepository.save(u);
        return true;
    }

    //

}
