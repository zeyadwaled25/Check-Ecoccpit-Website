import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./Form.css";

function Form() {
  const [certificate, setCertificate] = useState("");
  const [serial, setSerial] = useState("");
  const [securityCode, setSecurityCode] = useState("");
  const [captchaText, setCaptchaText] = useState("");
  const [isValid, setIsValid] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const [validCertificate, setValidCertificate] = useState(null);
  const [validSerial, setValidSerial] = useState(null);
  const [validSecurityCode, setValidSecurityCode] = useState(null);

  const canvasRef = useRef(null);
  const navigate = useNavigate();

  // Generate random captcha text
  const generateCaptchaText = () => {
    const characters = 'ABCDEFGHJKLMNPQRSTUVWXYZabcdefghjkmnpqrstuvwxyz23456789';
    let result = '';
    const length = 4;
    for (let i = 0; i < length; i++) {
      result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
  };

  // Draw captcha on canvas
  const drawCaptcha = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    const text = generateCaptchaText();
    
    setCaptchaText(text);
    
    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Fill background with transparent color
    ctx.fillStyle = 'rgba(255, 255, 255, 0)';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    
    // Setup colorful captcha text
    const colors = ['#4285F4', '#EA4335', '#FBBC05', '#34A853', '#800080', '#FF6347'];
    
    // Draw each character with different color, rotation and position
    for (let i = 0; i < text.length; i++) {
      ctx.save();
      
      // Position each character
      const x = 10 + i * 20;
      const y = 25 + Math.random() * 10 - 5;
      
      // Random rotation
      ctx.translate(x, y);
      ctx.rotate((Math.random() * 0.5 - 0.25));
      
      // Random color
      ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
      
      // Random font size and style
      const fontSize = 20 + Math.random() * 8;
      const fontStyles = ['normal', 'italic', 'bold'];
      const fontStyle = fontStyles[Math.floor(Math.random() * fontStyles.length)];
      ctx.font = `${fontStyle} ${fontSize}px Arial, sans-serif`;
      
      // Draw the character
      ctx.fillText(text[i], 0, 0);
      
      ctx.restore();
    }
    
    // Add some curved lines for noise
    for (let i = 0; i < 2; i++) {
      ctx.beginPath();
      ctx.moveTo(Math.random() * 20, Math.random() * canvas.height);
      
      // Create a curved line
      const cp1x = 30 + Math.random() * 30;
      const cp1y = Math.random() * canvas.height;
      const cp2x = 60 + Math.random() * 30;
      const cp2y = Math.random() * canvas.height;
      const endX = canvas.width - Math.random() * 20;
      const endY = Math.random() * canvas.height;
      
      ctx.bezierCurveTo(cp1x, cp1y, cp2x, cp2y, endX, endY);
      
      // Random color for the line
      ctx.strokeStyle = colors[Math.floor(Math.random() * colors.length)];
      ctx.lineWidth = 1 + Math.random() * 1;
      ctx.stroke();
    }
  };

  // Initialize captcha on component mount
  useEffect(() => {
    drawCaptcha();
  }, []);

  // Check form validity
  useEffect(() => {
    setIsValid(validCertificate && validSerial && validSecurityCode);
  }, [validCertificate, validSerial, validSecurityCode]);

  // Check if user is already logged in with admin role
  useEffect(() => {
    const token = localStorage.getItem("access_token");
    const userRole = localStorage.getItem("user_role");
    
    if (token && userRole === "admin") {
      navigate("/dashboard");
    }
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate all fields
    if (certificate === "") {
      setValidCertificate(false);
      return;
    }
    
    if (serial === "") {
      setValidSerial(false);
      return;
    }
    
    if (securityCode === "") {
      setValidSecurityCode(false);
      return;
    }
    
    // Validate captcha
    if (securityCode.toLowerCase() !== captchaText.toLowerCase()) {
      setValidSecurityCode(false);
      drawCaptcha();
      setSecurityCode("");
      return;
    }
    
    if (!isValid) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await axios.post(
        "https://auth-app-project-production.up.railway.app/auth/login",
        {
          coCertificateNo: certificate,
          coSerialNo: serial
        }
      );
      
      // Handle successful response
      if (response.status === 201 || response.status === 200) {
        // Store the token in localStorage
        localStorage.setItem("access_token", response.data.access_token);
        
        // Store user role for easy access
        localStorage.setItem("user_role", response.data.user.role);
        
        // Check user role and redirect accordingly
        if (response.data.user.role === "admin") {
          navigate("/dashboard");
        } else {
          // Navigate to CheckPage with user data
          navigate("/check", { state: { userData: response.data.user } });
        }
      }
    } catch (err) {
      console.error("Login failed:", err);
      setError(
        err.response?.data?.message || 
        "Authentication failed. Please check your credentials."
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="form">
      <form onSubmit={handleSubmit}>
        <div className="container">
          <h3 className="text-center">原产地证书查验</h3>
          <div className="form-content">
            <div className="row">
              <div className="col-12 mb-4">
                <div className="col-12 col-lg-8 mx-auto d-flex justify-content-between align-items-center position-relative certificate">
                  <label htmlFor="certificate" className="col-3 text-end">
                    CO Certificate No (申请号):{" "}
                  </label>
                  <div className="ms-3 position-relative w-100">
                    <input
                      className="flex-grow-1 w-100"
                      type="text"
                      id="certificate"
                      placeholder="请输入CO Certificate No (申请号)"
                      value={certificate}
                      onChange={(e) => setCertificate(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          e.target.style.borderColor = "red";
                          setValidCertificate(false);
                        } else {
                          e.target.style.borderColor = "#eee";
                          setValidCertificate(true);
                        }
                      }}
                    />
                    {validCertificate === false && <div className="cerror-message">请输入 CO Certificate No (申请号)</div>}
                    <img src="./images/certificate.png" alt="certificate" />
                  </div>
                </div>
              </div>
              <div className="col-12 mb-4">
                <div className="col-12 col-lg-8 mx-auto d-flex justify-content-between align-items-center position-relative serial">
                  <label htmlFor="serial" className="col-3 text-end">
                    CO Serial No (印刷号):{" "}
                  </label>
                  <div className="ms-3 position-relative w-100">
                    <input
                      className="flex-grow-1 w-100"
                      type="text"
                      id="serial"
                      placeholder="请输入CO Serial No (印刷号)"
                      value={serial}
                      onChange={(e) => setSerial(e.target.value)}
                      onBlur={(e) => {
                        if (e.target.value === "") {
                          e.target.style.borderColor = "red";
                          setValidSerial(false);
                        } else {
                          e.target.style.borderColor = "#eee";
                          setValidSerial(true);
                        }
                      }}
                    />
                    {validSerial === false && <div className="serror-message">请输入 CO Serial No (印刷号)</div>}
                    <img src="./images/serial.png" alt="serial" />
                  </div>
                </div>
              </div>
              <div className="col-12 mb-4">
                <div className="col-12 col-lg-8 mx-auto d-flex justify-content-between align-items-center position-relative">
                  <label
                    htmlFor="security-code"
                    className="col-3 text-end"
                  >
                    Security Code (验证码):{" "}
                  </label>
                  <div className="ms-3 position-relative w-100">
                    <div className="input-with-captcha d-flex align-items-center">
                      <input
                        className="flex-grow-1"
                        type="text"
                        id="security-code"
                        placeholder="请输入Security Code (验证码)"
                        value={securityCode}
                        onChange={(e) => setSecurityCode(e.target.value)}
                        onBlur={(e) => {
                          if (e.target.value === "") {
                            e.target.style.borderColor = "red";
                            setValidSecurityCode(false);
                          } else {
                            e.target.style.borderColor = "#eee";
                            setValidSecurityCode(true);
                          }
                        }}
                      />
                      <div className="captcha-container d-flex align-items-center ms-2">
                        <canvas
                          ref={canvasRef}
                          width={100}
                          height={40}
                          style={{ 
                            border: "1px solid #ddd", 
                            borderRadius: "4px",
                            backgroundColor: "transparent", 
                          }}
                        ></canvas>
                        <button
                          type="button"
                          className="btn ms-2"
                          onClick={() => {
                            drawCaptcha();
                            setSecurityCode("");
                          }}
                          style={{ 
                            background: "none", 
                            border: "none", 
                            color: "#007bff",
                            padding: "0",
                            cursor: "pointer"
                          }}
                        >
                          Refresh
                        </button>
                      </div>
                    </div>
                    {validSecurityCode === false && <div className="scerror-message">请输入正确的验证码</div>}
                  </div>
                </div>
              </div>
            </div>
            
            {error && (
              <div className="alert alert-danger text-center my-3">{error}</div>
            )}
            
            <div className="buttons mt-3 text-center d-flex justify-content-center align-items-center gap-3">
              <button 
                type="submit" 
                className="btn btn-primary" 
                id="submit"
                disabled={loading}
              >
                {loading ? "Loading..." : "Search"}
              </button>
              <div 
                className="btn btn-light" 
                id="reset"
                onClick={() => {
                  setCertificate("");
                  setSerial("");
                  setSecurityCode("");
                  setValidCertificate(null);
                  setValidSerial(null);
                  setValidSecurityCode(null);
                  setError(null);
                  drawCaptcha();
                }}
              >
                Reset
              </div>
            </div>
          </div>
        </div>
      </form>

      {/* Add some CSS for the new captcha layout */}
      <style jsx>{`
        .input-with-captcha {
          display: flex;
          border: 1px solid #ddd;
          border-radius: 4px;
          overflow: hidden;
        }
        
        .input-with-captcha input {
          border: none !important;
          outline: none;
          padding: 8px 12px;
          flex: 1;
        }
        
        .input-with-captcha .captcha-container {
          display: flex;
          align-items: center;
          background: #f9f9f9;
          padding-right: 8px;
        }
        
        .input-with-captcha button:hover {
          text-decoration: underline;
        }
      `}</style>
    </section>
  );
}

export default Form;