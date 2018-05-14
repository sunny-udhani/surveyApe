package com.surveyApe.repository;

import com.surveyApe.entity.SurveyQuestion;
import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface SurveyQuestionRepository extends CrudRepository<SurveyQuestion, String> {

    Optional<SurveyQuestion> findBySurveyQuestionIdEquals(String s);
}