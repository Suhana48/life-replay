
package com.suhana.lifereplay.service;
import com.suhana.lifereplay.dto.DailyPlanUpdateRequest;

import com.suhana.lifereplay.dto.DailyPlanRequest;
import com.suhana.lifereplay.dto.DailyPlanResponse;
import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.DailyPlan;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.ActivityRepository;
import com.suhana.lifereplay.repository.DailyPlanRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;


@Service
@RequiredArgsConstructor
public class DailyPlanService {

    private final DailyPlanRepository dailyPlanRepository;
    private final ActivityRepository activityRepository;

    public DailyPlanResponse createPlan(
            DailyPlanRequest request,
            User user) {
        if (request.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "You cannot create a plan for a past date"
            );
        }

        Activity activity = activityRepository
                .findByIdAndUser(request.getActivityId(), user)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Activity not found"
                        ));

        if (dailyPlanRepository
                .findByActivityAndDate(
                        activity,
                        request.getDate()
                )
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Plan already exists for this activity on this date"
            );
        }

        DailyPlan dailyPlan = new DailyPlan();

        dailyPlan.setDate(request.getDate());
        dailyPlan.setPlannedMinutes(request.getPlannedMinutes());
        dailyPlan.setUser(user);
        dailyPlan.setActivity(activity);

        DailyPlan savedPlan =
                dailyPlanRepository.save(dailyPlan);

        return toResponse(savedPlan);
    }

    public List<DailyPlanResponse> getPlansForDate(
            LocalDate date,
            User user) {

        return dailyPlanRepository
                .findByActivity_User_IdAndDate(user.getId(), date)
                .stream()
                .map(this::toResponse)
                .toList();
    }
    public DailyPlanResponse updatePlan(
            Long id,
            DailyPlanUpdateRequest request,
            User user) {

        DailyPlan dailyPlan = dailyPlanRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Daily plan not found"
                        ));

        if (!dailyPlan.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You are not allowed to update this plan"
            );
        }

        if (dailyPlan.getDate().isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "You cannot update a plan for a past date"
            );
        }

        dailyPlan.setPlannedMinutes(
                request.getPlannedMinutes()
        );

        DailyPlan updatedPlan =
                dailyPlanRepository.save(dailyPlan);

        return toResponse(updatedPlan);
    }
    public void deletePlan(Long id, User user) {

        DailyPlan dailyPlan = dailyPlanRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Daily plan not found"
                        ));

        if (!dailyPlan.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You are not allowed to delete this plan"
            );
        }

        dailyPlanRepository.delete(dailyPlan);
    }

    private DailyPlanResponse toResponse(DailyPlan plan) {

        return new DailyPlanResponse(
                plan.getId(),
                plan.getActivity().getId(),
                plan.getActivity().getName(),
                plan.getDate(),
                plan.getPlannedMinutes()
        );
    }
}