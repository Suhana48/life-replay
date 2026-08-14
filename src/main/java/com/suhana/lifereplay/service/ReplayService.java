package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.ReplayResponse;
import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.DailyActual;
import com.suhana.lifereplay.entity.DailyPlan;
import com.suhana.lifereplay.repository.DailyActualRepository;
import com.suhana.lifereplay.repository.DailyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
@RequiredArgsConstructor
public class ReplayService {

    private final DailyPlanRepository dailyPlanRepository;
    private final DailyActualRepository dailyActualRepository;

    public ReplayResponse getReplay(
            Activity activity,
            LocalDate date) {

        DailyPlan plan = dailyPlanRepository
                .findByActivityAndDate(activity, date)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Daily plan not found"));

        DailyActual actual = dailyActualRepository
                .findByActivityAndDate(activity, date)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Actual time not recorded"));

        Integer plannedMinutes = plan.getPlannedMinutes();
        Integer actualMinutes = actual.getActualMinutes();

        Integer differenceMinutes =
                actualMinutes - plannedMinutes;

        Double completionPercentage =
                (actualMinutes * 100.0) / plannedMinutes;

        return new ReplayResponse(
                activity.getId(),
                activity.getName(),
                date,
                plannedMinutes,
                actualMinutes,
                differenceMinutes,
                completionPercentage
        );
    }
}