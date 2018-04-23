package com.surveyApe.repository;

import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface UserRepository extends CrudRepository<User, String> {
    User findByEmailEquals(String id);
//   Passenger findOne(String id);
    void deleteByEmailEquals(String id);
    //Passenger findOne(String passengerId);
}