import { useState } from "react";
import "./Register.css";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../../services/authService";

const Register = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        password: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");
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
        setSuccess("");

        const name = formData.name.trim();
        const email = formData.email.trim();
        const password = formData.password;

        if (!name) {
            setError("Name is required.");
            return;
        }

        if (name.length > 100) {
            setError("Name must not exceed 100 characters.");
            return;
        }

        if (!email) {
            setError("Email is required.");
            return;
        }

        if (password.length < 8 || password.length > 100) {
            setError(
                "Password must be between 8 and 100 characters."
            );
            return;
        }

        try {
            setLoading(true);

            const message = await registerUser(
                name,
                email,
                password
            );

            setSuccess(
                typeof message === "string"
                    ? message
                    : "Registration successful."
            );

            setFormData({
                name: "",
                email: "",
                password: "",
            });
        } catch (err) {
            const message =
                err.response?.data?.message ||
                err.response?.data ||
                "Unable to create your account.";

            setError(
                typeof message === "string"
                    ? message
                    : "Unable to create your account. Please try again."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="register-page">
            <div className="register-card">

                <h1>Life Replay</h1>

                <h2>Create your account</h2>
                <p className="register-subtitle">
                    Start understanding how you spend your time.
                </p>

                <form onSubmit={handleSubmit}>

                <div>
                    <label htmlFor="name">
                        Name
                    </label>

                    <input
                        id="name"
                        name="name"
                        type="text"
                        value={formData.name}
                        onChange={handleChange}
                        placeholder="Enter your name"
                        maxLength={100}
                        autoComplete="name"
                    />
                </div>

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
                    <div>

                        <div className="register-password-field">
                            <input
                                id="password"
                                name="password"
                                type={showPassword ? "text" : "password"}
                                value={formData.password}
                                onChange={handleChange}
                                placeholder="Create a password"
                                minLength={8}
                                maxLength={100}
                                autoComplete="new-password"
                            />

                            <button
                                type="button"
                                className="register-password-toggle"
                                onClick={() =>
                                    setShowPassword((previous) => !previous)
                                }
                                aria-label={
                                    showPassword
                                        ? "Hide password"
                                        : "Show password"
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>
                        </div>


                        <p className="register-password-hint">
                            Use 8–100 characters.
                        </p>
                    </div>
                </div>

                {error && (
                    <p role="alert">
                        {error}
                    </p>
                )}

                {success && (
                    <p role="status">
                        {success}
                    </p>
                )}

                <button
                    type="submit"
                    disabled={loading}
                >
                    {loading
                        ? "Creating account..."
                        : "Create account"}
                </button>
            </form>

            <p>
                Already have an account?{" "}
                <button
                    type="button"
                    onClick={() => navigate("/login")}
                >
                    Sign in
                </button>
            </p>

                    </div>
                </div>
    );
};

export default Register;