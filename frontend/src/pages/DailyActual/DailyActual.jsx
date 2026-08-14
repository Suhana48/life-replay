import { useEffect, useState } from "react";
import "./DailyActual.css";
import { getDailyActuals } from "../../services/dailyActualService";

const DailyActual = () => {
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [actuals, setActuals] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

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
                >
                    + Record actual time
                </button>
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

                                        <div>
                                            <h3>
                                                {actual.activityName}
                                            </h3>

                                            <p>
                                                Actual time recorded
                                            </p>
                                        </div>

                                        <span className="daily-actual-time">
                                            {formatMinutes(
                                                actual.actualMinutes
                                            )}
                                        </span>

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