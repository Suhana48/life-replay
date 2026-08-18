package com.suhana.lifereplay.service;

import com.suhana.lifereplay.entity.Activity;
import com.suhana.lifereplay.entity.User;
import com.suhana.lifereplay.repository.ActivityRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class ActivityService {

    private final ActivityRepository activityRepository;

    public Activity createActivity(
            String name,
            String description,
            String category,
            User user)  {

        if (activityRepository.existsByNameAndUser(name, user)) {
            throw new IllegalArgumentException(
                    "Activity already exists"
            );
        }

        Activity activity = new Activity();

        activity.setName(name);
        activity.setDescription(description);
        activity.setCategory(category);
        activity.setUser(user);

        return activityRepository.save(activity);
    }

    public List<Activity> getUserActivities(User user) {
        return activityRepository.findByUserAndActiveTrue(user);
    }
    public Activity updateActivity(
            Long activityId,
            String name,
            String description,
            String category,
            User user) {

        Activity activity = activityRepository
                .findByIdAndUserAndActiveTrue(activityId, user)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Activity not found"
                        ));

        if (!activity.getName().equals(name)
                && activityRepository.existsByNameAndUser(name, user)) {

            throw new IllegalArgumentException(
                    "Activity already exists"
            );
        }

        activity.setName(name);
        activity.setDescription(description);
        activity.setCategory(category);

        return activityRepository.save(activity);
    }
    public void deleteActivity(
            Long activityId,
            User user) {

        Activity activity = activityRepository
                .findByIdAndUserAndActiveTrue(activityId, user)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Activity not found"
                        ));

        activity.setActive(false);

        activityRepository.save(activity);
    }
}