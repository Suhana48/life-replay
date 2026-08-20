import { Navigate, Route, Routes } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

import Login from "../pages/Login/Login";
import Register from "../pages/Register/Register";
import AppLayout from "../components/layout/AppLayout";
import Dashboard from "../pages/Dashboard/Dashboard";
import Activities from "../pages/Activities/Activities";
import DailyPlan from "../pages/DailyPlan/DailyPlan";
import DailyActual from "../pages/DailyActual/DailyActual";
import DailyReplay from "../pages/DailyReplay/DailyReplay";
import WeeklyReplay from "../pages/WeeklyReplay/WeeklyReplay";

const ProtectedRoute = ({ children }) => {
    const { isAuthenticated } = useAuth();

    if (!isAuthenticated) {
        return <Navigate to="/login" replace />;
    }

    return children;
};

const AppRoutes = () => {
    return (
        <Routes>

            {/* =========================
                PUBLIC ROUTES
            ========================= */}

            <Route
                path="/login"
                element={<Login />}
            />

            <Route
                path="/register"
                element={<Register />}
            />


            {/* =========================
                PROTECTED APPLICATION
            ========================= */}

            <Route
                element={
                    <ProtectedRoute>
                        <AppLayout />
                    </ProtectedRoute>
                }
            >

                {/* Dashboard */}
               <Route
                 path="/"
                 element={<Dashboard />}
               />

                {/* Future pages */}
                <Route
                    path="/activities"
                    element={<Activities />}
                />

                <Route
                    path="/plan"
                    element={<DailyPlan />}
                />
                <Route
                    path="/actual"
                    element={<DailyActual />}
                />

              <Route
                  path="/replay/daily"
                  element={<DailyReplay />}
              />

                <Route
                    path="/replay/weekly"
                    element={<WeeklyReplay />}
                />

                <Route
                    path="/replay/monthly"
                    element={
                        <div>
                            Monthly Replay
                        </div>
                    }
                />

                <Route
                    path="/insights"
                    element={
                        <div>
                            Insights
                        </div>
                    }
                />

            </Route>


            {/* =========================
                FALLBACK
            ========================= */}

            <Route
                path="*"
                element={<Navigate to="/" replace />}
            />

        </Routes>
    );
};

export default AppRoutes;