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
            <nav className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b-2 border-gray-100 shadow-sm">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <Link
                        to="/"
                        className="text-2xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent hover:scale-105 transition-transform duration-300 flex items-center gap-2"
                    >
                        <span className="text-3xl">📦</span>
                        Mahajan Grocery Store
                    </Link>

                    {/* Hamburger Menu Button */}
                    <button
                        onClick={toggleMenu}
                        className="md:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        <div className="space-y-1.5">
                            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMenuOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-gray-800 transition-opacity duration-300 ${isMenuOpen ? 'opacity-0' : ''}`}></span>
                            <span className={`block w-6 h-0.5 bg-gray-800 transition-transform duration-300 ${isMenuOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
                        </div>
                    </button>

                    {/* Desktop Navigation */}
                    <div className="hidden md:flex items-center gap-2">
                        <Link
                            to="/"
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${location.pathname === "/"
                                    ? "text-white bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-colored-secondary hover:shadow-xl transform hover:-translate-y-0.5"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={closeMenu}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin"
                            className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${location.pathname === "/admin"
                                    ? "text-white bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-colored-secondary hover:shadow-xl transform hover:-translate-y-0.5"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={closeMenu}
                        >
                            Inventory
                        </Link>
                        <Link
                            to="/admin"
                            className="px-6 py-2.5 rounded-xl font-semibold bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            onClick={closeMenu}
                        >
                            + Add Item
                        </Link>
                    </div>
                </div>

                {/* Mobile Menu */}
                <div
                    className={`md:hidden fixed top-0 right-0 w-80 h-screen bg-white shadow-2xl transform transition-transform duration-300 ease-in-out ${isMenuOpen ? 'translate-x-0' : 'translate-x-full'
                        }`}
                >
                    <div className="p-6 space-y-4 mt-20">
                        <Link
                            to="/"
                            className={`block px-6 py-3 rounded-xl font-semibold transition-all ${location.pathname === "/"
                                    ? "text-white bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-lg"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={closeMenu}
                        >
                            Dashboard
                        </Link>
                        <Link
                            to="/admin"
                            className={`block px-6 py-3 rounded-xl font-semibold transition-all ${location.pathname === "/admin"
                                    ? "text-white bg-gradient-to-r from-secondary-500 to-secondary-600 shadow-lg"
                                    : "text-gray-600 hover:bg-gray-100"
                                }`}
                            onClick={closeMenu}
                        >
                            Inventory
                        </Link>
                        <Link
                            to="/admin"
                            className="block px-6 py-3 rounded-xl font-semibold bg-primary-50 text-primary-600 hover:bg-primary-100 transition-colors"
                            onClick={closeMenu}
                        >
                            + Add Item
                        </Link>
                    </div>
                </div>
            </nav>

            {/* Overlay */}
            <div
                className={`fixed inset-0 bg-black/50 z-40 md:hidden transition-opacity duration-300 ${isMenuOpen ? 'opacity-100' : 'opacity-0 pointer-events-none'
                    }`}
                onClick={closeMenu}
            ></div>
        </>
    );
}
