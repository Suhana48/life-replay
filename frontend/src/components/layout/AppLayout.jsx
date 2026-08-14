import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./AppLayout.css";

const AppLayout = () => {
    const navigate = useNavigate();
    const { logout } = useAuth();

    const handleLogout = () => {
        logout();
        navigate("/login", { replace: true });
    };

    return (
        <div className="app-layout">

            {/* Sidebar */}
            <aside className="app-sidebar">

                <div className="sidebar-brand">
                    <h1>Life Replay</h1>
                    <span>Your time, replayed.</span>
                </div>

                <nav className="sidebar-navigation">

                    <NavLink
                        to="/"
                        end
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Dashboard
                    </NavLink>

                    <NavLink
                        to="/activities"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Activities
                    </NavLink>

                    <NavLink
                        to="/plan"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Daily Plan
                    </NavLink>

                    <NavLink
                        to="/replay/daily"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Daily Replay
                    </NavLink>

                    <NavLink
                        to="/replay/weekly"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Weekly Replay
                    </NavLink>

                    <NavLink
                        to="/replay/monthly"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Monthly Replay
                    </NavLink>

                    <NavLink
                        to="/insights"
                        className={({ isActive }) =>
                            isActive
                                ? "nav-link active"
                                : "nav-link"
                        }
                    >
                        Insights
                    </NavLink>

                </nav>

                <div className="sidebar-footer">
                    <button
                        type="button"
                        className="logout-button"
                        onClick={handleLogout}
                    >
                        Sign out
                    </button>
                </div>

            </aside>

            {/* Main application area */}
            <div className="app-main">

                <header className="app-header">
                    <div>
                        <span className="header-eyebrow">
                            LIFE REPLAY
                        </span>

                        <h2>
                            Understand how you spend your time.
                        </h2>
                    </div>
                </header>

                <main className="app-content">
                    <Outlet />
                </main>

            </div>

        </div>
    );
};

export default AppLayout;