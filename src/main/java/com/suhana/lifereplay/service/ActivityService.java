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
            User user) {

        if (activityRepository.existsByNameAndUser(name, user)) {
            throw new IllegalArgumentException(
                    "Activity already exists"
            );
        }

        Activity activity = new Activity();

        activity.setName(name);
        activity.setDescription(description);
        activity.setUser(user);

        return activityRepository.save(activity);
    }

    public List<Activity> getUserActivities(User user) {
        return activityRepository.findByUser(user);
    }
    public Activity updateActivity(
            Long activityId,
            String name,
            String description,
            User user) {

        Activity activity = activityRepository
                .findByIdAndUser(activityId, user)
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

        return activityRepository.save(activity);
    }
    public void deleteActivity(
            Long activityId,
            User user) {

        Activity activity = activityRepository
                .findByIdAndUser(activityId, user)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Activity not found"
                        ));

        activityRepository.delete(activity);
    }
}