import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import Dashboard from "../components/Dashboard";
import ProductForm from "../components/ProductForm";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import CSVUpload from "../components/CSVUpload";
import "./AdminPanel.css";

export default function AdminPanel() {
    const { logout } = useAuth();
    const navigate = useNavigate();
    const [editProduct, setEditProduct] = useState(null);
    const [refreshKey, setRefreshKey] = useState(0);
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    const handleProductSuccess = () => {
        setEditProduct(null);
        setRefreshKey((prev) => prev + 1);
    };

    const handleEdit = (product) => {
        setEditProduct(product);
        window.scrollTo({ top: 0, behavior: "smooth" });
    };

    const handleLogout = () => {
        logout();
        navigate("/login");
    };

    return (
        <div className="admin-page">
            <Navbar />

            <div className="container">
                <Dashboard onFilter={setFilterStatus} refresh={refreshKey} />

                <div className="admin-main-layout">
                    <div className="form-column">
                        <CSVUpload onUploadSuccess={handleProductSuccess} />
                        <ProductForm
                            editProduct={editProduct}
                            onSuccess={handleProductSuccess}
                        />
                    </div>

                    <div className="list-column">
                        <SearchBar onSearch={setSearchQuery} />
                        <ProductList
                            refresh={refreshKey}
                            onEdit={handleEdit}
                            filterStatus={filterStatus}
                            onClearFilter={() => setFilterStatus("all")}
                            searchQuery={searchQuery}
                        />
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginTop: '4rem', padding: '2rem' }}>
                    <button onClick={handleLogout} className="btn-secondary">
                        🚪 Logout from Session
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
