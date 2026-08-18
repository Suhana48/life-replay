package com.suhana.lifereplay.service;

import java.util.ArrayList;
import java.util.List;
import com.suhana.lifereplay.dto.DailyReplayItem;
import com.suhana.lifereplay.dto.DailyReplayResponse;
import com.suhana.lifereplay.entity.DailyActual;
import com.suhana.lifereplay.entity.DailyPlan;
import com.suhana.lifereplay.entity.User;
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

    public DailyReplayResponse getDailyReplay(
            User user,
            LocalDate date) {

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

        int totalPlannedMinutes = 0;
        int totalActualMinutes = 0;

        for (DailyPlan plan : plans) {

            Integer plannedMinutes =
                    plan.getPlannedMinutes();

            DailyActual matchingActual =
                    actuals.stream()
                            .filter(actual ->
                                    actual.getActivity()
                                            .getId()
                                            .equals(
                                                    plan.getActivity().getId()
                                            )
                            )
                            .findFirst()
                            .orElse(null);

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

            totalPlannedMinutes += plannedMinutes;
            totalActualMinutes += actualMinutes;
        }

        int totalDifferenceMinutes =
                totalActualMinutes - totalPlannedMinutes;

        double overallCompletionPercentage =
                totalPlannedMinutes > 0
                        ? (totalActualMinutes * 100.0)
                        / totalPlannedMinutes
                        : 0.0;

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