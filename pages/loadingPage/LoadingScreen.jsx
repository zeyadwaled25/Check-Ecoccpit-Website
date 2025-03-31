import { useState, useEffect } from "react";
import "./LoadingScreen.css";
import loadingImage from "../../public/images/in-dot.png";

function LoadingScreen({ onLoadComplete }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
      if (onLoadComplete) onLoadComplete();
    }, 3000);

    window.addEventListener("load", () => {
      clearTimeout(timer);
      setLoading(false);
      if (onLoadComplete) onLoadComplete();
    });

    return () => {
      clearTimeout(timer);
      window.removeEventListener("load", () => {});
    };
  }, [onLoadComplete]);

  if (!loading) return null;

  return (
    <div className="loading-screen">
      <div className="loading-container">
        <img src={loadingImage} alt="Loading" className="loading-circle" />
        <div className="loading-text">Loading</div>
      </div>
      <div className="loading-title">
        中国贸促会原产地网上签证系统企业申报端
      </div>
    </div>
  );
}

export default LoadingScreen;