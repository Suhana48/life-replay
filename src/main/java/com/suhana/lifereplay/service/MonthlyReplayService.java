package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.MonthlyReplayResponse;
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
public class MonthlyReplayService {

    private final DailyPlanRepository dailyPlanRepository;
    private final DailyActualRepository dailyActualRepository;

    public MonthlyReplayResponse getMonthlyReplay(
            LocalDate startDate,
            User user) {

        LocalDate endDate = startDate
                .withDayOfMonth(startDate.lengthOfMonth());

        int totalPlannedMinutes = 0;
        int totalActualMinutes = 0;

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

            totalPlannedMinutes += plans.stream()
                    .mapToInt(DailyPlan::getPlannedMinutes)
                    .sum();

            totalActualMinutes += actuals.stream()
                    .mapToInt(DailyActual::getActualMinutes)
                    .sum();

            currentDate = currentDate.plusDays(1);
        }

        int totalDifferenceMinutes =
                totalActualMinutes - totalPlannedMinutes;

        double completionPercentage = 0;

        if (totalPlannedMinutes > 0) {
            completionPercentage =
                    (totalActualMinutes * 100.0)
                            / totalPlannedMinutes;
        }

        return new MonthlyReplayResponse(
                startDate,
                endDate,
                totalPlannedMinutes,
                totalActualMinutes,
                totalDifferenceMinutes,
                completionPercentage
        );
    }
}