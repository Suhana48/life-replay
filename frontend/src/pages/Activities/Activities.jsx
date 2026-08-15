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
            const response = await createActivity(
                name,
                description,
                category
            );

            setActivities((currentActivities) => [
                ...currentActivities,
                response.data
            ]);

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

    const openCreateForm = () => {
        setEditingActivity(null);
        setName("");
        setDescription("");
        setCategory("");
        setShowForm(true);
    };

    const openEditForm = (activity) => {
        setEditingActivity(activity);
        setName(activity.name);
        setDescription(activity.description || "");
        setCategory(activity.category || "");
        setShowForm(true);
    };

    const categoryCount = new Set(
        activities
            .map((activity) => activity.category?.trim())
            .filter(Boolean)
    ).size;

    return (
        <section className="activities-page">

            {/* =========================================
                PAGE HEADER
            ========================================= */}

            <div className="activities-heading">

                <div>
                    <p className="activities-eyebrow">
                        LIFE REPLAY / ACTIVITIES
                    </p>

                    <h1>
                        Make time for{" "}
                        <span>what matters.</span>
                    </h1>

                    <p className="activities-description">
                        Build the activities that make up your everyday life.
                    </p>
                </div>

                <button
                    type="button"
                    className="activities-primary-button"
                    onClick={openCreateForm}
                >
                    + Add activity
                </button>

            </div>


            {/* =========================================
                ADD / EDIT FORM
            ========================================= */}

            {showForm && (
                <div className="activity-form">

                    <h2>
                        {editingActivity
                            ? "Edit activity"
                            : "Add a new activity"}
                    </h2>

                    <p>
                        {editingActivity
                            ? "Update the details of this activity."
                            : "Create something you want Life Replay to track."}
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
                            onChange={(event) =>
                                setName(event.target.value)
                            }
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
                            onChange={(event) =>
                                setDescription(event.target.value)
                            }
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
                            onChange={(event) =>
                                setCategory(event.target.value)
                            }
                        />

                    </div>

                    <div className="activity-form-actions">

                        <button
                            type="button"
                            onClick={() => {
                                setShowForm(false);
                                setEditingActivity(null);
                            }}
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
                            {editingActivity
                                ? "Update activity"
                                : "Create activity"}
                        </button>

                    </div>

                </div>
            )}


            {/* =========================================
                SUMMARY CARD
            ========================================= */}

            <section className="activities-overview">

                <div className="activities-overview-main">

                    <p>
                        YOUR ACTIVITIES
                    </p>

                    <h2>
                        Your time,
                        <br />
                        your choices.
                    </h2>

                </div>

                <div className="activities-overview-stats">

                    <div>
                        <strong>
                            {String(activities.length).padStart(2, "0")}
                        </strong>

                        <span>
                            ACTIVITIES
                        </span>
                    </div>

                    <div>
                        <strong>
                            {String(categoryCount).padStart(2, "0")}
                        </strong>

                        <span>
                            CATEGORIES
                        </span>
                    </div>

                </div>

            </section>


            {/* =========================================
                YOUR ACTIVITIES
            ========================================= */}

            <section className="activities-content">

                <div className="activities-content-header">

                    <div>
                        <p className="activities-panel-eyebrow">
                            YOUR LIBRARY
                        </p>

                        <h2>
                            Your activities
                        </h2>
                    </div>

                    <span>
                        {activities.length === 1
                            ? "1 activity"
                            : `${activities.length} activities`}
                    </span>

                </div>


                {activities.length === 0 ? (

                    <div className="activities-empty-state">

                        <div className="activities-empty-icon">
                            +
                        </div>

                        <h3>
                            Nothing here yet.
                        </h3>

                        <p>
                            Add the things you want to make time for —
                            studying, coding, running, reading, music,
                            or anything else that matters to you.
                        </p>

                        <button
                            type="button"
                            className="activities-primary-button"
                            onClick={openCreateForm}
                        >
                            Create your first activity
                        </button>

                    </div>

                ) : (

                    <div className="activities-grid">

                        {activities.map((activity, index) => (

                            <article
                                className="activity-card"
                                key={activity.id}
                            >

                                <div className="activity-card-top">

                                    <span className="activity-number">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>

                                    <div className="activity-card-actions">

                                        <button
                                            type="button"
                                            onClick={() =>
                                                openEditForm(activity)
                                            }
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
                                                    handleDeleteActivity(
                                                        activity.id
                                                    );
                                                }

                                            }}
                                        >
                                            Delete
                                        </button>

                                    </div>

                                </div>


                                <div className="activity-card-content">

                                    <h3>
                                        {activity.name}
                                    </h3>

                                    <p>
                                        {activity.description ||
                                            "Something worth making time for."}
                                    </p>

                                    {activity.category && (
                                        <span className="activity-category">
                                            {activity.category}
                                        </span>
                                    )}

                                </div>

                            </article>

                        ))}


                        {/* ADD ACTIVITY CARD */}

                        <button
                            type="button"
                            className="activity-add-card"
                            onClick={openCreateForm}
                        >

                            <span className="activity-add-icon">
                                +
                            </span>

                            <strong>
                                Add activity
                            </strong>

                            <p>
                                Make room for something that matters.
                            </p>

                        </button>

                    </div>

                )}

            </section>

        </section>
    );
}

export default Activities;