import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">

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
                <p>© 2026 SK™. All Rights Reserved.</p>
                <p style={{ marginTop: '0.5rem', opacity: 0.8 }}>Designed & Developed by SK™ with ❤️</p>
            </div>
        </footer>
    );
}
