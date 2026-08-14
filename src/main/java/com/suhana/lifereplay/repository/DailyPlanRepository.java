package com.suhana.lifereplay.repository;

import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.DailyPlan;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyPlanRepository
        extends JpaRepository<DailyPlan, Long> {

    Optional<DailyPlan> findByActivityAndDate(
            Activity activity,
            LocalDate date
    );

    List<DailyPlan> findByActivity_User_IdAndDate(
            Long userId,
            LocalDate date
    );

    List<DailyPlan> findByActivity_User_IdAndDateBetween(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );
}