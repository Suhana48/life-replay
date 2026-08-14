package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.DailyStatResponse;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.UserRepository;
import com.suhana.lifereplay.service.DashboardService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/dashboard")
@RequiredArgsConstructor
public class DashboardController {

    private final DashboardService dashboardService;
    private final UserRepository userRepository;

    @GetMapping("/daily")
    public ResponseEntity<List<DailyStatResponse>> getDailyStats(
            @RequestParam LocalDate startDate,
            @RequestParam LocalDate endDate,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        List<DailyStatResponse> stats =
                dashboardService.getDailyStats(
                        startDate,
                        endDate,
                        user
                );

        return ResponseEntity.ok(stats);
    }
}