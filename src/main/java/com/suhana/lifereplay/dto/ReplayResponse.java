package com.suhana.lifereplay.dto;

import java.time.LocalDate;

public record ReplayResponse(
        Long activityId,
        String activityName,
        LocalDate date,
        Integer plannedMinutes,
        Integer actualMinutes,
        Integer differenceMinutes,
        Double completionPercentage
) {
}