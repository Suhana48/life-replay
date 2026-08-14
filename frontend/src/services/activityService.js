import api from "./api";

export const createActivity = (name, description, category) => {
    const params = new URLSearchParams();

    params.append("name", name);

    if (description?.trim()) {
        params.append("description", description);
    }
    if (category?.trim()) {
        params.append("category", category);
    }

    return api.post("/activities", params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

export const getActivities = () => {
    return api.get("/activities");
};

export const updateActivity = (id, name, description, category) => {
    const params = new URLSearchParams();

    params.append("name", name);

    if (description?.trim()) {
        params.append("description", description);
    }
    if (category?.trim()) {
        params.append("category", category);
    }

    return api.put(`/activities/${id}`, params, {
        headers: {
            "Content-Type": "application/x-www-form-urlencoded",
        },
    });
};

export const deleteActivity = (id) => {
    return api.delete(`/activities/${id}`);
};