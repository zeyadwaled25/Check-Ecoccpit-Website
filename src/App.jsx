import { useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import CheckPage from "../pages/checkPage/CheckPage";
import DashboardPage from "../pages/dashboardPage/DashboardPage";
import ProtectedRoute from "../components/ProtectedRoute";
import LoadingScreen from "../pages/loadingPage/LoadingScreen"; // Import the LoadingScreen component
import "./App.css";
import LoginPage from "../pages/loginPage/LoginPage";

function App() {
  const [isLoading, setIsLoading] = useState(true);

  const handleLoadComplete = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading && <LoadingScreen onLoadComplete={handleLoadComplete} />}
      <Router>
        <div className={`App ${isLoading ? "hidden-content" : ""}`}>
          <Routes>
            <Route path="/" element={<LoginPage />} />
            <Route path="/check" element={<CheckPage />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              } 
            />
          </Routes>
        </div>
      </Router>
    </>
  );
}

export default App;