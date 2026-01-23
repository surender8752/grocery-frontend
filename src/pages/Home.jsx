import { useState } from "react";
import Dashboard from "../components/Dashboard";
import ProductList from "../components/ProductList";
import SearchBar from "../components/SearchBar";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function Home({ notificationEnabled, requestPermission }) {
    const [filterStatus, setFilterStatus] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");

    return (
        <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50 to-purple-50">
            <Navbar />

            <div className="max-w-7xl mx-auto px-6 py-8">
                {/* Notification Card */}
                {!notificationEnabled && (
                    <div className="relative overflow-hidden bg-gradient-to-r from-secondary-500/10 to-blue-500/10 backdrop-blur-md border-2 border-white/50 rounded-2xl p-6 shadow-glass mb-8 animate-slide-down">
                        {/* Animated background */}
                        <div className="absolute inset-0 bg-gradient-to-r from-secondary-500/5 to-blue-500/5 animate-pulse-slow"></div>

                        <div className="relative flex flex-col md:flex-row  items-center gap-6">
                            {/* Icon */}
                            <div className="w-16 h-16 bg-white rounded-2xl shadow-lg flex items-center justify-center text-3xl shrink-0 animate-float">
                                🔔
                            </div>

                            {/* Content */}
                            <div className="flex-1 text-center md:text-left">
                                <h4 className="text-xl font-black text-gray-900 mb-1">
                                    Stay Updated!
                                </h4>
                                <p className="text-gray-700 font-medium">
                                    Enable notifications to receive timely expiry alerts on your mobile device.
                                </p>
                            </div>

                            {/* CTA Button */}
                            <button
                                onClick={requestPermission}
                                className="bg-gradient-to-r from-secondary-500 to-secondary-600 text-white font-bold px-8 py-3 rounded-xl shadow-colored-secondary hover:shadow-xl transform hover:-translate-y-1 transition-all whitespace-nowrap"
                            >
                                Enable Now
                            </button>
                        </div>
                    </div>
                )}

                {/* Dashboard Stats */}
                <Dashboard onFilter={setFilterStatus} />

                {/* Search & Product List */}
                <div className="mt-8">
                    <SearchBar onSearch={setSearchQuery} />
                    <ProductList
                        onEdit={() => { }}
                        readOnly={true}
                        filterStatus={filterStatus}
                        onClearFilter={() => setFilterStatus("all")}
                        searchQuery={searchQuery}
                    />
                </div>
            </div>

            <Footer />
        </div>
    );
}
