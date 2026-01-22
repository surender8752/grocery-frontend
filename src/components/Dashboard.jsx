import { useState, useEffect, useCallback } from "react";
import axios from "axios";

export default function Dashboard({ onFilter, refresh }) {
    const [stats, setStats] = useState({
        total: 0,
        expiringSoon: 0,
        expired: 0,
        fresh: 0,
        totalValue: 0,
        totalStock: 0,
        lowStock: 0,
    });

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

            const totalValue = products.reduce((sum, p) => {
                const price = Number(p.price) || 0;
                const qty = Number(p.quantity) || 0;
                return sum + (price * qty);
            }, 0);

            const totalStock = products.reduce((sum, p) => sum + (Number(p.quantity) || 0), 0);

            const lowStock = products.filter(p => (Number(p.quantity) || 0) < 5).length;

            setStats({
                total: products.length,
                expiringSoon,
                expired,
                fresh,
                totalValue,
                totalStock,
                lowStock,
            });
        } catch (error) {
            console.error("Error fetching stats:", error.response?.data || error.message);
        }
    }, []);

    useEffect(() => {
        fetchStats();
    }, [refresh, fetchStats]);

    return (
        <div className="dashboard">
            <div className="section-header">
                <h1>Dashboard</h1>
                <p>Overview of Mahajan Grocery Store system</p>
            </div>

            <div className="stats-grid">
                <div className="stat-card clickable" onClick={() => onFilter && onFilter("all")}>
                    <div className="stat-icon-wrapper purple">📦</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.total}</span>
                        <span className="stat-label">Total Items</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper pink">💰</div>
                    <div className="stat-info">
                        <span className="stat-value">₹{stats.totalValue.toLocaleString("en-IN")}</span>
                        <span className="stat-label">Total Value</span>
                    </div>
                </div>

                <div className="stat-card clickable" onClick={() => onFilter && onFilter("expiring-soon")}>
                    <div className="stat-icon-wrapper yellow">⚠️</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.lowStock}</span>
                        <span className="stat-label">Low Stock Alerts</span>
                    </div>
                </div>

                <div className="stat-card">
                    <div className="stat-icon-wrapper blue">🛒</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.totalStock}</span>
                        <span className="stat-label">Total Quantity</span>
                    </div>
                </div>
            </div>

            <div className="stats-grid">
                <div className="stat-card clickable" onClick={() => onFilter && onFilter("fresh")}>
                    <div className="stat-icon-wrapper green">✅</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.fresh}</span>
                        <span className="stat-label">Fresh Items</span>
                    </div>
                </div>

                <div className="stat-card clickable" onClick={() => onFilter && onFilter("expired")}>
                    <div className="stat-icon-wrapper red">❌</div>
                    <div className="stat-info">
                        <span className="stat-value">{stats.expired}</span>
                        <span className="stat-label">Expired Items</span>
                    </div>
                </div>
            </div>
        </div>
    );
}