package com.suhana.lifereplay.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
public class DailyActualUpdateRequest {

    @NotNull(message = "Actual minutes are required")
    @Min(
            value = 1,
            message = "Actual minutes must be at least 1"
    )
    @Max(
            value = 1440,
            message = "Actual minutes must not exceed 1440"
    )
    private Integer actualMinutes;
}