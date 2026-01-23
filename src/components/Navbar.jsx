import { Link, useLocation } from "react-router-dom";
import { useState } from "react";
import "./Navbar.css";

export default function Navbar() {
    const location = useLocation();
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const closeMenu = () => {
        setIsMenuOpen(false);
    };

    return (
        <>
            <nav className="navbar">
                <div className="navbar-container">
                    <Link to="/" className="nav-logo">
                        <span style={{ fontSize: '2rem' }}>📦</span>
                        Mahajan Grocery Store
                    </Link>

                    <div className={`hamburger-menu ${isMenuOpen ? 'active' : ''}`} onClick={toggleMenu}>
                        <span></span>
                        <span></span>
                        <span></span>
                    </div>

                    <div className={`nav-links ${isMenuOpen ? 'open' : ''}`}>
                        <Link
                            to="/"
                            className={`nav-link ${location.pathname === "/" ? "active" : ""}`}
                            onClick={closeMenu}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin"
                            className={`nav-link ${location.pathname === "/admin" ? "active" : ""}`}
                            onClick={closeMenu}
                        >
                            Inventory
                        </Link>
                        <Link
                            to="/admin"
                            className="nav-link add-item"
                            onClick={closeMenu}
                        >
                            + Add Item
                        </Link>
                    </div>
                </div>
            </nav>

            <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
        </>
    );
}
