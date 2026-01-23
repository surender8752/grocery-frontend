import { Link, useLocation } from "react-router-dom";
import { useState } from "react";

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
                <Link to="/" className="nav-logo">
                    📦 Mahajan Grocery Store
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
                        className="nav-link"
                        style={{ background: 'rgba(99, 91, 255, 0.1)', color: 'var(--primary-blue)' }}
                        onClick={closeMenu}
                    >
                        + Add Item
                    </Link>
                </div>
            </nav>

            <div className={`nav-overlay ${isMenuOpen ? 'active' : ''}`} onClick={closeMenu}></div>
        </>
    );
}
