import { useEffect, useState } from "react";
import { getDailyReplay } from "../../services/replayService";
import "./DailyReplay.css";
import {
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    ResponsiveContainer,
    Legend,
    Cell,
    PieChart,
    Pie
} from "recharts";

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

const DailyReplay = () => {
    const [date, setDate] = useState(
        new Date().toISOString().split("T")[0]
    );

    const [replay, setReplay] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        const loadReplay = async () => {
            setLoading(true);
            setError("");

            try {
                const response = await getDailyReplay(date);
                setReplay(response.data);
            } catch (error) {
                console.error(
                    "Failed to load daily replay:",
                    error.response?.data || error
                );

                setReplay(null);
                setError("Unable to load daily replay.");
            } finally {
                setLoading(false);
            }
        };

        loadReplay();
    }, [date]);

    const activities = replay?.activities || [];

    const maxActivityMinutes = Math.max(
        ...activities.flatMap((activity) => [
            activity.plannedMinutes,
            activity.actualMinutes,
        ]),
        1
    );
const biggestGapActivity = activities
    .filter((activity) => activity.plannedMinutes > 0)
    .reduce(
        (largest, activity) =>
            Math.abs(activity.differenceMinutes) >
            Math.abs(largest?.differenceMinutes ?? 0)
                ? activity
                : largest,
        null
    );

const unplannedActivities = activities.filter(
    (activity) =>
        activity.plannedMinutes === 0 &&
        activity.actualMinutes > 0
);
const plannedActualMinutes = activities
    .filter((activity) => activity.plannedMinutes > 0)
    .reduce(
        (total, activity) => total + activity.actualMinutes,
        0
    );

const unplannedMinutes = unplannedActivities.reduce(
    (total, activity) => total + activity.actualMinutes,
    0
);

