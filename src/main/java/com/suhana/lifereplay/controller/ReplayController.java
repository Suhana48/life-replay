package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.DailyReplayResponse;
import com.suhana.lifereplay.entity.User;
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
    private final UserRepository userRepository;

    @GetMapping
    public ResponseEntity<DailyReplayResponse> getDailyReplay(
            @RequestParam LocalDate date,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        ));

        return ResponseEntity.ok(
                replayService.getDailyReplay(
                        user,
                        date
                )
        );
    }
}