package com.surveyApe.repository;

import com.surveyApe.entity.Survey;
import com.surveyApe.entity.SurveyResponse;
import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.Optional;

public interface SurveyResponseRepository extends CrudRepository<SurveyResponse, String> {

    Optional<SurveyResponse> findBySurveyIdEqualsAndUserEmailEquals(Survey surveyId, String email);

    Optional<SurveyResponse> findBySurveyResponseIdEqualsAndUserEmailEquals(Optional<String> id, Optional<String> email);

    Optional<SurveyResponse> findDistinctBySurveyURIEquals(String url);

    Optional<SurveyResponse> findBySurveyResponseIdEquals(String id);
}