import api from "./api";

export const getDailyReplay = (date) => {
    return api.get("/replay/daily", {
        params: {
            date: date
        }
    });
};