package com.suhana.lifereplay.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDate;

@Getter
@AllArgsConstructor
public class DailyPlanResponse {

    private Long id;
    private Long activityId;
    private String activityName;
    private LocalDate date;
    private Integer plannedMinutes;
}