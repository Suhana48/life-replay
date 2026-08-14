package com.suhana.lifereplay.dto;

import java.time.LocalDate;

public record DailyReplayResponse(
        LocalDate date,
        int totalPlannedMinutes,
        int totalActualMinutes,
        int totalDifferenceMinutes,
        double overallCompletionPercentage
) {
}