package com.surveyApe.service;

import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.Survey;
import com.surveyApe.entity.User;
import com.surveyApe.repository.SurveyRepository;
import com.surveyApe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    public boolean createSurvey(Survey survey) {
        surveyRepository.save(survey);
        return true;
    }

    public Survey findBySurveyIdAndSurveyorEmail(String survey_id, User surveyor) {
        return surveyRepository.findBySurveyIdEqualsAndSurveyorEmailEquals(survey_id, surveyor).orElse(null);
    }

    public List<Survey> findBySurveyorEmail(User surveyor) {
        return surveyRepository.findAllBySurveyorEmailEquals(surveyor);
    }

    public boolean validSurveyType(int surveyType) {

        for (SurveyTypeEnum e : SurveyTypeEnum.values()) {
            if (e.getEnumCode() == surveyType)
                return true;
        }
        return false;
    }

    public Survey findBySurveyId(String surveyId) {

        return surveyRepository.findBySurveyIdEquals(surveyId).orElse(null);

    }

    public void saveSurvey(Survey survey) {
        surveyRepository.save(survey);
//        return true;
    }

    public Survey findSurveyByURL(String url) {

        return surveyRepository.findSurveyBySurveyURIEquals(url).orElse(null);

    }

    public boolean deleteSurvey(String id) {

        if (surveyRepository.countBySurveyIdEquals(id) > 0) {
            surveyRepository.deleteById(id);
            return true;
        } else {
            return false;
        }
    }

}
