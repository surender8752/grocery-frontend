import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import { messaging } from "./firebase";
import { getToken, onMessage } from "firebase/messaging";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import Login from "./pages/Login";
import AdminPanel from "./pages/AdminPanel";
import Home from "./pages/Home";
import "./App.css";

function App() {
  const [notificationEnabled, setNotificationEnabled] = useState(false);

  useEffect(() => {
    // Listen for foreground notifications
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("Notification received:", payload);
      alert(`🔔 ${payload.notification.title}\n${payload.notification.body}`);
    });

    return () => unsubscribe();
  }, []);

  const requestPermission = async () => {
    try {
      const permission = await Notification.requestPermission();

      if (permission === "granted") {
        const token = await getToken(messaging, {
          vapidKey: "YOUR_VAPID_KEY", // Replace with your VAPID key
        });

        await axios.post("http://localhost:5000/token", { token });
        setNotificationEnabled(true);
        alert("✅ Notifications Enabled!");
      } else {
        alert("❌ Notification permission denied");
      }
    } catch (error) {
      console.error("Error enabling notifications:", error);
      alert("❌ Error enabling notifications");
    }
  };

  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Home Page */}
          <Route
            path="/"
            element={
              <Home
                notificationEnabled={notificationEnabled}
                requestPermission={requestPermission}
              />
            }
          />

          {/* Login Page */}
          <Route path="/login" element={<Login />} />

          {/* Protected Admin Panel */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute>
                <AdminPanel />
              </ProtectedRoute>
            }
          />

          {/* Redirect any unknown routes to home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;


