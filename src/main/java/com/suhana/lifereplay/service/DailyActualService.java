package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.DailyActualRequest;
import com.suhana.lifereplay.dto.DailyActualResponse;
import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.DailyActual;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.ActivityRepository;
import com.suhana.lifereplay.repository.DailyActualRepository;
import com.suhana.lifereplay.dto.DailyActualUpdateRequest;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class DailyActualService {

    private final DailyActualRepository dailyActualRepository;
    private final ActivityRepository activityRepository;

    public DailyActualResponse createActual(
            DailyActualRequest request,
            User user) {

        Activity activity = activityRepository
                .findByIdAndUser(
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

        dailyActualRepository.delete(actual);
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