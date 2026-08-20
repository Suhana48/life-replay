import { useEffect, useState } from "react";
import { getWeeklyReplay } from "../../services/replayService";
import "./WeeklyReplay.css";

const formatMinutes = (minutes) => {
    if (minutes === 0) return "0m";

    const sign = minutes < 0 ? "-" : "";
    const absoluteMinutes = Math.abs(minutes);

    const hours = Math.floor(absoluteMinutes / 60);
    const mins = absoluteMinutes % 60;

    if (hours === 0) {
        return `${sign}${mins}m`;
    }

    if (mins === 0) {
        return `${sign}${hours}h`;
    }

    return `${sign}${hours}h ${mins}m`;
};

const WeeklyReplay = () => {

   const getMonday = (date) => {
       const day = date.getDay();

       const difference =
           day === 0
               ? -6
               : 1 - day;

       const monday = new Date(date);
       monday.setDate(date.getDate() + difference);

       return monday.toISOString().split("T")[0];
   };

   const [startDate, setStartDate] = useState(
       getMonday(new Date())
   );

    const [replay, setReplay] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {

        const loadWeeklyReplay = async () => {

            setLoading(true);
            setError("");

            try {

                const response =
                    await getWeeklyReplay(startDate);

                setReplay(response.data);

            } catch (error) {

                console.error(
                    "Failed to load weekly replay:",
                    error.response?.data || error
                );

                setReplay(null);
                setError(
                    "Unable to load weekly replay."
                );

            } finally {

                setLoading(false);

            }
        };

        loadWeeklyReplay();

    }, [startDate]);

    return (
        <main className="weekly-replay-page">

            {/* HEADER */}

            <section className="weekly-replay-header">

                <div>

                    <span className="page-eyebrow">
                        WEEKLY REPLAY
                    </span>

                    <h1>
                        Your week, at a glance.
                    </h1>

                    <p>
                        See the patterns between what you planned
                        and how you actually spent your time.
                    </p>

                </div>

                <div className="week-selector">

                    <label htmlFor="week-start">
                        Week starting
                    </label>

                   <input
                       id="week-start"
                       type="date"
                       value={startDate}
                       onChange={(event) =>
                           setStartDate(
                               getMonday(
                                   new Date(`${event.target.value}T00:00:00`)
                               )
                           )
                       }
                   />

                </div>

            </section>


            {/* STATES */}

            {loading && (
                <div className="weekly-state">
                    Loading your week...
                </div>
            )}

            {error && !loading && (
                <div className="weekly-state weekly-error">
                    {error}
                </div>
            )}


            {/* CONTENT */}

            {replay && !loading && !error && (

                <>

                    {/* SUMMARY */}

                    <section className="weekly-summary">

                        <div className="weekly-summary-card">

                            <span>
                                PLANNED
                            </span>

                            <strong>
                                {formatMinutes(
                                    replay.totalPlannedMinutes
                                )}
                            </strong>

                            <small>
                                total planned time
                            </small>

                        </div>


                        <div className="weekly-summary-card">

                            <span>
                                ACTUAL
                            </span>

                            <strong>
                                {formatMinutes(
                                    replay.totalActualMinutes
                                )}
                            </strong>

                            <small>
                                total actual time
                            </small>

                        </div>


                        <div
                            className={`weekly-summary-card ${
                                replay.totalDifferenceMinutes > 0
                                    ? "weekly-positive"
                                    : replay.totalDifferenceMinutes < 0
                                        ? "weekly-negative"
                                        : ""
                            }`}
                        >

                            <span>
                                DIFFERENCE
                            </span>

                            <strong>
                                {replay.totalDifferenceMinutes > 0
                                    ? "+"
                                    : ""}
                                {formatMinutes(
                                    replay.totalDifferenceMinutes
                                )}
                            </strong>

                            <small>
                                against your plan
                            </small>

                        </div>


                        <div className="weekly-summary-card">

                            <span>
                                COMPLETION
                            </span>

                            <strong>
                                {replay.completionPercentage.toFixed(1)}
                                %
                            </strong>

                            <div className="weekly-completion-track">

                                <div
                                    className="weekly-completion-fill"
                                    style={{
                                        width: `${Math.min(
                                            replay.completionPercentage,
                                            100
                                        )}%`
                                    }}
                                />

                            </div>

                        </div>

                    </section>


                    {/* TEMPORARY NEXT SECTION */}

                    <section className="weekly-empty-section">

                        <span>
                            WEEKLY ANALYTICS
                        </span>

                        <h2>
                            Your weekly patterns will appear here.
                        </h2>

                        <p>
                            Daily trends and comparisons are coming next.
                        </p>

                    </section>

                </>

            )}

        </main>
    );
};

export default WeeklyReplay;