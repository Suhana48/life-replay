package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.DailyActualRequest;
import com.suhana.lifereplay.dto.DailyActualResponse;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.UserRepository;
import com.suhana.lifereplay.service.DailyActualService;
import com.suhana.lifereplay.dto.DailyActualUpdateRequest;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/daily-actuals")
@RequiredArgsConstructor
public class DailyActualController {

    private final DailyActualService dailyActualService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<DailyActualResponse> createActual(
            @Valid @RequestBody DailyActualRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        DailyActualResponse response =
                dailyActualService.createActual(
                        request,
                        user
                );

        return ResponseEntity
                .status(201)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<DailyActualResponse>> getActualsForDate(
            @RequestParam LocalDate date,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        return ResponseEntity.ok(
                dailyActualService.getActualsForDate(
                        date,
                        user
                )
        );
    }
    @PutMapping("/{id}")
    public ResponseEntity<DailyActualResponse> updateActual(
            @PathVariable Long id,
            @Valid @RequestBody DailyActualUpdateRequest request,
            Authentication authentication) {

        User user = getAuthenticatedUser(authentication);

        DailyActualResponse response =
                dailyActualService.updateActual(
                        id,
                        request,
                        user
                );

        return ResponseEntity.ok(response);
    }

    private User getAuthenticatedUser(
            Authentication authentication) {

        return userRepository
                .findByEmail(authentication.getName())
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        ));
    }
}