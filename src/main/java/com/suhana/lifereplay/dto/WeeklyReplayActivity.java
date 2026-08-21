package com.suhana.lifereplay.dto;

public record WeeklyReplayActivity(
        Long activityId,
        String activityName,
        int plannedMinutes,
        int actualMinutes,
        int differenceMinutes
) {
}