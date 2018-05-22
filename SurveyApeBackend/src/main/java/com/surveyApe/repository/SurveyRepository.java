package com.surveyApe.repository;

import com.surveyApe.entity.Survey;
import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

import java.util.List;
import java.util.Optional;

public interface SurveyRepository extends CrudRepository<Survey, String> {

    Optional<Survey> findBySurveyIdEqualsAndSurveyorEmailEquals(String survey_id, User surveyor);

    Optional<Survey> findBySurveyIdEquals(String survey_id);

    List<Survey> findAllBySurveyorEmailEquals(User surveyor);

    Optional<Survey> findSurveyBySurveyURIEquals(String url);

    int countBySurveyIdEquals(String id);
}