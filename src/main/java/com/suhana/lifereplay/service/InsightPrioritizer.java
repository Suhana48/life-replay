package com.suhana.lifereplay.service;

import com.suhana.lifereplay.dto.InsightResponse;
import org.springframework.stereotype.Service;

import java.util.Comparator;
import java.util.List;
import java.util.Map;

@Service
public class InsightPrioritizer {

    private static final Map<String, Integer> TYPE_PRIORITY = Map.of(
            "PERFORMANCE", 1,
            "RECURRING_PATTERN", 2,
            "TARGET_RECOMMENDATION", 3,
            "SMART_TARGET", 4,
            "ACTIVITY_GAP", 5,
            "NEEDS_ATTENTION", 6,
            "STRONG_ACTIVITY", 7
    );

    public List<InsightResponse> prioritize(
            List<InsightResponse> insights) {

        return insights.stream()
                .sorted(
                        Comparator
                                .comparingInt(
                                        (InsightResponse insight) ->
                                                TYPE_PRIORITY.getOrDefault(
                                                        insight.type(),
                                                        99
                                                )
                                )
                                .thenComparingInt(
                                        InsightResponse::priority
                                )
                )
                .limit(5)
                .toList();
    }
}