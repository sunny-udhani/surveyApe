package com.surveyApe.repository;

import com.surveyApe.entity.SurveyResponse;
import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface SurveyResponseRepository extends CrudRepository<SurveyResponse, String> {

    Optional<SurveyResponse> findBySurveyIdEqualsAndUserEmailEquals(String surveyId, String email);
}