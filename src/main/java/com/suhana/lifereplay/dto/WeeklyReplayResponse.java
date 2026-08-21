package com.suhana.lifereplay.dto;

import java.time.LocalDate;
import java.util.List;

public record WeeklyReplayResponse(
        LocalDate startDate,
        LocalDate endDate,
        int totalPlannedMinutes,
        int totalActualMinutes,
        int totalDifferenceMinutes,
        double completionPercentage,
        List<WeeklyReplayDay> days,
        List<WeeklyReplayActivity> activities
) {
}