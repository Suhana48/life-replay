package com.suhana.lifereplay.dto;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDate;

@Getter
@Setter
@NoArgsConstructor
public class DailyActualResponse {

    private Long id;
    private Long activityId;
    private String activityName;
    private LocalDate date;
    private Integer actualMinutes;

    public DailyActualResponse(
            Long id,
            Long activityId,
            String activityName,
            LocalDate date,
            Integer actualMinutes) {

        this.id = id;
        this.activityId = activityId;
        this.activityName = activityName;
        this.date = date;
        this.actualMinutes = actualMinutes;
    }
}