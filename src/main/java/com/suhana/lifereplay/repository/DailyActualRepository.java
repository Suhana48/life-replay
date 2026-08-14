package com.suhana.lifereplay.repository;

import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.DailyActual;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface DailyActualRepository
        extends JpaRepository<DailyActual, Long> {

    Optional<DailyActual> findByActivityAndDate(
            Activity activity,
            LocalDate date
    );

    List<DailyActual> findByActivity_User_IdAndDate(
            Long userId,
            LocalDate date
    );

    List<DailyActual> findByActivity_User_IdAndDateBetween(
            Long userId,
            LocalDate startDate,
            LocalDate endDate
    );
}