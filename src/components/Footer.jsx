export default function Footer() {
    return (
        <footer className="mt-auto bg-white border-t-2 border-gray-100 shadow-lg">
            <div className="max-w-7xl mx-auto px-6 py-12">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <h3 className="text-2xl font-black bg-gradient-to-r from-primary-600 to-secondary-600 bg-clip-text text-transparent mb-4">
                            SK Grocery App
                        </h3>
                        <p className="text-gray-600 font-medium">
                            Modern inventory management for your grocery store
                        </p>
                    </div>

                    {/* Quick Links */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">
                            Quick Links
                        </h4>
                        <div className="space-y-2">
                            <a
                                href="/"
                                className="block text-gray-600 hover:text-secondary-600 font-medium transition-colors"
                            >
                                Dashboard
                            </a>
                            <a
                                href="/admin"
                                className="block text-gray-600 hover:text-secondary-600 font-medium transition-colors"
                            >
                                Products
                            </a>
                            <a
                                href="/admin"
                                className="block text-gray-600 hover:text-secondary-600 font-medium transition-colors"
                            >
                                Reports
                            </a>
                        </div>
                    </div>

                    {/* Contact */}
                    <div>
                        <h4 className="font-bold text-gray-900 mb-4 uppercase tracking-wide text-sm">
                            Contact
                        </h4>
                        <p className="text-gray-600 font-medium">
                            Made with <span className="text-red-500 text-lg">❤️</span> by SK Grocery App
                        </p>
                    </div>
                </div>

                {/* Copyright */}
                <div className="pt-8 border-t border-gray-200 text-center text-gray-500 font-medium">
                    © {new Date().getFullYear()} Mahajan Grocery Store. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
