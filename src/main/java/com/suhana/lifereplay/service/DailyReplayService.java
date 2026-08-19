package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.DailyReplayItem;
import com.suhana.lifereplay.dto.DailyReplayResponse;
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
public class DailyReplayService {

    private final DailyPlanRepository dailyPlanRepository;
    private final DailyActualRepository dailyActualRepository;

    public DailyReplayResponse getDailyReplay(
            LocalDate date,
            User user) {

        List<DailyPlan> plans =
                dailyPlanRepository
                        .findByActivity_User_IdAndDate(
                                user.getId(),
                                date
                        );

        List<DailyActual> actuals =
                dailyActualRepository
                        .findByActivity_User_IdAndDate(
                                user.getId(),
                                date
                        );

        List<DailyReplayItem> items =
                new ArrayList<>();

        // -----------------------------------------
        // 1. Activities that were planned
        // -----------------------------------------

        for (DailyPlan plan : plans) {

            DailyActual matchingActual =
                    actuals.stream()
                            .filter(actual ->
                                    actual.getActivity()
                                            .getId()
                                            .equals(
                                                    plan.getActivity()
                                                            .getId()
                                            )
                            )
                            .findFirst()
                            .orElse(null);

            int plannedMinutes =
                    plan.getPlannedMinutes();

            int actualMinutes =
                    matchingActual != null
                            ? matchingActual.getActualMinutes()
                            : 0;

            int differenceMinutes =
                    actualMinutes - plannedMinutes;

            double completionPercentage =
                    plannedMinutes > 0
                            ? (actualMinutes * 100.0)
                            / plannedMinutes
                            : 0.0;

            items.add(
                    new DailyReplayItem(
                            plan.getActivity().getId(),
                            plan.getActivity().getName(),
                            plannedMinutes,
                            actualMinutes,
                            differenceMinutes,
                            completionPercentage
                    )
            );
        }

        // -----------------------------------------
        // 2. Activities done but NOT planned
        // -----------------------------------------

        for (DailyActual actual : actuals) {

            boolean alreadyIncluded =
                    plans.stream()
                            .anyMatch(plan ->
                                    plan.getActivity()
                                            .getId()
                                            .equals(
                                                    actual.getActivity()
                                                            .getId()
                                            )
                            );

            if (!alreadyIncluded) {

                int actualMinutes =
                        actual.getActualMinutes();

                items.add(
                        new DailyReplayItem(
                                actual.getActivity().getId(),
                                actual.getActivity().getName(),
                                0,
                                actualMinutes,
                                actualMinutes,
                                0.0
                        )
                );
            }
        }

        // -----------------------------------------
        // 3. Daily totals
        // -----------------------------------------

        int totalPlannedMinutes =
                plans.stream()
                        .mapToInt(DailyPlan::getPlannedMinutes)
                        .sum();

        int totalActualMinutes =
                actuals.stream()
                        .mapToInt(DailyActual::getActualMinutes)
                        .sum();

        int totalDifferenceMinutes =
                totalActualMinutes - totalPlannedMinutes;

        double overallCompletionPercentage = 0;

        if (totalPlannedMinutes > 0) {
            overallCompletionPercentage =
                    (totalActualMinutes * 100.0)
                            / totalPlannedMinutes;
        }

        return new DailyReplayResponse(
                date,
                items,
                totalPlannedMinutes,
                totalActualMinutes,
                totalDifferenceMinutes,
                overallCompletionPercentage
        );
    }
}