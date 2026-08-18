package com.suhana.lifereplay.dto;

public record DailyReplayItem(
        Long activityId,
        String activityName,
        Integer plannedMinutes,
        Integer actualMinutes,
        Integer differenceMinutes,
        Double completionPercentage
) {
}