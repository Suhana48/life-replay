package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.DailyReplayResponse;
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
                totalPlannedMinutes,
                totalActualMinutes,
                totalDifferenceMinutes,
                overallCompletionPercentage
        );
    }
}