const overviewMaxMinutes = Math.max(
    replay?.totalPlannedMinutes || 0,
    plannedActualMinutes + unplannedMinutes,
    1
);

    return (
        <main className="daily-replay-page">

            {/* =========================
                HEADER
            ========================= */}

            <section className="daily-replay-header">

                <div>
                    <span className="page-eyebrow">
                        DAILY REPLAY
                    </span>

                    <h1>
                        See what actually happened.
                    </h1>

                    <p>
                        Compare your plan with the time you really spent.
                    </p>
                </div>

                <div className="date-selector">
                    <label htmlFor="replay-date">
                        Replay date
                    </label>

                    <input
                        id="replay-date"
                        type="date"
                        value={date}
                        onChange={(event) =>
                            setDate(event.target.value)
                        }
                    />
                </div>

            </section>


            {/* =========================
                LOADING / ERROR
            ========================= */}

            {loading && (
                <div className="replay-state">
                    Loading your day...
                </div>
            )}

            {error && !loading && (
                <div className="replay-state replay-error">
                    {error}
                </div>
            )}


            {/* =========================
                REPLAY CONTENT
            ========================= */}

            {replay && !loading && !error && (
                <>

                    {/* =========================
                        SUMMARY
                    ========================= */}

                    <section className="replay-summary">

                        <div className="summary-card">
                            <span>PLANNED</span>

                            <strong>
                                {formatMinutes(
                                    replay.totalPlannedMinutes
                                )}
                            </strong>

                            <small>
                                what you planned
                            </small>
                        </div>


                        <div className="summary-card">
                            <span>ACTUAL</span>

                            <strong>
                                {formatMinutes(
                                    replay.totalActualMinutes
                                )}
                            </strong>

                            <small>
                                what you actually did
                            </small>
                        </div>


                        <div
                            className={`summary-card ${
                                replay.totalDifferenceMinutes > 0
                                    ? "positive"
                                    : replay.totalDifferenceMinutes < 0
                                        ? "negative"
                                        : ""
                            }`}
                        >
                            <span>DIFFERENCE</span>


                                <strong>
                                    {replay.totalDifferenceMinutes > 0 ? "+" : ""}
                                    {formatMinutes(replay.totalDifferenceMinutes)}
                                </strong>


                            <small>
                                compared with your plan
                            </small>
                        </div>


                        <div className="summary-card completion-card">
                            <span>COMPLETION</span>

                            <strong>
                                {replay.overallCompletionPercentage.toFixed(
                                    1
                                )}
                                %
                            </strong>

                            <div className="completion-track">
                                <div
                                    className="completion-fill"
                                    style={{
                                        width: `${Math.min(
                                            replay.overallCompletionPercentage,
                                            100
                                        )}%`,
                                    }}
                                />
                            </div>
                        </div>

                    </section>


                    {/* =========================
                        DAY OVERVIEW
                    ========================= */}

                    <section className="replay-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">
                                    YOUR DAY
                                </span>

                                <h2>
                                    Planned vs actual
                                </h2>
                            </div>

                            <span className="activity-count">
                                {activities.length} activities
                            </span>
                        </div>


                       <div className="overview-card">

                           {/* PLANNED */}
                           <div className="overview-row">
                               <div className="overview-label">
                                   <span className="planned-dot" />
                                   Planned
                               </div>

                               <strong>
                                   {formatMinutes(replay.totalPlannedMinutes)}
                               </strong>
                           </div>

                           <div className="overview-track">
                               <div
                                   className="overview-planned"
                                   style={{
                                       width: `${
                                           (replay.totalPlannedMinutes /
                                               overviewMaxMinutes) *
                                           100
                                       }%`,
                                   }}
                               />
                           </div>


                           {/* ACTUAL ON PLANNED ACTIVITIES */}
                           <div className="overview-row actual-row">
                               <div className="overview-label">
                                   <span className="actual-dot" />
                                   Actual — planned activities
                               </div>

                               <strong>
                                   {formatMinutes(plannedActualMinutes)}
                               </strong>
                           </div>

                           <div className="overview-track">
                               <div
                                   className="overview-actual"
                                   style={{
                                       width: `${
                                           (plannedActualMinutes /
                                               overviewMaxMinutes) *
                                           100
                                       }%`,
                                   }}
                               />
                           </div>


                           {/* UNPLANNED */}
                           {unplannedMinutes > 0 && (
                               <>
                                   <div className="overview-row unplanned-row">
                                       <div className="overview-label">
                                           <span className="unplanned-dot" />
                                           Unplanned time
                                       </div>

                                       <strong>
                                           {formatMinutes(unplannedMinutes)}
                                       </strong>
                                   </div>

                                   <div className="overview-track">
                                       <div
                                           className="overview-unplanned"
                                           style={{
                                               width: `${
                                                   (unplannedMinutes /
                                                       overviewMaxMinutes) *
                                                   100
                                               }%`,
                                           }}
                                       />
                                   </div>
                               </>
                           )}

                       </div>

                    </section>
                    {/* =========================
                        PLANNED VS ACTUAL CHART
                    ========================= */}

                    <section className="replay-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">
                                    VISUAL REPLAY
                                </span>

                                <h2>
                                    Planned vs actual time.
                                </h2>
                            </div>
                        </div>
                        {biggestGapActivity && (
                            <div className="replay-highlight">

                                <div className="highlight-icon">
                                    ✦
                                </div>

                                <div className="highlight-content">
                                    <span className="highlight-label">
                                        BIGGEST GAP
                                    </span>

                                    <strong>
                                        {biggestGapActivity.activityName}
                                    </strong>

                                    <p>
                                        {Math.abs(
                                            biggestGapActivity.differenceMinutes
                                        ) >= 60
                                            ? `${Math.floor(
                                                  Math.abs(
                                                      biggestGapActivity.differenceMinutes
                                                  ) / 60
                                              )}h ${
                                                  Math.abs(
                                                      biggestGapActivity.differenceMinutes
                                                  ) % 60
                                              }m`
                                            : `${Math.abs(
                                                  biggestGapActivity.differenceMinutes
                                              )}m`}{" "}
                                        {biggestGapActivity.differenceMinutes < 0
                                            ? "less than planned"
                                            : "more than planned"}
                                    </p>
                                </div>

                            </div>
                        )}

                        <div className="replay-chart-card">

                            <ResponsiveContainer
                                width="100%"
                                height={360}
                            >
                                <BarChart
                                    data={activities}
                                    margin={{
                                        top: 20,
                                        right: 20,
                                        left: 0,
                                        bottom: 10
                                    }}
                                >

                                    <CartesianGrid
                                        strokeDasharray="3 3"
                                    />

                                    <XAxis
                                        dataKey="activityName"
                                    />

                                    <YAxis
                                        label={{
                                            value: "Minutes",
                                            angle: -90,
                                            position: "insideLeft"
                                        }}
                                    />

                                    <Tooltip
                                        contentStyle={{
                                            backgroundColor: "#1c1e29",
                                            border: "1px solid #383a4c",
                                            borderRadius: "12px",
                                            boxShadow: "0 12px 35px rgba(0, 0, 0, 0.35)"
                                        }}
                                        labelStyle={{
                                            color: "#f1f1f6",
                                            marginBottom: "6px"
                                        }}
                                        itemStyle={{
                                            color: "#b8b2ff"
                                        }}
                                        cursor={{
                                            fill: "rgba(142, 120, 255, 0.04)"
                                        }}
                                    />

                                    <Legend />

                                    <Bar
                                        dataKey="plannedMinutes"
                                        name="Planned"
                                        fill="#454858"
                                        radius={[6, 6, 0, 0]}
                                    />

                                    <Bar
                                        dataKey="actualMinutes"
                                        name="Actual"
                                        fill="#8B7CF6"
                                        radius={[6, 6, 0, 0]}
                                    >
                                        {activities.map((activity) => {

                                            let fill = "#8b7cf6";

                                          if (
                                              activity.plannedMinutes === 0 &&
                                              activity.actualMinutes > 0
                                          ) {
                                              fill = "#A18CFF";
                                          }

                                            return (
                                                <Cell
                                                    key={activity.activityId}
                                                    fill={fill}
                                                />
                                            );
                                        })}
                                    </Bar>

                                </BarChart>
                            </ResponsiveContainer>

                        </div>

                    </section>
                    <section className="replay-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">
                                    TIME DISTRIBUTION
                                </span>

                                <h2>
                                    Where your actual time went.
                                </h2>
                            </div>
                        </div>

                        <div className="distribution-card">

                            <div className="donut-chart">

                                <ResponsiveContainer
                                    width="100%"
                                    height={340}
                                >
                                    <PieChart>

                                        <Pie
                                            data={activities.filter(
                                                (activity) =>
                                                    activity.actualMinutes > 0
                                            )}
                                            dataKey="actualMinutes"
                                            nameKey="activityName"
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={90}
                                            outerRadius={125}
                                            paddingAngle={3}
                                        >

                                            {activities
                                                .filter(
                                                    (activity) =>
                                                        activity.actualMinutes > 0
                                                )
                                                .map((activity, index) => (

                                                    <Cell
                                                        key={activity.activityId}
                                                        fill={
                                                            [
                                                                "#8B7CF6",
                                                                "#7567D8",
                                                                "#A18CFF",
                                                                "#6255B5",
                                                                "#9183F5",
                                                                "#51458F"
                                                            ][index % 6]
                                                        }
                                                    />

                                                ))}

                                        </Pie>

                                        <Tooltip
                                            contentStyle={{
                                                backgroundColor: "#1C1E29",
                                                border: "1px solid #383A4C",
                                                borderRadius: "12px",
                                                boxShadow:
                                                    "0 12px 35px rgba(0, 0, 0, 0.35)"
                                            }}
                                            labelStyle={{
                                                color: "#F1F1F6",
                                                marginBottom: "6px"
                                            }}
                                            itemStyle={{
                                                color: "#B8B2FF"
                                            }}
                                        />

                                    </PieChart>
                                </ResponsiveContainer>

                                <div className="donut-center">

                                    <strong>
                                        {formatMinutes(
                                            replay.totalActualMinutes
                                        )}
                                    </strong>

                                    <span>
                                        actual time
                                    </span>

                                </div>

                            </div>


                            <div className="distribution-list">

                                {activities
                                    .filter(
                                        (activity) =>
                                            activity.actualMinutes > 0
                                    )
                                    .map((activity, index) => {

                                        const percentage =
                                            replay.totalActualMinutes > 0
                                                ? (
                                                    (activity.actualMinutes /
                                                        replay.totalActualMinutes) *
                                                    100
                                                ).toFixed(1)
                                                : 0;

                                        return (
                                            <div
                                                className="distribution-item"
                                                key={activity.activityId}
                                            >

                                                <div className="distribution-name">

                                                    <span
                                                        className="distribution-dot"
                                                        style={{
                                                            background:
                                                                [
                                                                    "#8B7CF6",
                                                                    "#7567D8",
                                                                    "#A18CFF",
                                                                    "#6255B5",
                                                                    "#9183F5",
                                                                    "#51458F"
                                                                ][index % 6]
                                                        }}
                                                    />

                                                    <span>
                                                        {activity.activityName}
                                                    </span>

                                                </div>

                                                <div className="distribution-value">

                                                    <strong>
                                                        {formatMinutes(
                                                            activity.actualMinutes
                                                        )}
                                                    </strong>

                                                    <span>
                                                        {percentage}%
                                                    </span>

                                                </div>

                                            </div>
                                        );
                                    })}

                            </div>

                        </div>

                    </section>
                    {/* =========================
                        COMPLETION BY ACTIVITY
                    ========================= */}

                    <section className="replay-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">
                                    FOLLOW-THROUGH
                                </span>

                                <h2>
                                    How closely you followed your plan.
                                </h2>
                            </div>
                        </div>

                        <div className="replay-chart-card">

                            <ResponsiveContainer
                                width="100%"
                                height={340}
                            >
                                <BarChart
                                    data={activities.filter(
                                        (activity) =>
                                            activity.plannedMinutes > 0
                                    )}
                                    layout="vertical"
                                    margin={{
                                        top: 10,
                                        right: 30,
                                        left: 20,
                                        bottom: 10
                                    }}
                                >

                                    <CartesianGrid
                                        horizontal={false}
                                        strokeDasharray="3 6"
                                    />

                                    <XAxis
                                        type="number"
                                        domain={[0, 100]}
                                        tickFormatter={(value) =>
                                            `${value}%`
                                        }
                                    />

                                    <YAxis
                                        type="category"
                                        dataKey="activityName"
                                        width={80}
                                    />

                                    <Tooltip
                                        formatter={(value) =>
                                            `${Number(value).toFixed(1)}%`
                                        }
                                        contentStyle={{
                                            backgroundColor: "#1C1E29",
                                            border: "1px solid #383A4C",
                                            borderRadius: "12px",
                                            boxShadow:
                                                "0 12px 35px rgba(0, 0, 0, 0.35)"
                                        }}
                                        labelStyle={{
                                            color: "#F1F1F6",
                                            marginBottom: "6px"
                                        }}
                                        itemStyle={{
                                            color: "#B8B2FF"
                                        }}
                                    />

                                    <Bar
                                        dataKey="completionPercentage"
                                        name="Completion"
                                        fill="#8B7CF6"
                                        radius={[0, 7, 7, 0]}
                                    />

                                </BarChart>
                            </ResponsiveContainer>

                        </div>

                    </section>


                    {/* =========================
                        ACTIVITY BREAKDOWN
                    ========================= */}

                    <section className="replay-section">

                        <div className="section-heading">
                            <div>
                                <span className="section-eyebrow">
                                    BREAKDOWN
                                </span>

                                <h2>
                                    Where your time went.
                                </h2>
                            </div>
                        </div>


                        <div className="replay-activities">

                            {activities.map((activity) => {

                                const isUnplanned =
                                    activity.plannedMinutes === 0;

                                const difference =
                                    activity.differenceMinutes;

                                const plannedWidth =
                                    (activity.plannedMinutes /
                                        maxActivityMinutes) *
                                    100;

                                const actualWidth =
                                    (activity.actualMinutes /
                                        maxActivityMinutes) *
                                    100;

                                return (
                                    <article
                                        className={`replay-activity-card ${
                                            isUnplanned
                                                ? "unplanned-card"
                                                : ""
                                        }`}
                                        key={activity.activityId}
                                    >

                                        <div className="activity-card-top">

                                            <div>
                                                <h3>
                                                    {activity.activityName}
                                                </h3>

                                                {isUnplanned ? (
                                                    <span className="unplanned-badge">
                                                        UNPLANNED
                                                    </span>
                                                ) : (
                                                    <span className="completion-label">
                                                        {
                                                            activity.completionPercentage
                                                        .toFixed(1)
                                                        }
                                                        % completed
                                                    </span>
                                                )}
                                            </div>

                                            <div
                                                className={`difference ${
                                                    difference > 0
                                                        ? "difference-positive"
                                                        : difference < 0
                                                            ? "difference-negative"
                                                            : ""
                                                }`}
                                            >
                                               {difference > 0 ? "+" : ""}
                                               {formatMinutes(difference)}
                                            </div>

                                        </div>


                                        <div className="activity-times">

                                            <div className="time-value">
                                                <span>
                                                    Planned
                                                </span>

                                                <strong>
                                                    {isUnplanned
                                                        ? "—"
                                                        : formatMinutes(
                                                              activity.plannedMinutes
                                                          )}
                                                </strong>
                                            </div>

                                            <div className="time-value">
                                                <span>
                                                    Actual
                                                </span>

                                                <strong>
                                                    {formatMinutes(
                                                        activity.actualMinutes
                                                    )}
                                                </strong>
                                            </div>

                                        </div>


                                        <div className="comparison">

                                            <div className="comparison-line">
                                                <span>
                                                    Planned
                                                </span>

                                                <div className="bar-track">
                                                    <div
                                                        className="planned-bar"
                                                        style={{
                                                            width: `${plannedWidth}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>


                                            <div className="comparison-line">
                                                <span>
                                                    Actual
                                                </span>

                                                <div className="bar-track">
                                                    <div
                                                        className="actual-bar"
                                                        style={{
                                                            width: `${actualWidth}%`,
                                                        }}
                                                    />
                                                </div>
                                            </div>

                                        </div>

                                    </article>
                                );
                            })}

                        </div>

                    </section>

                </>
            )}

        </main>
    );
};

export default DailyReplay;