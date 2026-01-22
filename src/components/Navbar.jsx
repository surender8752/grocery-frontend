import { Link, useLocation } from "react-router-dom";

export default function Navbar() {
    const location = useLocation();

    return (
        <nav className="navbar">
            <Link to="/" className="nav-logo">
                📦 Mahajan Grocery Store
            </Link>
            <div className="nav-links">
                <Link
                    to="/"
                    className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                >
                    Dashboard
                </Link>
                <Link
                    to="/admin"
                    className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}
                >
                    Inventory
                </Link>
                <Link
                    to="/admin"
                    className="nav-link"
                >
                    Add Item
                </Link>
            </div>
        </nav>
    );
}
