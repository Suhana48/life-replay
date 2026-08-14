package com.suhana.lifereplay.dto;

import java.time.LocalDate;

public record WeeklyReplayResponse(
        LocalDate startDate,
        LocalDate endDate,
        int totalPlannedMinutes,
        int totalActualMinutes,
        int totalDifferenceMinutes,
        double completionPercentage
) {
}