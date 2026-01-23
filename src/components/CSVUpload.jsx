import { useState } from "react";
import "./CSVUpload.css";

export default function CSVUpload({ onUploadSuccess }) {
    const [uploading, setUploading] = useState(false);
    const [dragActive, setDragActive] = useState(false);
    const [result, setResult] = useState(null);
    const [error, setError] = useState("");

    const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

    const handleDrag = (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    };

    const handleDrop = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);

        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleFile(e.dataTransfer.files[0]);
        }
    };

    const handleChange = (e) => {
        e.preventDefault();
        if (e.target.files && e.target.files[0]) {
            handleFile(e.target.files[0]);
        }
    };

    const handleFile = async (file) => {
        // Validate file type
        if (!file.name.endsWith('.csv')) {
            setError("Please upload a CSV file");
            return;
        }

        setError("");
        setResult(null);
        setUploading(true);

        const formData = new FormData();
        formData.append('csvFile', file);

        try {
            const token = localStorage.getItem("token");
            const response = await fetch(`${API_URL}/products/upload-csv`, {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
                body: formData,
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "Upload failed");
            }

            setResult(data);

            // Notify parent component to refresh product list
            if (onUploadSuccess && data.summary.successful > 0) {
                onUploadSuccess();
            }

        } catch (err) {
            setError(err.message);
        } finally {
            setUploading(false);
        }
    };

    const downloadTemplate = () => {
        const csvContent = `name,category,subcategory,quantity,weight,price,expiryDate,notifyBeforeDays
Apple,Fruits,Fresh,100,500,50,2026-12-31,7
Milk,Dairy,Beverages,50,1000,60,2026-02-15,3
Rice,Grains,Staples,200,5000,120,2027-01-31,30`;

        const blob = new Blob([csvContent], { type: 'text/csv' });
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'sample-products.csv';
        a.click();
        window.URL.revokeObjectURL(url);
    };

    return (
        <div className="csv-upload-container">
            <div className="csv-upload-header">
                <h3>📊 Bulk Upload Products</h3>
                <button onClick={downloadTemplate} className="btn-download-template">
                    ⬇️ Download Template
                </button>
            </div>

            <div
                className={`csv-dropzone ${dragActive ? "drag-active" : ""}`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <input
                    type="file"
                    id="csv-file-input"
                    accept=".csv"
                    onChange={handleChange}
                    disabled={uploading}
                    style={{ display: "none" }}
                />
                <label htmlFor="csv-file-input" className="csv-dropzone-label">
                    {uploading ? (
                        <>
                            <div className="spinner"></div>
                            <p>Uploading and processing...</p>
                        </>
                    ) : (
                        <>
                            <div className="upload-icon">📁</div>
                            <p className="dropzone-text">
                                <strong>Click to upload</strong> or drag and drop
                            </p>
                            <p className="dropzone-hint">CSV files only (max 5MB)</p>
                        </>
                    )}
                </label>
            </div>

            {error && (
                <div className="csv-error">
                    <strong>❌ Error:</strong> {error}
                </div>
            )}

            {result && (
                <div className="csv-results">
                    <div className="results-summary">
                        <h4>Upload Results</h4>
                        <div className="summary-stats">
                            <div className="stat success">
                                <span className="stat-label">✅ Successful:</span>
                                <span className="stat-value">{result.summary.successful}</span>
                            </div>
                            <div className="stat failed">
                                <span className="stat-label">❌ Failed:</span>
                                <span className="stat-value">{result.summary.failed}</span>
                            </div>
                            <div className="stat skipped">
                                <span className="stat-label">⏭️ Skipped:</span>
                                <span className="stat-value">{result.summary.skipped}</span>
                            </div>
                        </div>
                    </div>

                    {result.errors && result.errors.length > 0 && (
                        <div className="errors-section">
                            <h5>Failed Rows:</h5>
                            <div className="errors-list">
                                {result.errors.map((err, idx) => (
                                    <div key={idx} className="error-item">
                                        <span className="error-line">Line {err.line}:</span>
                                        <span className="error-msg">{err.error}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {result.skipped && result.skipped.length > 0 && (
                        <div className="skipped-section">
                            <h5>Skipped Products (Duplicates):</h5>
                            <div className="skipped-list">
                                {result.skipped.map((item, idx) => (
                                    <div key={idx} className="skipped-item">
                                        <span className="skipped-line">Line {item.line}:</span>
                                        <span className="skipped-name">{item.name}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}
