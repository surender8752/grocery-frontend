import React, { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Dashboard() {
    const [stats, setStats] = useState({
        total: 0,
        expiringSoon: 0,
        expired: 0,
        fresh: 0,
    });

    useEffect(() => {
        fetchStats();
    }, [fetchStats]);

    const fetchStats = useCallback(async () => {
        const API_URL = (process.env.REACT_APP_API_URL || "http://localhost:5000").replace(/\/$/, "");
        try {
            const response = await axios.get(`${API_URL}/products`);
            const products = response.data;

            const today = new Date();

            const expiringSoon = products.filter((p) => {
                const daysLeft = Math.ceil(
                    (new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24)
                );
                return daysLeft > 0 && daysLeft <= p.notifyBeforeDays;
            }).length;

            const expired = products.filter((p) => {
                const daysLeft = Math.ceil(
                    (new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24)
                );
                return daysLeft < 0;
            }).length;

            const fresh = products.filter((p) => {
                const daysLeft = Math.ceil(
                    (new Date(p.expiryDate) - today) / (1000 * 60 * 60 * 24)
                );
                return daysLeft > p.notifyBeforeDays;
            }).length;

            setStats({
                total: products.length,
                expiringSoon,
                expired,
                fresh,
            });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    }, []);

    return (
        <div className="dashboard">
            <h2>📊 Dashboard</h2>

            <div className="stats-grid">
                <div className="stat-card total">
                    <div className="stat-icon">📦</div>
                    <div className="stat-info">
                        <h3>{stats.total}</h3>
                        <p>Total Items</p>
                    </div>
                </div>

                <div className="stat-card fresh">
                    <div className="stat-icon">✅</div>
                    <div className="stat-info">
                        <h3>{stats.fresh}</h3>
                        <p>Fresh Items</p>
                    </div>
                </div>

                <div className="stat-card expiring">
                    <div className="stat-icon">⚠️</div>
                    <div className="stat-info">
                        <h3>{stats.expiringSoon}</h3>
                        <p>Expiring Soon</p>
                    </div>
                </div>

                <div className="stat-card expired">
                    <div className="stat-icon">❌</div>
                    <div className="stat-info">
                        <h3>{stats.expired}</h3>
                        <p>Expired</p>
                    </div>
                </div>
            </div>
        </div>
    );
}