package com.suhana.lifereplay.dto;

import java.time.LocalDate;
import java.util.List;

public record DailyReplayResponse(
        LocalDate date,
        List<DailyReplayItem> activities,
        Integer totalPlannedMinutes,
        Integer totalActualMinutes,
        Integer totalDifferenceMinutes,
        Double overallCompletionPercentage
) {
}