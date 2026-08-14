package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.DailyPlanRequest;
import com.suhana.lifereplay.dto.DailyPlanResponse;
import com.suhana.lifereplay.dto.DailyPlanUpdateRequest;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.UserRepository;
import com.suhana.lifereplay.service.DailyPlanService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/daily-plans")
@RequiredArgsConstructor
public class DailyPlanController {

    private final DailyPlanService dailyPlanService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<DailyPlanResponse> createPlan(
            @Valid @RequestBody DailyPlanRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        DailyPlanResponse response =
                dailyPlanService.createPlan(request, user);

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<DailyPlanResponse>> getPlansForDate(
            @RequestParam LocalDate date,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        return ResponseEntity.ok(
                dailyPlanService.getPlansForDate(date, user)
        );
    }
    @PutMapping("/{id}")
    public ResponseEntity<DailyPlanResponse> updatePlan(
            @PathVariable Long id,
            @Valid @RequestBody DailyPlanUpdateRequest request,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "User not found"
                        ));

        DailyPlanResponse response =
                dailyPlanService.updatePlan(
                        id,
                        request,
                        user
                );

        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePlan(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        dailyPlanService.deletePlan(id, user);

        return ResponseEntity.noContent().build();
    }
}