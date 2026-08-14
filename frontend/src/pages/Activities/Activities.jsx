import { useEffect, useState } from "react";
import {
    createActivity,
    getActivities,
    updateActivity,
    deleteActivity
} from "../../services/activityService";
import "./Activities.css";

function Activities() {
    const [showForm, setShowForm] = useState(false);
    const [editingActivity, setEditingActivity] = useState(null);
    const [name, setName] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [activities, setActivities] = useState([]);
    useEffect(() => {
        const loadActivities = async () => {
            try {
                const response = await getActivities();
                setActivities(response.data);
            } catch (error) {
                console.error("Failed to load activities:", error);
            }
        };

        loadActivities();
    }, []);
    const handleCreateActivity = async () => {
        try {
            await createActivity(name, description, category);

            setName("");
            setDescription("");
            setCategory("");
            setShowForm(false);

            alert("Activity created successfully.");
        } catch (error) {
            console.error("Failed to create activity:", error);

            alert("Unable to create activity.");
        }
    };

const handleUpdateActivity = async () => {
    try {
        await updateActivity(
            editingActivity.id,
            name,
            description,
            category
        );

        setActivities((currentActivities) =>
            currentActivities.map((activity) =>
                activity.id === editingActivity.id
                    ? {
                          ...activity,
                          name,
                          description,
                          category,
                      }
                    : activity
            )
        );

        setName("");
        setDescription("");
        setCategory("");
        setEditingActivity(null);
        setShowForm(false);

        alert("Activity updated successfully.");
    } catch (error) {
        console.error("Failed to update activity:", error);

        alert("Unable to update activity.");
    }
};
const handleDeleteActivity = async (activityId) => {
    try {
        await deleteActivity(activityId);

        setActivities((currentActivities) =>
            currentActivities.filter(
                (activity) => activity.id !== activityId
            )
        );

        alert("Activity deleted successfully.");
    } catch (error) {
        console.error("Failed to delete activity:", error);

        alert("Unable to delete activity.");
    }
};
    return (
        <section className="activities-page">

            {/* Page heading */}
            <div className="activities-heading">
                <div>
                    <p className="activities-eyebrow">
                        YOUR LIFE
                    </p>

                    <h1>
                        Activities
                    </h1>

                    <p className="activities-description">
                        Create the activities that make up your everyday life.
                    </p>
                </div>

                <button
                    type="button"
                    className="activities-primary-button"
                    onClick={() => setShowForm(true)}
                >
                    + Add activity
                </button>
            </div>
            {showForm && (
                <div className="activity-form">
                    <h2> {editingActivity ? "Edit activity" : "Add a new activity"}</h2>

                    <p>
                        {editingActivity
                               ? "Update the details of this activity."
                               : "Create an activity you want Life Replay to track."
                           }
                    </p>

                    <div className="activity-form-field">
                        <label htmlFor="activity-name">
                            Activity name
                        </label>

                        <input
                            id="activity-name"
                            type="text"
                            placeholder="e.g. Studying"
                            value={name}
                            onChange={(event) => setName(event.target.value)}
                        />
                    </div>
                    <div className="activity-form-field">
                        <label htmlFor="activity-description">
                            Description
                        </label>

                       <textarea
                           id="activity-description"
                           placeholder="e.g. DSA, Java, interview preparation..."
                           rows="3"
                           value={description}
                           onChange={(event) => setDescription(event.target.value)}
                       />
                    </div>
                    <div className="activity-form-field">
                        <label htmlFor="activity-category">
                            Category
                        </label>

                        <input
                            id="activity-category"
                            type="text"
                            placeholder="e.g. Study"
                            value={category}
                            onChange={(event) => setCategory(event.target.value)}
                        />
                    </div>

                    <div className="activity-form-actions">
                        <button
                            type="button"
                            onClick={() => setShowForm(false)}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className="activities-primary-button"
                            onClick={
                                editingActivity
                                    ? handleUpdateActivity
                                    : handleCreateActivity
                            }
                        >
                            {editingActivity ? "Update activity" : "Create activity"}
                        </button>
                    </div>
                </div>
            )}

            {/* Activity statistics */}
            <div className="activities-summary">

                <div className="activities-stat-card">
                    <span>
                        Total activities
                    </span>

                    <strong>
                        {activities.length}
                    </strong>
                </div>

                <div className="activities-stat-card">
                    <span>
                        Active
                    </span>

                    <strong>
                        {activities.length}
                    </strong>
                </div>

                <div className="activities-stat-card">
                    <span>
                        Categories
                    </span>

                    <strong>
                        {new Set(
                            activities
                                .map((activity) => activity.category?.trim())
                                .filter(Boolean)
                        ).size}
                    </strong>
                </div>

            </div>


            {/* Activity list */}
            <section className="activities-panel">

                <div className="activities-panel-header">
                    <div>
                        <p className="activities-panel-eyebrow">
                            ACTIVITY LIBRARY
                        </p>

                        <h2>
                            Your activities
                        </h2>
                    </div>
                </div>


                {/* Empty state */}
                {activities.length === 0 ? (
                    <div className="activities-empty-state">

                        <div className="activities-empty-icon">
                            +
                        </div>

                        <h3>
                            No activities yet
                        </h3>

                        <p>
                            Add things like studying, coding, exercise,
                            reading, sleep, or anything else you want
                            Life Replay to track.
                        </p>

                        <button
                            type="button"
                            className="activities-primary-button"
                            onClick={() => setShowForm(true)}
                        >
                            Create your first activity
                        </button>

                    </div>
                ) : (
                    <div className="activities-list">

                        {activities.map((activity) => (
                            <div
                                className="activity-card"
                                key={activity.id}
                            >

                                <div>
                                    <h3>
                                        {activity.name}
                                    </h3>

                                    {activity.description && (
                                        <p>
                                            {activity.description}
                                        </p>
                                    )}

                                    {activity.category && (
                                        <span className="activity-category">
                                            {activity.category}
                                        </span>
                                    )}
                                </div>
                                <div className="activity-card-actions">
                                    <button
                                        type="button"
                                        onClick={() => {
                                            setEditingActivity(activity);
                                            setName(activity.name);
                                            setDescription(activity.description || "");
                                            setCategory(activity.category || "");
                                            setShowForm(true);
                                        }}
                                    >
                                        Edit
                                    </button>

                                    <button
                                        type="button"
                                        onClick={() => {
                                            if (
                                                window.confirm(
                                                    `Are you sure you want to delete "${activity.name}"?`
                                                )
                                            ) {
                                                handleDeleteActivity(activity.id);
                                            }
                                        }}
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        ))}

                    </div>
                )}

            </section>

        </section>
    );
}

export default Activities;