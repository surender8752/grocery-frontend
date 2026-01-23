import "./Footer.css";

export default function Footer() {
    return (
        <footer className="footer">
            <div className="footer-content">
                <div className="footer-section">
                    <h3 className="footer-brand">SK Grocery App</h3>
                    <p className="footer-description">
                        Modern inventory management for your grocery store
                    </p>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Quick Links</h4>
                    <div className="footer-links">
                        <a href="/" className="footer-link">Dashboard</a>
                        <a href="/admin" className="footer-link">Products</a>
                        <a href="/admin" className="footer-link">Reports</a>
                    </div>
                </div>

                <div className="footer-section">
                    <h4 className="footer-heading">Contact</h4>
                    <p className="footer-text">
                        Made with <span style={{ color: '#f56565', fontSize: '1.2rem' }}>❤️</span> by SK Grocery App
                    </p>
                </div>
            </div>

            <div className="footer-bottom">
                <p>© {new Date().getFullYear()} Mahajan Grocery Store. All rights reserved.</p>
            </div>
        </footer>
    );
}
