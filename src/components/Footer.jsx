import React from "react";
import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-container">
                <div className="footer-content">
                    <div className="footer-section">
                        <h3>Grocery Inventory Manager</h3>
                        <p>Track your groceries and never miss an expiry date again!</p>
                    </div>

                    <div className="footer-section">
                        <h4>Developer Info</h4>
                        <div className="contact-info">
                            <p>
                                <span className="icon">📧</span>
                                <a href="mailto:surenderthakur40437@gmail.com">
                                    surenderthakur40437@gmail.com
                                </a>
                            </p>
                            <p>
                                <span className="icon">📍</span>
                                Bilaspur, Himachal Pradesh
                            </p>
                        </div>
                    </div>

                    <div className="footer-section">
                        <h4>Connect</h4>
                        <div className="social-links">
                            <a
                                href="https://www.linkedin.com/in/surender-kumar-2399b7275"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                            >
                                <span className="icon">💼</span> LinkedIn
                            </a>
                            <a
                                href="https://github.com/surender8752"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="social-link"
                            >
                                <span className="icon">💻</span> GitHub
                            </a>
                        </div>
                    </div>
                </div>

                <div className="footer-bottom">
                    <p>&copy; {new Date().getFullYear()} Grocery App. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
