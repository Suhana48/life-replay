import "./Dashboard.css";

function Dashboard() {
    return (
        <section className="dashboard-page">

            {/* Page heading */}
            <div className="dashboard-heading">
                <div>
                    <p className="dashboard-eyebrow">
                        TODAY
                    </p>

                    <h1>
                        Your day, at a glance.
                    </h1>

                    <p className="dashboard-description">
                        See how your planned time compares with
                        how you actually spent it.
                    </p>
                </div>

                <div className="dashboard-date">
                    Wednesday, August 12
                </div>
            </div>


            {/* Summary cards */}
            <div className="dashboard-summary-grid">

                <article className="dashboard-card">
                    <span className="dashboard-card-label">
                        Planned
                    </span>

                    <strong className="dashboard-card-value">
                        0h 00m
                    </strong>

                    <span className="dashboard-card-meta">
                        Nothing planned yet
                    </span>
                </article>


                <article className="dashboard-card">
                    <span className="dashboard-card-label">
                        Actual
                    </span>

                    <strong className="dashboard-card-value">
                        0h 00m
                    </strong>

                    <span className="dashboard-card-meta">
                        No time recorded
                    </span>
                </article>


                <article className="dashboard-card">
                    <span className="dashboard-card-label">
                        Difference
                    </span>

                    <strong className="dashboard-card-value">
                        0m
                    </strong>

                    <span className="dashboard-card-meta">
                        Planned − actual
                    </span>
                </article>


                <article className="dashboard-card dashboard-card-accent">
                    <span className="dashboard-card-label">
                        Completion
                    </span>

                    <strong className="dashboard-card-value">
                        0%
                    </strong>

                    <span className="dashboard-card-meta">
                        Today's progress
                    </span>
                </article>

            </div>


            {/* Main dashboard grid */}
            <div className="dashboard-main-grid">

                {/* Today's activities */}
                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">
                        <div>
                            <p className="dashboard-panel-eyebrow">
                                TODAY
                            </p>

                            <h2>
                                Activity overview
                            </h2>
                        </div>

                        <button
                            type="button"
                            className="dashboard-panel-action"
                        >
                            View all
                        </button>
                    </div>


                    <div className="dashboard-empty-state">

                        <div className="dashboard-empty-icon">
                            +
                        </div>

                        <h3>
                            Nothing here yet
                        </h3>

                        <p>
                            Create an activity and start planning
                            your day.
                        </p>

                        <button
                            type="button"
                            className="dashboard-primary-button"
                        >
                            Create activity
                        </button>

                    </div>

                </section>


                {/* Quick actions */}
                <section className="dashboard-panel">

                    <div className="dashboard-panel-header">
                        <div>
                            <p className="dashboard-panel-eyebrow">
                                QUICK ACTIONS
                            </p>

                            <h2>
                                Keep your day moving
                            </h2>
                        </div>
                    </div>


                    <div className="dashboard-actions">

                        <button
                            type="button"
                            className="dashboard-action"
                        >
                            <span>
                                Plan today
                            </span>

                            <span>
                                →
                            </span>
                        </button>


                        <button
                            type="button"
                            className="dashboard-action"
                        >
                            <span>
                                Record actual time
                            </span>

                            <span>
                                →
                            </span>
                        </button>


                        <button
                            type="button"
                            className="dashboard-action"
                        >
                            <span>
                                Replay your day
                            </span>

                            <span>
                                →
                            </span>
                        </button>

                    </div>

                </section>

            </div>


            {/* Replay preview */}
            <section className="dashboard-panel dashboard-replay-panel">

                <div className="dashboard-panel-header">
                    <div>
                        <p className="dashboard-panel-eyebrow">
                            LIFE REPLAY
                        </p>

                        <h2>
                            Look back. Learn. Adjust.
                        </h2>
                    </div>

                    <button
                        type="button"
                        className="dashboard-panel-action"
                    >
                        Open replay
                    </button>
                </div>


                <div className="dashboard-replay-content">

                    <div>
                        <strong>
                            Your story starts here.
                        </strong>

                        <p>
                            Once you plan and record your time,
                            Life Replay will turn your days into
                            patterns you can actually understand.
                        </p>
                    </div>

                    <div className="dashboard-replay-stat">
                        <span>
                            Replay data
                        </span>

                        <strong>
                            0 days
                        </strong>
                    </div>

                </div>

            </section>

        </section>
    );
}

export default Dashboard;