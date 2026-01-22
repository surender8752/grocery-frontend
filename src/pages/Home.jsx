import { useState } from "react";
import Dashboard from "../components/Dashboard";
import ProductList from "../components/ProductList";
import Navbar from "../components/Navbar";
import "./Home.css";


export default function Home({ notificationEnabled, requestPermission }) {
    const [filterStatus, setFilterStatus] = useState("all");

    return (
        <div className="home-page">
            <Navbar />

            <div className="container">
                {!notificationEnabled && (
                    <div className="notification-card">
                        <div className="notification-icon-box">🔔</div>
                        <div className="notification-body">
                            <h4>Stay Updated!</h4>
                            <p>Enable notifications to receive timely expiry alerts on your mobile device.</p>
                        </div>
                        <button onClick={requestPermission} className="btn-notification">
                            Enable Now
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
