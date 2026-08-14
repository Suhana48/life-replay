package com.suhana.lifereplay.dto;

import lombok.AllArgsConstructor;
import lombok.Getter;

import java.time.LocalDateTime;

@Getter
@AllArgsConstructor
public class ActivityResponse {

    private Long id;
    private String name;
    private String description;
    private String category;
    private LocalDateTime createdAt;
}