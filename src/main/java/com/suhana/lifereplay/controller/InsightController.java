package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.InsightResponse;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.UserRepository;
import com.suhana.lifereplay.service.InsightService;
import lombok.RequiredArgsConstructor;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/insights")
@RequiredArgsConstructor
public class InsightController {

    private final InsightService insightService;
    private final UserRepository userRepository;

    @GetMapping
    public List<InsightResponse> getInsights(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return insightService.getInsights(
                startDate,
                endDate,
                user
        );
    }
}