import { useEffect, useState } from "react";
import { getDailyReplay } from "../../services/replayService";

function DailyReplay() {
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

                setError("Unable to load daily replay.");
                setReplay(null);
            } finally {
                setLoading(false);
            }
        };

        loadReplay();
    }, [date]);

    return (
        <section>
            <h1>Daily Replay</h1>

            <input
                type="date"
                value={date}
                onChange={(event) =>
                    setDate(event.target.value)
                }
            />

            {loading && <p>Loading replay...</p>}

            {error && <p>{error}</p>}

            {replay && !loading && (
                <div>
                    <h2>
                        Replay for {replay.date}
                    </h2>

                    <p>
                        Planned: {replay.totalPlannedMinutes} minutes
                    </p>

                    <p>
                        Actual: {replay.totalActualMinutes} minutes
                    </p>

                    <p>
                        Difference: {replay.totalDifferenceMinutes} minutes
                    </p>

                    <p>
                        Completion:{" "}
                        {replay.overallCompletionPercentage.toFixed(1)}%
                    </p>

                    <hr />

                    {replay.activities.map((activity) => (
                        <div key={activity.activityId}>
                            <h3>
                                {activity.activityName}
                            </h3>

                            <p>
                                Planned:{" "}
                                {activity.plannedMinutes} min
                            </p>

                            <p>
                                Actual:{" "}
                                {activity.actualMinutes} min
                            </p>

                            <p>
                                Difference:{" "}
                                {activity.differenceMinutes} min
                            </p>

                            <p>
                                Completion:{" "}
                                {activity.completionPercentage.toFixed(1)}%
                            </p>
                        </div>
                    ))}
                </div>
            )}
        </section>
    );
}

export default DailyReplay;