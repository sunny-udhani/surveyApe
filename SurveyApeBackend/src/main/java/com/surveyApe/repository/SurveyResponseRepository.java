package com.surveyApe.repository;

import com.surveyApe.entity.Survey;
import com.surveyApe.entity.SurveyResponse;
import com.surveyApe.entity.User;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface SurveyResponseRepository extends CrudRepository<SurveyResponse, String> {

    Optional<SurveyResponse> findBySurveyIdEqualsAndUserEmailEquals(Survey surveyId, String email);

    Optional<SurveyResponse> findBySurveyResponseIdEqualsAndUserEmailEquals(Optional<String> id, Optional<String> email);

    Optional<SurveyResponse> findFirstBySurveyURIEquals(String url);

    Optional<SurveyResponse> findBySurveyResponseIdEquals(String id);

    @Query("select count (SurveyResponse) from SurveyResponse where surveyId=:survey and completeInd=:completeind and userEmail <> 'anonymous'")
    int countIncompleteResponses(@Param("survey") Survey survey, @Param("completeind") boolean completeInd);

    int countSurveyResponsesBySurveyIdEqualsAndCompleteInd(Survey survey, boolean completeInd);

    @Query("select sr.userEmail from SurveyResponse sr where sr.surveyId=:survey and sr.userEmail <> 'anonymous'")
    List<String> findUserEmailsForSurveyResponses(Survey survey);

    List<SurveyResponse> findAllByUserEmailEquals(String email);
}