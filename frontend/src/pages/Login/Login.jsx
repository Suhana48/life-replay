import { useState } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

const Login = () => {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (event) => {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    };

    const handleSubmit = async (event) => {
        event.preventDefault();

        setError("");

        if (!formData.email.trim()) {
            setError("Email is required.");
            return;
        }

        if (!formData.password) {
            setError("Password is required.");
            return;
        }

        try {
            setLoading(true);

            await login(
                formData.email.trim(),
                formData.password
            );

            navigate("/", { replace: true });
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Invalid email or password.";

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to login. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

   return (
       <div className="login-page">
           <div className="login-card">

               <h1>Life Replay</h1>

               <h2>Welcome back</h2>
               <p className="login-subtitle">
                   Reconnect with your time and pick up where you left off.
               </p>

               <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="email">
                        Email
                    </label>

                    <input
                        id="email"
                        name="email"
                        type="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Enter your email"
                        autoComplete="email"
                    />
                </div>

                <div>
                    <label htmlFor="password">
                        Password
                    </label>

                    <div className="login-password-field">
                        <input
                            id="password"
                            name="password"
                            type={showPassword ? "text" : "password"}
                            value={formData.password}
                            onChange={handleChange}
                            placeholder="Enter your password"
                            autoComplete="current-password"
                        />

                        <button
                            type="button"
                            className="login-password-toggle"
                            onClick={() => setShowPassword((previous) => !previous)}
                            aria-label={
                                showPassword
                                    ? "Hide password"
                                    : "Show password"
                            }
                        >
                            {showPassword ? "Hide" : "Show"}
                        </button>
                    </div>
                </div>

                {error && (
                    <p role="alert">
                        {error}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading ? "Signing in..." : "Sign in"}
                </button>
            </form>

            <p>
                Don't have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/register")}
                >
                    Create account
                </button>
            </p>

                </div>
            </div>
    );
};

export default Login;