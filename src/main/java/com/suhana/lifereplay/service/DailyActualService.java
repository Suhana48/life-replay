package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.DailyActualRequest;
import com.suhana.lifereplay.dto.DailyActualResponse;
import com.suhana.lifereplay.dto.DailyActualUpdateRequest;
import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.DailyActual;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.ActivityRepository;
import com.suhana.lifereplay.repository.DailyActualRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.ZoneId;
import java.time.ZonedDateTime;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyActualService {

    private static final ZoneId APP_ZONE =
            ZoneId.of("Asia/Kolkata");

    private final DailyActualRepository dailyActualRepository;
    private final ActivityRepository activityRepository;

    public DailyActualResponse createActual(
            DailyActualRequest request,
            User user) {

        if (!isActualDateOpen(request.getDate())) {
            throw new IllegalArgumentException(
                    "Actual time cannot be recorded for this date"
            );
        }

        Activity activity = activityRepository
                .findByIdAndUserAndActiveTrue(
                        request.getActivityId(),
                        user
                )
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Activity not found"
                        ));

        if (dailyActualRepository
                .findByActivityAndDate(
                        activity,
                        request.getDate()
                )
                .isPresent()) {

            throw new IllegalArgumentException(
                    "Actual time already exists for this activity on this date"
            );
        }

        DailyActual dailyActual = new DailyActual();

        dailyActual.setDate(request.getDate());
        dailyActual.setActualMinutes(
                request.getActualMinutes()
        );
        dailyActual.setUser(user);
        dailyActual.setActivity(activity);

        DailyActual savedActual =
                dailyActualRepository.save(dailyActual);

        return toResponse(savedActual);
    }

    public List<DailyActualResponse> getActualsForDate(
            LocalDate date,
            User user) {

        return dailyActualRepository
                .findByActivity_User_IdAndDate(
                        user.getId(),
                        date
                )
                .stream()
                .map(this::toResponse)
                .toList();
    }

    public DailyActualResponse updateActual(
            Long id,
            DailyActualUpdateRequest request,
            User user) {

        DailyActual actual = dailyActualRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Actual time not found"
                        ));

        if (!actual.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You are not allowed to update this actual time"
            );
        }

        if (!isActualDateOpen(actual.getDate())) {
            throw new IllegalArgumentException(
                    "Actual time cannot be updated for this date"
            );
        }

        actual.setActualMinutes(
                request.getActualMinutes()
        );

        DailyActual updatedActual =
                dailyActualRepository.save(actual);

        return toResponse(updatedActual);
    }

    public void deleteActual(
            Long id,
            User user) {

        DailyActual actual = dailyActualRepository
                .findById(id)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Actual time not found"
                        ));

        if (!actual.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException(
                    "You are not allowed to delete this actual time"
            );
        }

        // Use the same 5 AM grace-period rule as create and update
        if (!isActualDateOpen(actual.getDate())) {
            throw new IllegalArgumentException(
                    "You cannot delete actual time from a past date"
            );
        }

        dailyActualRepository.delete(actual);
    }

    private boolean isActualDateOpen(LocalDate date) {

        ZonedDateTime now =
                ZonedDateTime.now(APP_ZONE);

        LocalDate today =
                now.toLocalDate();

        // Future dates are not open for actual time
        if (date.isAfter(today)) {
            return false;
        }

        // Today is always open
        if (date.equals(today)) {
            return true;
        }

        // Past dates remain open until 5:00 AM
        // of the following day
        ZonedDateTime closingTime =
                date.plusDays(1)
                        .atTime(5, 0)
                        .atZone(APP_ZONE);

        return now.isBefore(closingTime);
    }

    private DailyActualResponse toResponse(
            DailyActual actual) {

        return new DailyActualResponse(
                actual.getId(),
                actual.getActivity().getId(),
                actual.getActivity().getName(),
                actual.getDate(),
                actual.getActualMinutes()
        );
    }
}