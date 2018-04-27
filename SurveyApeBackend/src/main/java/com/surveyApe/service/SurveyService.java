package com.surveyApe.service;

import com.surveyApe.config.SurveyTypeEnum;
import com.surveyApe.entity.Survey;
import com.surveyApe.repository.SurveyRepository;
import com.surveyApe.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class SurveyService {

    @Autowired
    private SurveyRepository surveyRepository;

    public boolean createSurvey(Survey survey){
        surveyRepository.save(survey);
        return true;
    }

    public boolean validSurveyType(int surveyType){

        for(SurveyTypeEnum e : SurveyTypeEnum.values()){
            if(e.getEnumCode() == surveyType)
                return true;
        }

        return false;
    }


}
