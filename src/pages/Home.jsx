import React from "react";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import ProductList from "../components/ProductList";
import "./Home.css";


export default function Home({ notificationEnabled, requestPermission }) {
    const navigate = useNavigate();

    const [filterStatus, setFilterStatus] = React.useState("all");

    return (
        <div className="home-page">
            <header className="home-header">
                <div className="header-content">
                    <div>
                        <h1>🛒 Grocery Inventory Manager</h1>
                        <p>Track expiry dates and get timely notifications</p>
                    </div>
                    <button onClick={() => navigate("/login")} className="btn-admin-login">
                        🔐 Admin Login
                    </button>
                </div>
            </header>

            <div className="home-container">
                {!notificationEnabled && (
                    <div className="notification-banner">
                        <p>
                            🔔 Enable notifications to receive expiry alerts on your mobile
                        </p>
                        <button onClick={requestPermission} className="btn-notification">
                            Enable Notifications
                        </button>
                    </div>
                )}

                <Dashboard onFilter={setFilterStatus} />

                <div className="home-content">
                    <ProductList
                        onEdit={() => { }}
                        readOnly={true}
                        filterStatus={filterStatus}
                        onClearFilter={() => setFilterStatus("all")}
                    />
                </div>

                <div className="admin-cta">
                    <h3>Want to manage products?</h3>
                    <p>Login to admin panel to add, edit, or delete products</p>
                    <button onClick={() => navigate("/login")} className="btn-cta">
                        Go to Admin Panel
                    </button>
                </div>
            </div>

            <footer className="home-footer">
                <p>Made with ❤️ for better grocery management</p>
            </footer>
        </div>
    );
}
