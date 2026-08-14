package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.InsightResponse;
import com.suhana.lifereplay.entity.DailyActual;
import com.suhana.lifereplay.entity.DailyPlan;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.DailyActualRepository;
import com.suhana.lifereplay.repository.DailyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class InsightService {

    private final DailyPlanRepository dailyPlanRepository;
    private final DailyActualRepository dailyActualRepository;
    private final InsightEngine insightEngine;
    private final InsightPrioritizer insightPrioritizer;

    public List<InsightResponse> getInsights(
            LocalDate startDate,
            LocalDate endDate,
            User user) {

        List<DailyPlan> plans =
                dailyPlanRepository
                        .findByActivity_User_IdAndDateBetween(
                                user.getId(),
                                startDate,
                                endDate
                        );

        List<DailyActual> actuals =
                dailyActualRepository
                        .findByActivity_User_IdAndDateBetween(
                                user.getId(),
                                startDate,
                                endDate
                        );

        List<InsightResponse> insights =
                insightEngine.analyze(plans, actuals);

        return insightPrioritizer.prioritize(insights);
    }
}