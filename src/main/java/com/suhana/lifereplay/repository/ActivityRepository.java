package com.suhana.lifereplay.repository;

import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface ActivityRepository extends JpaRepository<Activity, Long> {

    List<Activity> findByUserAndActiveTrue(User user);

    Optional<Activity> findByIdAndUserAndActiveTrue(
            Long id,
            User user
    );

    boolean existsByNameAndUser(String name, User user);
}