package com.suhana.lifereplay.controller;

import com.suhana.lifereplay.dto.ActivityResponse;
import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.UserRepository;
import com.suhana.lifereplay.service.ActivityService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/activities")
@RequiredArgsConstructor
public class ActivityController {

    private final ActivityService activityService;
    private final UserRepository userRepository;

    @PostMapping
    public ResponseEntity<ActivityResponse> createActivity(
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam String category,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Activity activity = activityService.createActivity(
                name,
                description,
                category,
                user
        );

        ActivityResponse response = new ActivityResponse(
                activity.getId(),
                activity.getName(),
                activity.getDescription(),
                activity.getCategory(),
                activity.getCreatedAt()
        );

        return ResponseEntity
                .status(HttpStatus.CREATED)
                .body(response);
    }

    @GetMapping
    public ResponseEntity<List<ActivityResponse>> getMyActivities(
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        List<ActivityResponse> responses =
                activityService.getUserActivities(user)
                        .stream()
                        .map(activity -> new ActivityResponse(
                                activity.getId(),
                                activity.getName(),
                                activity.getDescription(),
                                activity.getCategory(),
                                activity.getCreatedAt()
                        ))
                        .toList();

        return ResponseEntity.ok(responses);
    }

    @PutMapping("/{id}")
    public ResponseEntity<ActivityResponse> updateActivity(
            @PathVariable Long id,
            @RequestParam String name,
            @RequestParam(required = false) String description,
            @RequestParam String category,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        Activity activity = activityService.updateActivity(
                id,
                name,
                description,
                category,
                user
        );

        ActivityResponse response = new ActivityResponse(
                activity.getId(),
                activity.getName(),
                activity.getDescription(),
                activity.getCategory(),
                activity.getCreatedAt()
        );
        return ResponseEntity.ok(response);
    }
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteActivity(
            @PathVariable Long id,
            Authentication authentication) {

        String email = authentication.getName();

        User user = userRepository.findByEmail(email)
                .orElseThrow(() ->
                        new IllegalArgumentException("User not found"));

        activityService.deleteActivity(id, user);

        return ResponseEntity.noContent().build();
    }
}