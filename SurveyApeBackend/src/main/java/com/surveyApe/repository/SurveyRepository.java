package com.surveyApe.repository;

import com.surveyApe.entity.Survey;
import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface SurveyRepository extends CrudRepository<Survey, String> {

}