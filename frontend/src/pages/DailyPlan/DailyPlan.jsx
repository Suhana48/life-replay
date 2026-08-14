import { useEffect, useState } from "react";
import {
    getDailyPlans,
    createDailyPlan,
    updateDailyPlan,
    deleteDailyPlan
} from "../../services/dailyPlanService";
import { getActivities } from "../../services/activityService";
import "./DailyPlan.css";

function DailyPlan() {
    const today = new Date().toISOString().split("T")[0];

    const [selectedDate, setSelectedDate] = useState(today);

    const [plans, setPlans] = useState([]);
    const [activities, setActivities] = useState([]);

    const [selectedActivityId, setSelectedActivityId] = useState("");
    const [plannedMinutes, setPlannedMinutes] = useState("");

    const [showPlanForm, setShowPlanForm] = useState(false);

    const [editingPlanId, setEditingPlanId] = useState(null);
    const [editPlannedMinutes, setEditPlannedMinutes] = useState("");

    const [loading, setLoading] = useState(false);

    const isPastDate = selectedDate < today;

    const totalPlannedMinutes = plans.reduce(
        (total, plan) => total + plan.plannedMinutes,
        0
    );

    const formatMinutes = (minutes) => {
        if (minutes < 60) {
            return `${minutes} min`;
        }

        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${remainingMinutes}m`;
    };

    const formatDate = (date) => {
        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric"
            }
        );
    };

    const loadPlans = async () => {
        try {
            setLoading(true);

            const response = await getDailyPlans(selectedDate);

            setPlans(response.data);
        } catch (error) {
            console.error(
                "Failed to load daily plans:",
                error
            );
        } finally {
            setLoading(false);
        }
    };

    const loadActivities = async () => {
        try {
            const response = await getActivities();

            setActivities(response.data);
        } catch (error) {
            console.error(
                "Failed to load activities:",
                error
            );
        }
    };

    useEffect(() => {
        loadPlans();
    }, [selectedDate]);

    useEffect(() => {
        loadActivities();
    }, []);

    const handleDateChange = (event) => {
        const date = event.target.value;

        setSelectedDate(date);

        setShowPlanForm(false);
        setEditingPlanId(null);
        setEditPlannedMinutes("");
    };

    const handleCreatePlan = async () => {
        if (!selectedActivityId) {
            alert("Please select an activity.");
            return;
        }

        if (
            !plannedMinutes ||
            Number(plannedMinutes) < 1 ||
            Number(plannedMinutes) > 1440
        ) {
            alert(
                "Planned time must be between 1 and 1440 minutes."
            );
            return;
        }

        try {
            await createDailyPlan(
                Number(selectedActivityId),
                selectedDate,
                Number(plannedMinutes)
            );

            await loadPlans();

            setSelectedActivityId("");
            setPlannedMinutes("");
            setShowPlanForm(false);

            alert("Activity added to your plan.");
        } catch (error) {
            console.error(
                "Failed to create daily plan:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to add activity to your plan."
            );
        }
    };

    const handleUpdatePlan = async (planId) => {
        if (
            !editPlannedMinutes ||
            Number(editPlannedMinutes) < 1 ||
            Number(editPlannedMinutes) > 1440
        ) {
            alert(
                "Planned time must be between 1 and 1440 minutes."
            );
            return;
        }

        try {
            await updateDailyPlan(
                planId,
                Number(editPlannedMinutes)
            );

            await loadPlans();

            setEditingPlanId(null);
            setEditPlannedMinutes("");

            alert("Plan updated successfully.");
        } catch (error) {
            console.error(
                "Failed to update daily plan:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to update plan."
            );
        }
    };

    const handleDeletePlan = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this planned activity?"
        );

        if (!confirmed) {
            return;
        }

        try {
            await deleteDailyPlan(id);

            await loadPlans();

            alert("Planned activity deleted.");
        } catch (error) {
            console.error(
                "Failed to delete daily plan:",
                error
            );

            alert(
                error.response?.data?.message ||
                "Unable to delete planned activity."
            );
        }
    };

    return (
        <section className="daily-plan-page">

            {/* Header */}

            <div className="daily-plan-header">

                <div>
                    <p className="daily-plan-eyebrow">
                        DAILY PLANNING
                    </p>

                    <h1>
                        Plan your day.
                    </h1>

                    <p className="daily-plan-description">
                        Decide where your time should go before
                        the day begins.
                    </p>
                </div>

                <div className="daily-plan-date-control">
                    <span>
                        Planning for
                    </span>

                    <input
                        id="plan-date"
                        type="date"
                        value={selectedDate}
                        onChange={handleDateChange}
                    />
                </div>

            </div>

            {/* Date + Summary */}

            <div className="daily-plan-overview">

                <div>
                    <p className="daily-plan-date-label">
                        {formatDate(selectedDate)}
                    </p>

                    <p className="daily-plan-status">
                        {isPastDate
                            ? "Viewing a completed day"
                            : selectedDate === today
                                ? "Planning for today"
                                : "Planning ahead"}
                    </p>
                </div>

                <div className="daily-plan-summary">

                    <div>
                        <span>
                            Activities
                        </span>

                        <strong>
                            {plans.length}
                        </strong>
                    </div>

                    <div className="daily-plan-summary-divider" />

                    <div>
                        <span>
                            Planned time
                        </span>

                        <strong>
                            {formatMinutes(
                                totalPlannedMinutes
                            )}
                        </strong>
                    </div>

                </div>

            </div>

            {/* Add Activity */}

            {!isPastDate && (
                <div className="daily-plan-add-section">

                    {!showPlanForm ? (
                        <button
                            type="button"
                            className="daily-plan-add-button"
                            onClick={() =>
                                setShowPlanForm(true)
                            }
                        >
                            <span>+</span>
                            Add activity to your day
                        </button>
                    ) : (
                        <div className="daily-plan-form">

                            <div className="daily-plan-form-header">
                                <div>
                                    <p>
                                        BUILD YOUR DAY
                                    </p>

                                    <h2>
                                        Add planned activity
                                    </h2>
                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowPlanForm(false);
                                        setSelectedActivityId("");
                                        setPlannedMinutes("");
                                    }}
                                    className="daily-plan-close-button"
                                >
                                    ×
                                </button>
                            </div>

                            <div className="daily-plan-form-grid">

                                <div className="daily-plan-field">
                                    <label htmlFor="plan-activity">
                                        Activity
                                    </label>

                                    <select
                                        id="plan-activity"
                                        value={selectedActivityId}
                                        onChange={(event) =>
                                            setSelectedActivityId(
                                                event.target.value
                                            )
                                        }
                                    >
                                        <option value="">
                                            Select an activity
                                        </option>

                                        {activities.map(
                                            (activity) => (
                                                <option
                                                    key={
                                                        activity.id
                                                    }
                                                    value={
                                                        activity.id
                                                    }
                                                >
                                                    {activity.name}
                                                </option>
                                            )
                                        )}
                                    </select>
                                </div>

                                <div className="daily-plan-field">
                                    <label htmlFor="planned-minutes">
                                        Planned time
                                    </label>

                                    <div className="daily-plan-minute-input">
                                        <input
                                            id="planned-minutes"
                                            type="number"
                                            min="1"
                                            max="1440"
                                            placeholder="60"
                                            value={
                                                plannedMinutes
                                            }
                                            onChange={(event) =>
                                                setPlannedMinutes(
                                                    event.target.value
                                                )
                                            }
                                        />

                                        <span>
                                            minutes
                                        </span>
                                    </div>
                                </div>

                            </div>

                            <div className="daily-plan-form-actions">

                                <button
                                    type="button"
                                    className="daily-plan-secondary-button"
                                    onClick={() => {
                                        setShowPlanForm(false);
                                        setSelectedActivityId("");
                                        setPlannedMinutes("");
                                    }}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="button"
                                    className="daily-plan-save-button"
                                    onClick={handleCreatePlan}
                                >
                                    Add to plan
                                </button>

                            </div>

                        </div>
                    )}

                </div>
            )}

            {/* Plan List */}

            <div className="daily-plan-list">

                <div className="daily-plan-list-header">

                    <div>
                        <p>
                            YOUR DAY
                        </p>

                        <h2>
                            {isPastDate
                                ? "What you planned"
                                : "Your planned activities"}
                        </h2>
                    </div>

                    {plans.length > 0 && (
                        <span className="daily-plan-count">
                            {plans.length}{" "}
                            {plans.length === 1
                                ? "activity"
                                : "activities"}
                        </span>
                    )}

                </div>

                {loading ? (
                    <div className="daily-plan-empty">
                        <p>
                            Loading your plan...
                        </p>
                    </div>
                ) : plans.length === 0 ? (
                    <div className="daily-plan-empty">

                        <div className="daily-plan-empty-icon">
                            +
                        </div>

                        <h3>
                            Nothing planned yet
                        </h3>

                        <p>
                            {isPastDate
                                ? "You didn't have any planned activities for this day."
                                : "Add an activity to start building your day."}
                        </p>

                    </div>
                ) : (
                    <div className="daily-plan-items">

                        {plans.map((plan, index) => (
                            <div
                                className="daily-plan-item"
                                key={plan.id}
                            >

                                <div className="daily-plan-item-number">
                                    {String(index + 1).padStart(
                                        2,
                                        "0"
                                    )}
                                </div>

                                <div className="daily-plan-item-content">

                                    <h3>
                                        {plan.activityName}
                                    </h3>

                                    <p>
                                        Planned activity
                                    </p>

                                </div>

                                {editingPlanId === plan.id ? (
                                    <div className="daily-plan-edit-area">

                                        <div className="daily-plan-minute-input">
                                            <input
                                                type="number"
                                                min="1"
                                                max="1440"
                                                value={
                                                    editPlannedMinutes
                                                }
                                                onChange={(
                                                    event
                                                ) =>
                                                    setEditPlannedMinutes(
                                                        event.target
                                                            .value
                                                    )
                                                }
                                            />

                                            <span>
                                                min
                                            </span>
                                        </div>

                                        <button
                                            type="button"
                                            className="daily-plan-save-small"
                                            onClick={() =>
                                                handleUpdatePlan(
                                                    plan.id
                                                )
                                            }
                                        >
                                            Save
                                        </button>

                                        <button
                                            type="button"
                                            className="daily-plan-cancel-small"
                                            onClick={() => {
                                                setEditingPlanId(
                                                    null
                                                );
                                                setEditPlannedMinutes(
                                                    ""
                                                );
                                            }}
                                        >
                                            Cancel
                                        </button>

                                    </div>
                                ) : (
                                    <>

                                        <div className="daily-plan-item-time">
                                            {formatMinutes(
                                                plan.plannedMinutes
                                            )}
                                        </div>

                                        <div className="daily-plan-item-actions">

                                            {!isPastDate && (
                                                <button
                                                    type="button"
                                                    onClick={() => {
                                                        setEditingPlanId(
                                                            plan.id
                                                        );
                                                        setEditPlannedMinutes(
                                                            plan.plannedMinutes
                                                        );
                                                    }}
                                                >
                                                    Edit
                                                </button>
                                            )}

                                            <button
                                                type="button"
                                                className="delete"
                                                onClick={() =>
                                                    handleDeletePlan(
                                                        plan.id
                                                    )
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </>
                                )}

                            </div>
                        ))}

                    </div>
                )}

            </div>

        </section>
    );
}

export default DailyPlan;