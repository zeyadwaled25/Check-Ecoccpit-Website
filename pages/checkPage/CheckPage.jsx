import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import Header from "../../components/header/Header";
import Table from "../../components/table/Table";
import "./CheckPage.css";

function CheckPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [userData, setUserData] = useState(null);
  
  useEffect(() => {
    // Check if we have userData in location state
    if (location.state?.userData) {
      setUserData(location.state.userData);
    } else {
      // Check if we have token in localStorage
      const token = localStorage.getItem("access_token");
      if (!token) {
        // Redirect to login page if no token
        navigate("/");
      }
      // You could also fetch user data here if you have an endpoint for that
    }
  }, [location, navigate]);

  if (!userData) {
    return <div className="text-center py-5">Loading...</div>;
  }

  return (
    <div className="check-page">
      <Header 
        coCertificateNo={userData.coCertificateNo} 
        coSerialNo={userData.coSerialNo} 
      />
      <Table userData={userData} />
      <Footer />
    </div>
  );
}

export default CheckPage;