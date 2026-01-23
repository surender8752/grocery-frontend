import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                {/* Brand Section */}
                <div className="footer-section">
                    <h3 className="footer-brand">
                        <span style={{ filter: 'drop-shadow(0 0 10px rgba(6, 182, 212, 0.5))' }}>📦</span>
                        SK Grocery Store
                    </h3>
                    <p className="footer-description">
                        Revolutionizing inventory management with modern, intuitive, and high-performance solutions for your daily grocery needs.
                    </p>
                </div>

                {/* Quick Links Section */}
                <div className="footer-section">
                    <h4 className="footer-heading">Quick Links</h4>
                    <div className="footer-links">
                        <a href="/" className="footer-link">
                            <span>🏠</span> Dashboard
                        </a>
                        <a href="/admin" className="footer-link">
                            <span>📦</span> Inventory
                        </a>
                        <a href="/admin" className="footer-link">
                            <span>➕</span> Add New Item
                        </a>
                    </div>
                </div>

                {/* Contact & Support Section */}
                <div className="footer-section">
                    <h4 className="footer-heading">Developer</h4>
                    <div className="contact-card">
                        <div className="contact-item">
                            <div className="contact-icon">📧</div>
                            <div className="contact-info">
                                <span className="contact-label">Developer Email</span>
                                <span className="contact-value">surenderthakur40437@gmail.com</span>
                            </div>
                        </div>
                        <div className="contact-item">
                            <div className="contact-icon">📍</div>
                            <div className="contact-info">
                                <span className="contact-label">Location</span>
                                <span className="contact-value">Bilaspur, Himachal Pradesh</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© 2026 Sk Grocery Store. All rights reserved. | Built for Excellence</p>
            </div>
        </footer>
    );
}
