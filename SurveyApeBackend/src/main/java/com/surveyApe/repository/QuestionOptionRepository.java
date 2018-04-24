package com.surveyApe.repository;

import com.surveyApe.entity.QuestionOption;
import com.surveyApe.entity.User;
import org.springframework.data.repository.CrudRepository;

public interface QuestionOptionRepository extends CrudRepository<QuestionOption, String> {

}