package com.surveyApe.repository;

import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface UserRepository extends CrudRepository<User, String> {

    Optional<User> findByEmailEquals(String email);
}