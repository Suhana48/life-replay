import api from "./api";

export const getDailyReplay = (date) => {
    return api.get("/replay/daily", {
        params: {
            date: date
        }
    });
};

export const getWeeklyReplay = (startDate) => {
    return api.get("/replay/weekly", {
        params: {
            startDate: startDate
        }
    });
};