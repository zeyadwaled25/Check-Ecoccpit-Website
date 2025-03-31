// LoadingScreen.js - A React component for the loading screen
import { useState, useEffect } from "react";
import "./LoadingScreen.css";

function LoadingScreen({ onLoadComplete }) {
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    // Simulate checking if all resources are loaded
    const timer = setTimeout(() => {
      setLoading(false);
      if (onLoadComplete) onLoadComplete();
    }, 3000); // Show loading screen for at least 3 seconds
    
    // Listen for when the page is fully loaded
    window.addEventListener('load', () => {
      clearTimeout(timer);
      setLoading(false);
      if (onLoadComplete) onLoadComplete();
    });
    
    return () => {
      clearTimeout(timer);
      window.removeEventListener('load', () => {});
    };
  }, [onLoadComplete]);
  
  if (!loading) return null;
  
  return (
    <div className="loading-screen">
      <div className="loading-container">
        <div className="loading-circle"></div>
        <div className="loading-text">Loading</div>
      </div>
      <div className="loading-title">
        中国贸促会原产地网上签证系统企业申报端
      </div>
    </div>
  );
}

export default LoadingScreen;