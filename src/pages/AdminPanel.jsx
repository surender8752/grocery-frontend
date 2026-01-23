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
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                <Dashboard onFilter={setFilterStatus} refresh={refreshKey} />

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mt-8">
                    {/* Form Column */}
                    <div className="lg:col-span-1 space-y-6">
                        <CSVUpload onUploadSuccess={handleProductSuccess} />
                        <ProductForm
                            editProduct={editProduct}
                            onSuccess={handleProductSuccess}
                        />
                    </div>

                    {/* List Column */}
                    <div className="lg:col-span-2">
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

                {/* Logout Button */}
                <div className="flex justify-center mt-16 mb-8">
                    <button
                        onClick={handleLogout}
                        className="bg-gradient-to-r from-red-500 to-red-600 text-white font-bold px-8 py-3 rounded-xl shadow-lg hover:shadow-xl transform hover:-translate-y-1 transition-all duration-300"
                    >
                        🚪 Logout from Session
                    </button>
                </div>
            </div>

            <Footer />
        </div>
    );
}
