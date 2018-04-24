package com.surveyApe.repository;

import com.surveyApe.entity.SurveyQuestion;
import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface SurveyQuestionRepository extends CrudRepository<SurveyQuestion, String> {

}