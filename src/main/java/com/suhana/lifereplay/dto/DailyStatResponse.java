package com.suhana.lifereplay.dto;

import java.time.LocalDate;

public record DailyStatResponse(
        LocalDate date,
        int plannedMinutes,
        int actualMinutes,
        int differenceMinutes,
        double completionPercentage
) {
}