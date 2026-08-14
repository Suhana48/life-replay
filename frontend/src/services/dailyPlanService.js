import api from "./api";

export const createDailyPlan = (
    activityId,
    date,
    plannedMinutes
) => {
    return api.post("/daily-plans", {
        activityId,
        date,
        plannedMinutes
    });
};
export const getDailyPlans = (date) => {
    return api.get("/daily-plans", {
        params: {
            date
        }
    });
};
export const updateDailyPlan = (
    id,
    plannedMinutes
) => {
    return api.put(`/daily-plans/${id}`, {
        plannedMinutes
    });
};
export const deleteDailyPlan = (id) => {
    return api.delete(`/daily-plans/${id}`);
};