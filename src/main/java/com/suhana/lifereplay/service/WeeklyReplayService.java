package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.WeeklyReplayDay;
import com.suhana.lifereplay.dto.WeeklyReplayResponse;
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
public class WeeklyReplayService {

    private final DailyPlanRepository dailyPlanRepository;
    private final DailyActualRepository dailyActualRepository;

    public WeeklyReplayResponse getWeeklyReplay(
            LocalDate startDate,
            User user) {

        LocalDate endDate = startDate.plusDays(6);

        int totalPlannedMinutes = 0;
        int totalActualMinutes = 0;
        int totalPlannedActivityActualMinutes = 0;

        List<WeeklyReplayDay> days =
                new ArrayList<>();

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


            int plannedMinutes =
                    plans.stream()
                            .mapToInt(DailyPlan::getPlannedMinutes)
                            .sum();

            int actualMinutes =
                    actuals.stream()
                            .mapToInt(DailyActual::getActualMinutes)
                            .sum();

            int plannedActivityActualMinutes =
                    actuals.stream()
                            .filter(actual ->
                                    plans.stream().anyMatch(plan ->
                                            plan.getActivity()
                                                    .getId()
                                                    .equals(
                                                            actual.getActivity()
                                                                    .getId()
                                                    )
                                    )
                            )
                            .mapToInt(DailyActual::getActualMinutes)
                            .sum();

            int differenceMinutes =
                    plannedActivityActualMinutes
                            - plannedMinutes;

            double completionPercentage = 0;

            if (plannedMinutes > 0) {
                completionPercentage =
                        (plannedActivityActualMinutes * 100.0)
                                / plannedMinutes;
            }

            days.add(
                    new WeeklyReplayDay(
                            currentDate,
                            plannedMinutes,
                            actualMinutes,
                            differenceMinutes,
                            completionPercentage
                    )
            );

            totalPlannedMinutes += plannedMinutes;
            totalActualMinutes += actualMinutes;
            totalPlannedActivityActualMinutes +=
                    plannedActivityActualMinutes;

            currentDate =
                    currentDate.plusDays(1);
        }

        int totalDifferenceMinutes =
                totalPlannedActivityActualMinutes
                        - totalPlannedMinutes;

        double completionPercentage = 0;

        if (totalPlannedMinutes > 0) {
            completionPercentage =
                    (totalPlannedActivityActualMinutes * 100.0)
                            / totalPlannedMinutes;
        }

        return new WeeklyReplayResponse(
                startDate,
                endDate,
                totalPlannedMinutes,
                totalActualMinutes,
                totalDifferenceMinutes,
                completionPercentage,
                days
        );
    }
}