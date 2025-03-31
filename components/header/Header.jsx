import { Link, useNavigate } from "react-router-dom";
import "./Header.css";

function Header({ coCertificateNo, coSerialNo }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("access_token");
    navigate("/");
  };

  return (
    <header>
      <h3 className="mb-0 text-center">原产地证书查验结果</h3>
      <div className="log-out text-end">
        <button onClick={handleLogout} className="logout-button">返回</button>
      </div>
      <div className="row">
        <div className="col-12 certificate">
          <p><span>CO Certificate No (申请号) : </span>{coCertificateNo}</p>
        </div>
        <div className="col-12 serial">
          <p><span>CO Serial No (印刷号) : </span>{coSerialNo}</p>
        </div>
      </div>
    </header>
  );
}

export default Header;