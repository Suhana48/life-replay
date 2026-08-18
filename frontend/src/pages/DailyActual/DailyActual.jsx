import { useEffect, useState } from "react";
import "./DailyActual.css";

import {
    createDailyActual,
    getDailyActuals,
    updateDailyActual,
    deleteDailyActual,
} from "../../services/dailyActualService";

import { getActivities } from "../../services/activityService";

const DailyActual = () => {
   const getTodayDate = () => {
       return new Intl.DateTimeFormat("en-CA", {
           timeZone: "Asia/Kolkata",
       }).format(new Date());
   };

   const [date, setDate] = useState(getTodayDate());

    const [actuals, setActuals] = useState([]);
    const [activities, setActivities] = useState([]);

    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");
    const [formError, setFormError] = useState("");

    const [showForm, setShowForm] = useState(false);

    const [selectedActivityId, setSelectedActivityId] =
        useState("");

    const [actualMinutes, setActualMinutes] =
        useState("");

    const [editingId, setEditingId] = useState(null);
    const [editMinutes, setEditMinutes] = useState("");

    /* =====================================================
       LOAD ACTUAL TIME
    ===================================================== */

    useEffect(() => {
        loadActuals();
    }, [date]);

    const loadActuals = async () => {
        try {
            setLoading(true);
            setError("");

            const response = await getDailyActuals(date);

            setActuals(response.data);
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to load actual time."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =====================================================
       LOAD ACTIVITIES
    ===================================================== */

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

    /* =====================================================
       OPEN ADD FORM
    ===================================================== */

    const handleOpenForm = async () => {
        setFormError("");

        await loadActivities();

        setShowForm(true);
    };

    /* =====================================================
       CREATE ACTUAL
    ===================================================== */

    const handleSubmit = async (event) => {
        event.preventDefault();

        setFormError("");

        if (!selectedActivityId) {
            setFormError("Please select an activity.");
            return;
        }

        const minutes = Number(actualMinutes);

        if (
            !Number.isInteger(minutes) ||
            minutes < 1 ||
            minutes > 1440
        ) {
            setFormError(
                "Actual time must be between 1 and 1440 minutes."
            );
            return;
        }

        try {
            setSaving(true);

            await createDailyActual(
                Number(selectedActivityId),
                date,
                minutes
            );

            setSelectedActivityId("");
            setActualMinutes("");
            setShowForm(false);

            await loadActuals();
        } catch (err) {
            setFormError(
                err.response?.data?.message ||
                "Unable to record actual time."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       EDIT
    ===================================================== */

    const handleEdit = (actual) => {
        setEditingId(actual.id);
        setEditMinutes(String(actual.actualMinutes));
        setError("");
    };

    const handleSaveEdit = async (id) => {
        const minutes = Number(editMinutes);

        if (
            !Number.isInteger(minutes) ||
            minutes < 1 ||
            minutes > 1440
        ) {
            setError(
                "Actual time must be between 1 and 1440 minutes."
            );
            return;
        }

        try {
            setSaving(true);
            setError("");

            await updateDailyActual(id, minutes);

            setEditingId(null);
            setEditMinutes("");

            await loadActuals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to update actual time."
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancelEdit = () => {
        setEditingId(null);
        setEditMinutes("");
        setError("");
    };

    /* =====================================================
       DELETE
    ===================================================== */

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this actual time record?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setSaving(true);
            setError("");

            await deleteDailyActual(id);

            await loadActuals();
        } catch (err) {
            setError(
                err.response?.data?.message ||
                "Unable to delete actual time."
            );
        } finally {
            setSaving(false);
        }
    };

    /* =====================================================
       HELPERS
    ===================================================== */

    const totalActualMinutes = actuals.reduce(
        (total, actual) =>
            total + actual.actualMinutes,
        0
    );

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
const getDateStatus = () => {
    const today = getTodayDate();

    // Future date
    if (date > today) {
        return "future";
    }

    // Today
    if (date === today) {
        return "today";
    }

    // Selected date is in the past.
    // Actual time can still be recorded until 5:00 AM
    // of the following day (Indian time).

    const selectedDate = new Date(`${date}T00:00:00`);

    const closingTime = new Date(selectedDate);

    closingTime.setDate(
        closingTime.getDate() + 1
    );

    closingTime.setHours(5, 0, 0, 0);

    const now = new Date(
        new Date().toLocaleString("en-US", {
            timeZone: "Asia/Kolkata",
        })
    );

    if (now < closingTime) {
        return "grace";
    }

    return "closed";
};

const dateStatus = getDateStatus();

    /* =====================================================
       UI
    ===================================================== */

    return (
        <div className="daily-actual-page">

            {/* =================================================
                HERO
            ================================================= */}

            <section className="daily-actual-hero">

                <div className="daily-actual-hero-content">

                    <p className="daily-actual-eyebrow">
                        LIFE REPLAY / ACTUAL TIME
                    </p>

                    <h1>
                        See where your time{" "}
                        <span>really went.</span>
                    </h1>

                    <p className="daily-actual-description">
                        Record the time you actually spent on
                        the things that matter.
                    </p>

                </div>

                <div className="daily-actual-date-picker">

                    <label htmlFor="actual-date">
                        REVIEWING
                    </label>

                    <input
                        id="actual-date"
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
                <p
                    className="daily-actual-page-error"
                    role="alert"
                >
                    {error}
                </p>
            )}

            {/* =================================================
                SUMMARY
            ================================================= */}

            {!loading && (
                <section className="daily-actual-summary">

                    <div className="daily-actual-summary-content">

                        <p>
                            {formatDate(date)}
                        </p>

                        <h2>
                            Your day,
                            <br />
                            your reality.
                        </h2>

                    </div>

                    <div className="daily-actual-summary-stats">

                        <div>
                            <strong>
                                {String(actuals.length).padStart(
                                    2,
                                    "0"
                                )}
                            </strong>

                            <span>
                                ACTIVITIES
                            </span>
                        </div>

                        <div>
                            <strong>
                                {formatMinutes(
                                    totalActualMinutes
                                )}
                            </strong>

                            <span>
                                ACTUAL
                            </span>
                        </div>

                    </div>

                </section>
            )}

            {/* =================================================
                YOUR TIME
            ================================================= */}

            {!loading && (
                <section className="daily-actual-library">

                    <div className="daily-actual-section-header">

                        <div>
                            <p className="daily-actual-eyebrow">
                                YOUR TIME
                            </p>

                            <h2>
                                Your actual day.
                            </h2>
                        </div>

                        <span>
                            {actuals.length}{" "}
                            {actuals.length === 1
                                ? "activity"
                                : "activities"}
                        </span>

                    </div>

                    {/* =================================================
                        EMPTY STATE
                    ================================================= */}

                    {(dateStatus === "today" ||
                        dateStatus === "grace") &&
                        actuals.length === 0 &&
                        !showForm && (
                        <button
                            type="button"
                            className="daily-actual-add-card"
                            onClick={handleOpenForm}
                        >
                            <div className="daily-actual-add-icon">
                                +
                            </div>

                            <h3>
                                Record actual time
                            </h3>

                            <p>
                                Tell Life Replay where your
                                time actually went.
                            </p>
                        </button>
                    )}

                    {/* =================================================
                        ACTUAL CARDS
                    ================================================= */}

                    {actuals.length > 0 && (
                        <div className="daily-actual-grid">

                            {actuals.map(
                                (actual, index) => (

                                    <article
                                        className="daily-actual-card"
                                        key={actual.id}
                                    >

                                        <div className="daily-actual-card-top">

                                            <div className="daily-actual-number">
                                                {String(
                                                    index + 1
                                                ).padStart(2, "0")}
                                            </div>


                                               {(dateStatus === "today" ||
                                                   dateStatus === "grace") && (
                                                   <div className="daily-actual-card-actions">

                                                       <button
                                                           type="button"
                                                           onClick={() =>
                                                               handleEdit(actual)
                                                           }
                                                           disabled={saving}
                                                       >
                                                           Edit
                                                       </button>

                                                       <button
                                                           type="button"
                                                           onClick={() =>
                                                               handleDelete(actual.id)
                                                           }
                                                           disabled={saving}
                                                       >
                                                           Delete
                                                       </button>

                                                   </div>

                                            )}

                                        </div>

                                        {editingId === actual.id ? (

                                            <div className="daily-actual-edit">

                                                <h3>
                                                    {actual.activityName}
                                                </h3>

                                                <label>
                                                    Actual minutes
                                                </label>

                                                <input
                                                    type="number"
                                                    min="1"
                                                    max="1440"
                                                    value={
                                                        editMinutes
                                                    }
                                                    onChange={(
                                                        event
                                                    ) =>
                                                        setEditMinutes(
                                                            event.target.value
                                                        )
                                                    }
                                                />

                                                <div>

                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            handleSaveEdit(
                                                                actual.id
                                                            )
                                                        }
                                                        disabled={
                                                            saving
                                                        }
                                                    >
                                                        {saving
                                                            ? "Saving..."
                                                            : "Save"}
                                                    </button>

                                                    <button
                                                        type="button"
                                                        onClick={
                                                            handleCancelEdit
                                                        }
                                                        disabled={
                                                            saving
                                                        }
                                                    >
                                                        Cancel
                                                    </button>

                                                </div>

                                            </div>

                                        ) : (

                                            <>

                                                <div className="daily-actual-card-content">

                                                    <h3>
                                                        {
                                                            actual.activityName
                                                        }
                                                    </h3>

                                                    <p>
                                                        Actual time
                                                        recorded
                                                    </p>

                                                </div>

                                                <div className="daily-actual-card-time">

                                                    <strong>
                                                        {formatMinutes(
                                                            actual.actualMinutes
                                                        )}
                                                    </strong>

                                                    <span>
                                                        ACTUAL TIME
                                                    </span>

                                                </div>

                                            </>

                                        )}

                                    </article>

                                )
                            )}

                            {/* =================================================
                                ADD CARD
                            ================================================= */}

                           {(dateStatus === "today" ||
                               dateStatus === "grace") && (
                               <button
                                   type="button"
                                   className="daily-actual-add-card"
                                   onClick={handleOpenForm}
                               >

                                   <div className="daily-actual-add-icon">
                                       +
                                   </div>

                                   <h3>
                                       Record actual time
                                   </h3>

                                   <p>
                                       Make room for another part
                                       of your day.
                                   </p>

                               </button>
                           )}
                        </div>
                    )}

                    {/* =================================================
                        ADD FORM
                    ================================================= */}

                    {showForm && (

                        <div className="daily-actual-form">

                            <div className="daily-actual-form-header">

                                <div>

                                    <p className="daily-actual-eyebrow">
                                        NEW RECORD
                                    </p>

                                    <h2>
                                        Where did your time go?
                                    </h2>

                                </div>

                                <button
                                    type="button"
                                    onClick={() => {
                                        setShowForm(false);
                                        setFormError("");
                                    }}
                                >
                                    Cancel
                                </button>

                            </div>

                            <form
                                onSubmit={handleSubmit}
                                className="daily-actual-form-grid"
                            >

                                <div>

                                    <label htmlFor="actual-activity">
                                        Activity
                                    </label>

                                    <select
                                        id="actual-activity"
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
                                                    {
                                                        activity.name
                                                    }
                                                </option>
                                            )
                                        )}

                                    </select>

                                </div>

                                <div>

                                    <label htmlFor="actual-minutes">
                                        Actual time
                                    </label>

                                    <input
                                        id="actual-minutes"
                                        type="number"
                                        min="1"
                                        max="1440"
                                        value={
                                            actualMinutes
                                        }
                                        onChange={(event) =>
                                            setActualMinutes(
                                                event.target.value
                                            )
                                        }
                                        placeholder="e.g. 90"
                                    />

                                </div>

                                {formError && (
                                    <p
                                        className="daily-actual-form-error"
                                        role="alert"
                                    >
                                        {formError}
                                    </p>
                                )}

                                <div className="daily-actual-form-actions">

                                    <button
                                        type="button"
                                        onClick={() => {
                                            setShowForm(false);
                                            setFormError("");
                                        }}
                                    >
                                        Cancel
                                    </button>

                                    <button
                                        type="submit"
                                        disabled={saving}
                                    >
                                        {saving
                                            ? "Recording..."
                                            : "Record time"}
                                    </button>

                                </div>

                            </form>

                        </div>

                    )}

                </section>
            )}

            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
                <div className="daily-actual-loading">
                    Loading your actual time...
                </div>
            )}

        </div>
    );
};

export default DailyActual;