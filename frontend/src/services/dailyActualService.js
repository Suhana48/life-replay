import api from "./api";

export const createDailyActual = (
    activityId,
    date,
    actualMinutes
) => {
    return api.post("/daily-actuals", {
        activityId,
        date,
        actualMinutes
    });
};

export const getDailyActuals = (date) => {
    return api.get("/daily-actuals", {
        params: {
            date
        }
    });
};
export const updateDailyActual = (
    id,
    actualMinutes
) => {
    return api.put(`/daily-actuals/${id}`, {
        actualMinutes
    });
};

export const deleteDailyActual = (id) => {
    return api.delete(`/daily-actuals/${id}`);
};