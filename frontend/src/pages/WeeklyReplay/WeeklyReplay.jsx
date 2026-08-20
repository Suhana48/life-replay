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

   const getMonday = (dateString) => {
       const [year, month, day] = dateString.split("-").map(Number);

       const date = new Date(year, month - 1, day);
       const dayOfWeek = date.getDay();

       const difference = dayOfWeek === 0 ? -6 : 1 - dayOfWeek;

       date.setDate(date.getDate() + difference);

       const mondayYear = date.getFullYear();
       const mondayMonth = String(date.getMonth() + 1).padStart(2, "0");
       const mondayDay = String(date.getDate()).padStart(2, "0");

       return `${mondayYear}-${mondayMonth}-${mondayDay}`;
   };

   const today = new Date();

   const todayString =
       `${today.getFullYear()}-${String(today.getMonth() + 1).padStart(2, "0")}-${String(today.getDate()).padStart(2, "0")}`;

   const [startDate, setStartDate] = useState(
       getMonday(todayString)
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
                              getMonday(event.target.value)
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

                    {/* DAILY BREAKDOWN */}

                    <section className="weekly-analytics">

                        <div className="weekly-section-heading">

                            <span>
                                DAILY BREAKDOWN
                            </span>

                            <h2>
                                How your week actually went.
                            </h2>

                            <p>
                                Compare your planned time with what you actually completed each day.
                            </p>

                        </div>


                        <div className="weekly-days">

                            {replay.days.map((day) => {

                                const [year, month, dayNumber] =
                                    day.date.split("-").map(Number);

                                const date = new Date(
                                    year,
                                    month - 1,
                                    dayNumber
                                );

                                const dayName = date.toLocaleDateString(
                                    "en-US",
                                    { weekday: "short" }
                                );

                                const dateLabel = date.toLocaleDateString(
                                    "en-US",
                                    {
                                        day: "numeric",
                                        month: "short"
                                    }
                                );

                                return (

                                    <div
                                        className="weekly-day-card"
                                        key={day.date}
                                    >

                                        <div className="weekly-day-header">

                                            <div>
                                                <strong>
                                                    {dayName}
                                                </strong>

                                                <span>
                                                    {dateLabel}
                                                </span>
                                            </div>

                                            <strong>
                                                {day.completionPercentage.toFixed(0)}%
                                            </strong>

                                        </div>


                                        <div className="weekly-day-stats">

                                            <div>
                                                <span>
                                                    PLANNED
                                                </span>

                                                <strong>
                                                    {formatMinutes(
                                                        day.plannedMinutes
                                                    )}
                                                </strong>
                                            </div>


                                            <div>
                                                <span>
                                                    ACTUAL
                                                </span>

                                                <strong>
                                                    {formatMinutes(
                                                        day.actualMinutes
                                                    )}
                                                </strong>
                                            </div>


                                            <div>
                                                <span>
                                                    DIFFERENCE
                                                </span>

                                                <strong>
                                                    {day.differenceMinutes > 0
                                                        ? "+"
                                                        : ""}
                                                    {formatMinutes(
                                                        day.differenceMinutes
                                                    )}
                                                </strong>
                                            </div>

                                        </div>


                                        <div className="weekly-day-progress">

                                            <div
                                                style={{
                                                    width: `${Math.min(
                                                        day.completionPercentage,
                                                        100
                                                    )}%`
                                                }}
                                            />

                                        </div>

                                    </div>

                                );

                            })}

                        </div>

                    </section>

                </>

            )}

        </main>
    );
};

export default WeeklyReplay;