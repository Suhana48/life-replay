package com.suhana.lifereplay.dto;

public record InsightResponse(
        String type,
        String title,
        String message,
        String suggestion,
        Integer priority
) {
}