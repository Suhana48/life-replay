package com.suhana.lifereplay.dto;

import java.time.LocalDate;

public record WeeklyReplayDay(
        LocalDate date,
        int plannedMinutes,
        int actualMinutes,
        int differenceMinutes,
        double completionPercentage
) {
}