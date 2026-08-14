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
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [actuals, setActuals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [showForm, setShowForm] = useState(false);

    const [activities, setActivities] = useState([]);

    const [selectedActivityId, setSelectedActivityId] =
        useState("");

    const [actualMinutes, setActualMinutes] =
        useState("");

    const [formError, setFormError] = useState("");

    const [saving, setSaving] = useState(false);
    const [editingId, setEditingId] = useState(null);

    const [editMinutes, setEditMinutes] = useState("");

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
    setFormError("");

    await loadActivities();

    setShowForm(true);
};
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
const handleEdit = (actual) => {
    setEditingId(actual.id);
    setEditMinutes(String(actual.actualMinutes));
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

        await updateDailyActual(
            id,
            minutes
        );

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

    return (
        <div className="daily-actual-page">

            {/* PAGE HEADER */}

            <div className="daily-actual-heading">

                <div>
                    <p className="daily-actual-eyebrow">
                        ACTUAL TIME
                    </p>

                    <h1>
                        What did your day look like?
                    </h1>

                    <p className="daily-actual-description">
                        Record how you actually spent your time.
                    </p>
                </div>

                <div className="daily-actual-date-picker">

                    <label htmlFor="actual-date">
                        Reviewing
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

            </div>

            {/* ERROR */}

            {error && (
                <p role="alert">
                    {error}
                </p>
            )}

            {/* SUMMARY */}

            {!error && (
                <div className="daily-actual-summary">

                    <div className="daily-actual-summary-text">

                        <h2>
                            {formatDate(date)}
                        </h2>

                        <p>
                            Your recorded time for this day
                        </p>

                    </div>

                    <div className="daily-actual-summary-stats">

                        <div className="daily-actual-stat">

                            <span>
                                Activities
                            </span>

                            <strong>
                                {actuals.length}
                            </strong>

                        </div>

                        <div className="daily-actual-stat">

                            <span>
                                Actual time
                            </span>

                            <strong>
                                {formatMinutes(
                                    totalActualMinutes
                                )}
                            </strong>

                        </div>

                    </div>

                </div>
            )}

            {/* ADD BUTTON */}

            {!loading && !error && (
                <button
                    type="button"
                    className="daily-actual-add-button"
                    onClick={handleOpenForm}
                >
                    + Record actual time
                </button>
            )}
        {showForm && (
            <div className="daily-actual-form">

                <div className="daily-actual-form-header">

                    <div>
                        <p className="daily-actual-eyebrow">
                            RECORD TIME
                        </p>

                        <h2>
                            What did you actually do?
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="daily-actual-form-close"
                        onClick={() => {
                            setShowForm(false);
                            setFormError("");
                        }}
                    >
                        Cancel
                    </button>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="daily-actual-form-field">

                        <label htmlFor="actual-activity">
                            Activity
                        </label>

                        <select
                            id="actual-activity"
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

                            {activities.map((activity) => (
                                <option
                                    key={activity.id}
                                    value={activity.id}
                                >
                                    {activity.name}
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="daily-actual-form-field">

                        <label htmlFor="actual-minutes">
                            Actual time
                        </label>

                        <input
                            id="actual-minutes"
                            type="number"
                            min="1"
                            max="1440"
                            value={actualMinutes}
                            onChange={(event) =>
                                setActualMinutes(
                                    event.target.value
                                )
                            }
                            placeholder="e.g. 90"
                        />

                        <span>
                            Enter time in minutes, from 1 to 1440.
                        </span>

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
                        className="daily-actual-save-button"
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

            {/* ACTUAL LIST */}

            {!loading && !error && (
                <div className="daily-actual-list">

                    <div className="daily-actual-list-header">

                        <div>
                            <p className="daily-actual-eyebrow">
                                YOUR DAY
                            </p>

                            <h2>
                                Your actual time
                            </h2>
                        </div>

                        <span className="daily-actual-count">
                            {actuals.length}{" "}
                            {actuals.length === 1
                                ? "activity"
                                : "activities"}
                        </span>

                    </div>

                    {actuals.length === 0 ? (

                        <div className="daily-actual-empty">
                            No actual time recorded for this day yet.
                        </div>

                    ) : (

                        <div className="daily-actual-items">

                            {actuals.map(
                                (actual, index) => (
                                    <div
                                        className="daily-actual-item"
                                        key={actual.id}
                                    >

                                        <span className="daily-actual-number">
                                            {String(index + 1).padStart(
                                                2,
                                                "0"
                                            )}
                                        </span>

                                       {editingId === actual.id ? (
                                           <div className="daily-actual-edit">

                                               <input
                                                   type="number"
                                                   min="1"
                                                   max="1440"
                                                   value={editMinutes}
                                                   onChange={(event) =>
                                                       setEditMinutes(event.target.value)
                                                   }
                                               />

                                               <button
                                                   type="button"
                                                   onClick={() =>
                                                       handleSaveEdit(actual.id)
                                                   }
                                                   disabled={saving}
                                               >
                                                   {saving ? "Saving..." : "Save"}
                                               </button>

                                               <button
                                                   type="button"
                                                   onClick={handleCancelEdit}
                                                   disabled={saving}
                                               >
                                                   Cancel
                                               </button>

                                           </div>
                                       ) : (
                                           <>
                                               <div>
                                                   <h3>
                                                       {actual.activityName}
                                                   </h3>

                                                   <p>
                                                       Actual time recorded
                                                   </p>
                                               </div>

                                             <div className="daily-actual-row-actions">

                                                 <span className="daily-actual-time">
                                                     {formatMinutes(
                                                         actual.actualMinutes
                                                     )}
                                                 </span>

                                                 <button
                                                     type="button"
                                                     className="daily-actual-edit-button"
                                                     onClick={() =>
                                                         handleEdit(actual)
                                                     }
                                                     disabled={saving}
                                                 >
                                                     Edit
                                                 </button>

                                                 <button
                                                     type="button"
                                                     className="daily-actual-delete-button"
                                                     onClick={() =>
                                                         handleDelete(actual.id)
                                                     }
                                                     disabled={saving}
                                                 >
                                                     Delete
                                                 </button>

                                             </div>
                                           </>
                                       )}

                                    </div>
                                )
                            )}

                        </div>

                    )}

                </div>
            )}

            {/* LOADING */}

            {loading && (
                <div className="daily-actual-list">
                    <div className="daily-actual-empty">
                        Loading actual time...
                    </div>
                </div>
            )}

        </div>
    );
};

export default DailyActual;