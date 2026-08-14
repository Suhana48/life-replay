package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.MonthlyReplayResponse;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.UserRepository;
import com.suhana.lifereplay.service.MonthlyReplayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/replay/monthly")
@RequiredArgsConstructor
public class MonthlyReplayController {

    private final MonthlyReplayService monthlyReplayService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<MonthlyReplayResponse> getMonthlyReplay(
            @RequestParam LocalDate startDate,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        MonthlyReplayResponse response =
                monthlyReplayService.getMonthlyReplay(
                        startDate,
                        user
                );

        return ResponseEntity.ok(response);
    }
}