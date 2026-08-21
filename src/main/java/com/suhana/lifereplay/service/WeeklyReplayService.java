package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.WeeklyReplayDay;
import com.suhana.lifereplay.dto.WeeklyReplayResponse;
import com.suhana.lifereplay.dto.WeeklyReplayActivity;
import com.suhana.lifereplay.entity.DailyActual;
import com.suhana.lifereplay.entity.DailyPlan;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.DailyActualRepository;
import com.suhana.lifereplay.repository.DailyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;

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

        Map<Long, String> activityNames =
                new LinkedHashMap<>();

        Map<Long, Integer> plannedByActivity =
                new LinkedHashMap<>();

        Map<Long, Integer> actualByActivity =
                new LinkedHashMap<>();

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

            for (DailyPlan plan : plans) {

                Long activityId =
                        plan.getActivity().getId();

                activityNames.put(
                        activityId,
                        plan.getActivity().getName()
                );

                plannedByActivity.merge(
                        activityId,
                        plan.getPlannedMinutes(),
                        Integer::sum
                );
            }

            List<DailyActual> actuals =
                    dailyActualRepository
                            .findByActivity_User_IdAndDate(
                                    user.getId(),
                                    currentDate
                            );

            for (DailyActual actual : actuals) {

                Long activityId =
                        actual.getActivity().getId();

                activityNames.put(
                        activityId,
                        actual.getActivity().getName()
                );

                actualByActivity.merge(
                        activityId,
                        actual.getActualMinutes(),
                        Integer::sum
                );
            }

            int plannedMinutes =
                    plans.stream()
                            .mapToInt(DailyPlan::getPlannedMinutes)
                            .sum();

            int actualMinutes =
                    actuals.stream()
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

            currentDate =
                    currentDate.plusDays(1);
        }

        int totalDifferenceMinutes =
                totalActualMinutes - totalPlannedMinutes;

        double completionPercentage = 0;

        if (totalPlannedMinutes > 0) {
            completionPercentage =
                    (totalActualMinutes * 100.0)
                            / totalPlannedMinutes;
        }

        List<WeeklyReplayActivity> activities =
                new ArrayList<>();

        for (Long activityId : activityNames.keySet()) {

            int planned =
                    plannedByActivity.getOrDefault(
                            activityId,
                            0
                    );

            int actual =
                    actualByActivity.getOrDefault(
                            activityId,
                            0
                    );

            int difference =
                    actual - planned;

            activities.add(
                    new WeeklyReplayActivity(
                            activityId,
                            activityNames.get(activityId),
                            planned,
                            actual,
                            difference
                    )
            );
        }

        return new WeeklyReplayResponse(
                startDate,
                endDate,
                totalPlannedMinutes,
                totalActualMinutes,
                totalDifferenceMinutes,
                completionPercentage,
                days,
                activities
        );
    }
}