package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.WeeklyReplayResponse;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.UserRepository;
import com.suhana.lifereplay.service.WeeklyReplayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/replay/weekly")
@RequiredArgsConstructor
public class WeeklyReplayController {

    private final WeeklyReplayService weeklyReplayService;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<WeeklyReplayResponse> getWeeklyReplay(
            @RequestParam LocalDate startDate,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        WeeklyReplayResponse response =
                weeklyReplayService.getWeeklyReplay(
                        startDate,
                        user
                );

        return ResponseEntity.ok(response);
    }
}