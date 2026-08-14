package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.ReplayResponse;
import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.ActivityRepository;
import com.suhana.lifereplay.repository.UserRepository;
import com.suhana.lifereplay.service.ReplayService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/api/replay")
@RequiredArgsConstructor
public class ReplayController {

    private final ReplayService replayService;
    private final ActivityRepository activityRepository;
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<ReplayResponse> getReplay(
            @RequestParam Long activityId,
            @RequestParam LocalDate date,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Activity activity = activityRepository
                .findByIdAndUser(activityId, user)
                .orElseThrow(() ->
                        new IllegalArgumentException("Activity not found"));

        return ResponseEntity.ok(
                replayService.getReplay(activity, date)
        );
    }
}