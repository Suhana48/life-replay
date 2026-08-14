package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.DailyStatResponse;
import com.suhana.lifereplay.entity.DailyActual;
import com.suhana.lifereplay.entity.DailyPlan;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.DailyActualRepository;
import com.suhana.lifereplay.repository.DailyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DashboardService {

    private final DailyPlanRepository dailyPlanRepository;
    private final DailyActualRepository dailyActualRepository;

    public List<DailyStatResponse> getDailyStats(
            LocalDate startDate,
            LocalDate endDate,
            User user) {

        List<DailyStatResponse> stats = new ArrayList<>();

        LocalDate currentDate = startDate;

        while (!currentDate.isAfter(endDate)) {

            List<DailyPlan> plans =
                    dailyPlanRepository
                            .findByActivity_User_IdAndDate(
                                    user.getId(),
                                    currentDate
                            );

            List<DailyActual> actuals =
                    dailyActualRepository
                            .findByActivity_User_IdAndDate(
                                    user.getId(),
                                    currentDate
                            );

            int plannedMinutes = plans.stream()
                    .mapToInt(DailyPlan::getPlannedMinutes)
                    .sum();

            int actualMinutes = actuals.stream()
                    .mapToInt(DailyActual::getActualMinutes)
                    .sum();

            int differenceMinutes =
                    actualMinutes - plannedMinutes;

            double completionPercentage = 0;

            if (plannedMinutes > 0) {
                completionPercentage =
                        (actualMinutes * 100.0)
                                / plannedMinutes;
            }

            stats.add(new DailyStatResponse(
                    currentDate,
                    plannedMinutes,
                    actualMinutes,
                    differenceMinutes,
                    completionPercentage
            ));

            currentDate = currentDate.plusDays(1);
        }

        return stats;
    }
}