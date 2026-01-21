import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Login.css";

export default function Login() {
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({
        username: "",
        email: "",
        password: "",
    });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const { login, register } = useAuth();
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);

        try {
            let result;
            if (isLogin) {
                result = await login(formData.username, formData.password);
            } else {
                result = await register(
                    formData.username,
                    formData.email,
                    formData.password
                );
            }

            if (result.success) {
                navigate("/admin");
            } else {
                setError(result.error);
            }
        } catch (err) {
            setError("Something went wrong");
        } finally {
            setLoading(false);
        }
    };

    const toggleMode = () => {
        setIsLogin(!isLogin);
        setError("");
        setFormData({ username: "", email: "", password: "" });
    };

    return (
        <div className="login-container">
            <div className="login-card">
                <div className="login-header">
                    <h2>🔐 Admin {isLogin ? "Login" : "Register"}</h2>
                    <p>Grocery Inventory Management System</p>
                </div>

                {error && <div className="error-message">{error}</div>}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Username</label>
                        <input
                            type="text"
                            placeholder="Enter username"
                            value={formData.username}
                            onChange={(e) =>
                                setFormData({ ...formData, username: e.target.value })
                            }
                            required
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>Email</label>
                            <input
                                type="email"
                                placeholder="Enter email"
                                value={formData.email}
                                onChange={(e) =>
                                    setFormData({ ...formData, email: e.target.value })
                                }
                                required
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Password</label>
                        <input
                            type="password"
                            placeholder="Enter password"
                            value={formData.password}
                            onChange={(e) =>
                                setFormData({ ...formData, password: e.target.value })
                            }
                            required
                            minLength={6}
                        />
                    </div>

                    <button type="submit" className="btn-login" disabled={loading}>
                        {loading ? "Please wait..." : isLogin ? "Login" : "Register"}
                    </button>
                </form>

                <div className="toggle-mode">
                    <p>
                        {isLogin ? "Don't have an account?" : "Already have an account?"}{" "}
                        <span onClick={toggleMode}>
                            {isLogin ? "Register" : "Login"}
                        </span>
                    </p>
                </div>
            </div>
        </div>
    );
}
