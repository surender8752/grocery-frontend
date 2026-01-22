import React from "react";
import Dashboard from "../components/Dashboard";
import ProductList from "../components/ProductList";
import Navbar from "../components/Navbar";
import "./Home.css";


export default function Home({ notificationEnabled, requestPermission }) {
    const [filterStatus, setFilterStatus] = React.useState("all");

    return (
        <div className="home-page">
            <Navbar />

            <div className="container">
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
            </div>
        </div>
    );
}
