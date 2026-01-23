import { useState } from "react";
import Dashboard from "../components/Dashboard";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import "./Home.css";


export default function Home({ notificationEnabled, requestPermission }) {
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

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
                    <SearchBar onSearch={setSearchQuery} />
                    <ProductList
                        onEdit={() => { }}
                        readOnly={true}
                        filterStatus={filterStatus}
                        onClearFilter={() => setFilterStatus("all")}
                        searchQuery={searchQuery}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
