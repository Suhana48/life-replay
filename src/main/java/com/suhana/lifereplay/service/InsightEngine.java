package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.InsightResponse;
import com.suhana.lifereplay.entity.DailyActual;
import com.suhana.lifereplay.entity.DailyPlan;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

@Service
@RequiredArgsConstructor
public class InsightEngine {

    public List<InsightResponse> analyze(
            List<DailyPlan> plans,
            List<DailyActual> actuals) {

        List<InsightResponse> insights = new ArrayList<>();
        Set<Long> processedActivities = new HashSet<>();

        if (plans.isEmpty()) {

            insights.add(new InsightResponse(
                    "NO_DATA",
                    "Not enough data yet",
                    "There are no planned activities in this period.",
                    "Start planning your activities to unlock personalized insights.",
                    3
            ));

            return insights;
        }

        // ==========================================
        // OVERALL PERFORMANCE
        // ==========================================

        int totalPlanned = plans.stream()
                .mapToInt(DailyPlan::getPlannedMinutes)
                .sum();

        int totalActual = actuals.stream()
                .mapToInt(DailyActual::getActualMinutes)
                .sum();

        double completionPercentage =
                totalPlanned > 0
                        ? (totalActual * 100.0) / totalPlanned
                        : 0;

        if (completionPercentage < 70) {

            insights.add(new InsightResponse(
                    "PERFORMANCE",
                    "You're falling behind your plan",
                    String.format(
                            "You completed %.1f%% of your planned time.",
                            completionPercentage
                    ),
                    "Consider reducing your daily targets or protecting more focused time.",
                    1
            ));

        } else if (completionPercentage >= 90) {

            insights.add(new InsightResponse(
                    "PERFORMANCE",
                    "You're staying close to your plan",
                    String.format(
                            "You completed %.1f%% of your planned time.",
                            completionPercentage
                    ),
                    "Your current planning level looks realistic. Keep going.",
                    3
            ));

        } else {

            insights.add(new InsightResponse(
                    "PERFORMANCE",
                    "You're making progress",
                    String.format(
                            "You completed %.1f%% of your planned time.",
                            completionPercentage
                    ),
                    "Focus on the activities with the largest gaps.",
                    2
            ));
        }

        // ==========================================
        // ACTIVITY LEVEL INSIGHTS
        // ==========================================

        for (DailyPlan plan : plans) {

            int planned = plan.getPlannedMinutes();

            DailyActual matchingActual = actuals.stream()
                    .filter(actual ->
                            actual.getActivity().getId()
                                    .equals(plan.getActivity().getId())
                                    &&
                                    actual.getDate().equals(plan.getDate())
                    )
                    .findFirst()
                    .orElse(null);

            // No actual recorded
            if (matchingActual == null) {

                insights.add(new InsightResponse(
                        "NEEDS_ATTENTION",
                        plan.getActivity().getName()
                                + " has no recorded progress",
                        "You planned "
                                + planned
                                + " minutes but no actual time was recorded.",
                        "Record your actual time at the end of the day.",
                        1
                ));

                continue;
            }

            int actual = matchingActual.getActualMinutes();

            double activityCompletion =
                    planned > 0
                            ? (actual * 100.0) / planned
                            : 0;

            // ==========================================
            // ACTIVITY PERFORMANCE
            // ==========================================

            if (activityCompletion < 70) {

                insights.add(new InsightResponse(
                        "ACTIVITY_GAP",
                        plan.getActivity().getName()
                                + " needs attention",
                        String.format(
                                "You completed %.1f%% of your planned time (%d/%d minutes).",
                                activityCompletion,
                                actual,
                                planned
                        ),
                        "Try lowering the target slightly or giving this activity a protected time slot.",
                        1
                ));

            } else if (activityCompletion >= 100) {

                insights.add(new InsightResponse(
                        "STRONG_ACTIVITY",
                        plan.getActivity().getName()
                                + " is going strong",
                        String.format(
                                "You completed %d of %d planned minutes.",
                                actual,
                                planned
                        ),
                        "This target appears achievable. Consider maintaining it consistently.",
                        3
                ));
            }

            // ==========================================
            // SMART TARGET REALISM
            // ==========================================

            if (planned <= 0) {
                continue;
            }

            if (activityCompletion < 60) {

                insights.add(new InsightResponse(
                        "SMART_TARGET",
                        plan.getActivity().getName()
                                + " target may be too ambitious",
                        String.format(
                                "You completed only %.1f%% of the planned time (%d/%d minutes).",
                                activityCompletion,
                                actual,
                                planned
                        ),
                        "Consider setting a smaller target and gradually increasing it.",
                        2
                ));

            } else if (activityCompletion >= 120) {

                insights.add(new InsightResponse(
                        "SMART_TARGET",
                        plan.getActivity().getName()
                                + " target may be too low",
                        String.format(
                                "You completed %.1f%% of the planned time (%d/%d minutes).",
                                activityCompletion,
                                actual,
                                planned
                        ),
                        "Consider increasing this activity's target slightly.",
                        2
                ));
            }
        }

        // ==========================================
        // MULTI-DAY PATTERN INSIGHTS
        // ==========================================

        for (DailyPlan currentPlan : plans) {

            Long activityId = currentPlan.getActivity().getId();

            if (!processedActivities.add(activityId)) {
                continue;
            }

            String activityName =
                    currentPlan.getActivity().getName();

            List<DailyPlan> activityPlans = plans.stream()
                    .filter(plan ->
                            plan.getActivity().getId().equals(activityId)
                    )
                    .toList();

            if (activityPlans.size() < 2) {
                continue;
            }

            int activityPlanned = activityPlans.stream()
                    .mapToInt(DailyPlan::getPlannedMinutes)
                    .sum();

            int activityActual = actuals.stream()
                    .filter(actual ->
                            actual.getActivity().getId().equals(activityId)
                    )
                    .mapToInt(DailyActual::getActualMinutes)
                    .sum();

            double averageCompletion =
                    activityPlanned > 0
                            ? (activityActual * 100.0) / activityPlanned
                            : 0;

            // ==========================================
            // RECURRING PLANNING GAP
            // ==========================================

            if (averageCompletion < 70) {

                insights.add(new InsightResponse(
                        "RECURRING_PATTERN",
                        activityName
                                + " shows a recurring planning gap",
                        String.format(
                                "Across %d planned days, you completed %.1f%% of the planned time.",
                                activityPlans.size(),
                                averageCompletion
                        ),
                        "Your typical capacity may be lower than the current target. Try reducing the target slightly.",
                        1
                ));

                // ==========================================
                // TARGET RECOMMENDATION
                // ==========================================

                int averageActualMinutes =
                        activityActual / activityPlans.size();

                int suggestedTargetMinutes =
                        (int) Math.round(
                                averageActualMinutes * 1.10
                        );

                insights.add(new InsightResponse(
                        "TARGET_RECOMMENDATION",
                        activityName + " target recommendation",
                        String.format(
                                "You planned an average of %d minutes/day but actually averaged %d minutes/day.",
                                activityPlanned / activityPlans.size(),
                                averageActualMinutes
                        ),
                        "Try setting your target around "
                                + suggestedTargetMinutes
                                + " minutes/day.",
                        2
                ));

            } else if (averageCompletion >= 90) {

                insights.add(new InsightResponse(
                        "RECURRING_PATTERN",
                        activityName
                                + " is consistently on track",
                        String.format(
                                "Across %d planned days, you completed %.1f%% of the planned time.",
                                activityPlans.size(),
                                averageCompletion
                        ),
                        "This target appears realistic. Keep maintaining this level.",
                        3
                ));
            }
        }

        return insights;
    }
}