import { useEffect, useState } from "react";
import "./DailyPlan.css";

import {
    getDailyPlans,
    createDailyPlan,
    updateDailyPlan,
    deleteDailyPlan,
} from "../../services/dailyPlanService";

import { getActivities } from "../../services/activityService";

const DailyPlan = () => {
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [plans, setPlans] = useState([]);
    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [selectedActivityId, setSelectedActivityId] =
        useState("");

    const [plannedMinutes, setPlannedMinutes] =
        useState("");

    const [formError, setFormError] = useState("");
    const [saving, setSaving] = useState(false);

    const [editingPlanId, setEditingPlanId] =
        useState(null);

    const [editingMinutes, setEditingMinutes] =
        useState("");


    useEffect(() => {
        loadPlans();
    }, [date]);


    const loadPlans = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getDailyPlans(date);

            setPlans(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load daily plan."
            );
        } finally {
            setLoading(false);
        }
    };


    const loadActivities = async () => {
        try {
            const response = await getActivities();

            setActivities(response.data);
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                "Unable to load activities."
            );
        }
    };


    const handleOpenForm = async () => {
        setShowForm(true);

        setFormError("");
        setSelectedActivityId("");
        setPlannedMinutes("");

        await loadActivities();
    };


    const handleCloseForm = () => {
        setShowForm(false);

        setFormError("");
        setSelectedActivityId("");
        setPlannedMinutes("");
    };


    const handleCreatePlan = async (event) => {
        event.preventDefault();

        if (!selectedActivityId) {
            setFormError("Please select an activity.");
            return;
        }

        if (!plannedMinutes || Number(plannedMinutes) <= 0) {
            setFormError(
                "Planned minutes must be greater than 0."
            );
            return;
        }

        try {
            setSaving(true);
            setFormError("");

            await createDailyPlan({
                activityId: Number(selectedActivityId),
                date,
                plannedMinutes: Number(plannedMinutes),
            });

            handleCloseForm();

            await loadPlans();
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                "Unable to save daily plan."
            );
        } finally {
            setSaving(false);
        }
    };


    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to remove this activity from your plan?"
        );

        if (!confirmed) return;

        try {
            await deleteDailyPlan(id);

            await loadPlans();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete daily plan."
            );
        }
    };


    const handleStartEdit = (plan) => {
        setEditingPlanId(plan.id);
        setEditingMinutes(plan.plannedMinutes);
    };


    const handleCancelEdit = () => {
        setEditingPlanId(null);
        setEditingMinutes("");
    };


    const handleSaveEdit = async (id) => {
        if (!editingMinutes || Number(editingMinutes) <= 0) {
            return;
        }

        try {
            await updateDailyPlan(id, {
                plannedMinutes: Number(editingMinutes),
            });

            setEditingPlanId(null);
            setEditingMinutes("");

            await loadPlans();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update daily plan."
            );
        }
    };


    const formatDate = (value) => {
        const selectedDate = new Date(
            `${value}T00:00:00`
        );

        return selectedDate.toLocaleDateString(
            "en-US",
            {
                weekday: "long",
                month: "long",
                day: "numeric",
                year: "numeric",
            }
        );
    };


    const formatMinutes = (minutes) => {
        const hours = Math.floor(minutes / 60);
        const remainingMinutes = minutes % 60;

        if (hours === 0) {
            return `${remainingMinutes}m`;
        }

        if (remainingMinutes === 0) {
            return `${hours}h`;
        }

        return `${hours}h ${remainingMinutes}m`;
    };


    const totalPlannedMinutes = plans.reduce(
        (total, plan) =>
            total + plan.plannedMinutes,
        0
    );


    return (
        <div className="daily-plan-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="daily-plan-hero">

                <div className="daily-plan-hero-content">

                    <span className="daily-plan-kicker">
                        LIFE REPLAY / PLAN
                    </span>

                    <h1>
                        Make today
                        <span> count.</span>
                    </h1>

                    <p>
                        Decide where your time goes
                        before the day gets away from you.
                    </p>

                </div>


                <div className="daily-plan-date">

                    <span>
                        PLANNING FOR
                    </span>

                    <input
                        type="date"
                        value={date}
                        onChange={(event) =>
                            setDate(event.target.value)
                        }
                    />

                </div>

            </section>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
                <div className="daily-plan-error">
                    {error}
                </div>
            )}


            {!error && (
                <>

                    {/* =========================================
                        DAY OVERVIEW
                    ========================================= */}

                    <section className="daily-plan-overview">

                        <div className="daily-plan-overview-date">

                            <span>
                                {formatDate(date)}
                            </span>

                            <h2>
                                Your day,
                                <br />
                                your rules.
                            </h2>

                        </div>


                        <div className="daily-plan-overview-numbers">

                            <div>
                                <strong>
                                    {String(
                                        plans.length
                                    ).padStart(2, "0")}
                                </strong>

                                <span>
                                    ACTIVITIES
                                </span>
                            </div>


                            <div>
                                <strong>
                                    {formatMinutes(
                                        totalPlannedMinutes
                                    )}
                                </strong>

                                <span>
                                    PLANNED
                                </span>
                            </div>

                        </div>

                    </section>


                    {/* =========================================
                        SECTION HEADER
                    ========================================= */}

                    <section className="daily-plan-section">

                        <div className="daily-plan-section-heading">

                            <div>

                                <span>
                                    TODAY
                                </span>

                                <h2>
                                    Your plan
                                </h2>

                            </div>

                            <p>
                                {plans.length}{" "}
                                {plans.length === 1
                                    ? "thing"
                                    : "things"}{" "}
                                on the list
                            </p>

                        </div>


                        {/* =====================================
                            LOADING
                        ===================================== */}

                        {loading && (
                            <div className="daily-plan-loading">
                                Loading your day...
                            </div>
                        )}


                        {/* =====================================
                            EMPTY
                        ===================================== */}

                        {!loading &&
                            plans.length === 0 && (

                                <div className="daily-plan-empty">

                                    <div className="daily-plan-empty-symbol">
                                        +
                                    </div>

                                    <div>

                                        <h3>
                                            Your day is wide open.
                                        </h3>

                                        <p>
                                            Add your first activity
                                            and start shaping it.
                                        </p>

                                    </div>

                                </div>

                            )}


                        {/* =====================================
                            ACTIVITY GRID
                        ===================================== */}

                        {!loading &&
                            plans.length > 0 && (

                                <div className="daily-plan-grid">

                                    {plans.map(
                                        (plan, index) => (

                                            <article
                                                className={`daily-plan-card daily-plan-card-${(index % 4) + 1}`}
                                                key={plan.id}
                                            >

                                                <div className="daily-plan-card-top">

                                                    <span className="daily-plan-card-number">
                                                        {String(
                                                            index + 1
                                                        ).padStart(
                                                            2,
                                                            "0"
                                                        )}
                                                    </span>


                                                    {editingPlanId !==
                                                        plan.id && (

                                                        <div className="daily-plan-card-actions">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleStartEdit(
                                                                        plan
                                                                    )
                                                                }
                                                            >
                                                                Edit
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        plan.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </div>

                                                    )}

                                                </div>


                                                {editingPlanId ===
                                                plan.id ? (

                                                    <div className="daily-plan-card-edit">

                                                        <h3>
                                                            {plan.activityName}
                                                        </h3>

                                                        <div className="daily-plan-edit-controls">

                                                            <input
                                                                type="number"
                                                                min="1"
                                                                value={
                                                                    editingMinutes
                                                                }
                                                                onChange={(
                                                                    event
                                                                ) =>
                                                                    setEditingMinutes(
                                                                        event.target.value
                                                                    )
                                                                }
                                                            />

                                                            <span>
                                                                min
                                                            </span>

                                                        </div>

                                                        <div className="daily-plan-edit-buttons">

                                                            <button
                                                                type="button"
                                                                onClick={() =>
                                                                    handleSaveEdit(
                                                                        plan.id
                                                                    )
                                                                }
                                                            >
                                                                Save
                                                            </button>

                                                            <button
                                                                type="button"
                                                                onClick={
                                                                    handleCancelEdit
                                                                }
                                                            >
                                                                Cancel
                                                            </button>

                                                        </div>

                                                    </div>

                                                ) : (

                                                    <>

                                                        <div className="daily-plan-card-content">

                                                            <h3>
                                                                {
                                                                    plan.activityName
                                                                }
                                                            </h3>

                                                            <span>
                                                                Planned
                                                                time
                                                            </span>

                                                        </div>


                                                        <div className="daily-plan-card-bottom">

                                                            <strong>
                                                                {formatMinutes(
                                                                    plan.plannedMinutes
                                                                )}
                                                            </strong>

                                                            <span>
                                                                of your day
                                                            </span>

                                                        </div>

                                                    </>

                                                )}

                                            </article>

                                        )
                                    )}


                                    {/* ADD CARD */}

                                    {!showForm && (

                                        <button
                                            type="button"
                                            className="daily-plan-add-card"
                                            onClick={
                                                handleOpenForm
                                            }
                                        >

                                            <span>
                                                +
                                            </span>

                                            <strong>
                                                Add activity
                                            </strong>

                                            <small>
                                                Make room for
                                                something that matters.
                                            </small>

                                        </button>

                                    )}

                                </div>

                            )}


                        {/* =====================================
                            ADD CARD WHEN EMPTY
                        ===================================== */}

                        {!loading &&
                            plans.length === 0 &&
                            !showForm && (

                                <button
                                    type="button"
                                    className="daily-plan-add-card daily-plan-add-card-empty"
                                    onClick={
                                        handleOpenForm
                                    }
                                >

                                    <span>
                                        +
                                    </span>

                                    <strong>
                                        Add your first activity
                                    </strong>

                                    <small>
                                        Start building your day.
                                    </small>

                                </button>

                            )}


                        {/* =====================================
                            FORM
                        ===================================== */}

                        {showForm && (

                            <form
                                className="daily-plan-create"
                                onSubmit={
                                    handleCreatePlan
                                }
                            >

                                <div className="daily-plan-create-heading">

                                    <div>

                                        <span>
                                            NEW BLOCK
                                        </span>

                                        <h2>
                                            What are you making
                                            time for?
                                        </h2>

                                    </div>

                                    <button
                                        type="button"
                                        onClick={
                                            handleCloseForm
                                        }
                                    >
                                        ×
                                    </button>

                                </div>


                                {formError && (
                                    <div className="daily-plan-form-error">
                                        {formError}
                                    </div>
                                )}


                                <div className="daily-plan-create-fields">

                                    <div>

                                        <label>
                                            Activity
                                        </label>

                                        <select
                                            value={
                                                selectedActivityId
                                            }
                                            onChange={(event) =>
                                                setSelectedActivityId(
                                                    event.target.value
                                                )
                                            }
                                        >

                                            <option value="">
                                                Choose one
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
                                                        {
                                                            activity.name
                                                        }
                                                    </option>

                                                )
                                            )}

                                        </select>

                                    </div>


                                    <div>

                                        <label>
                                            Time
                                        </label>

                                        <div className="daily-plan-minutes">

                                            <input
                                                type="number"
                                                min="1"
                                                placeholder="60"
                                                value={
                                                    plannedMinutes
                                                }
                                                onChange={(
                                                    event
                                                ) =>
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


                                <div className="daily-plan-create-actions">

                                    <button
                                        type="button"
                                        onClick={
                                            handleCloseForm
                                        }
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Adding..."
                                            : "Add to my day →"}
                                    </button>

                                </div>

                            </form>

                        )}


                        {/* =====================================
                            TOTAL
                        ===================================== */}

                        {!loading &&
                            plans.length > 0 && (

                                <div className="daily-plan-total">

                                    <span>
                                        Total planned
                                    </span>

                                    <strong>
                                        {formatMinutes(
                                            totalPlannedMinutes
                                        )}
                                    </strong>

                                </div>

                            )}

                    </section>

                </>
            )}

        </div>
    );
};

export default DailyPlan;