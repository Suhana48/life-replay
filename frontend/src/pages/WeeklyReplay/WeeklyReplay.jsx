import "./WeeklyReplay.css";

const WeeklyReplay = () => {
    return (
        <main className="weekly-replay-page">

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
                    />
                </div>

            </section>

            <section className="weekly-placeholder">
                <span>WEEKLY ANALYTICS</span>

                <h2>
                    Your weekly replay will appear here.
                </h2>

                <p>
                    Planned time, actual time, daily trends,
                    and weekly patterns.
                </p>
            </section>

        </main>
    );
};

export default WeeklyReplay;