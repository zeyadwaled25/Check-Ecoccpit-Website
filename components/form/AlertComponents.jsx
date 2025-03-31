import React from 'react';

// Error Alert Component
export const ErrorAlert = ({ onClose }) => {
  return (
    <div 
      className="error-alert"
      style={{
        backgroundColor: "#fef0f0",
        border: "1px solid #fde2e2",
        color: "#f56c6c",
        borderRadius: "4px",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
        width: "fit-content",
        margin: "0 auto",
        position: "fixed",
        top: "115px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 18 18" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: "10px" }}
        >
          <circle cx="9" cy="9" r="8" fill="#FCA5A5" stroke="#DC2626" strokeWidth="1" />
          <path d="M11.5 6.5L6.5 11.5M6.5 6.5L11.5 11.5" stroke="#DC2626" strokeWidth="1.5" strokeLinecap="round" />
        </svg>
        <span style={{ color: "#B91C1C", fontWeight: "500" }}>原产地证书查验失败! 验证码校验失败!</span>
      </div>
      <button 
      className='ms-3'
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          color: "#6B7280"
        }}
      >
        <svg className='text-secondary' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};

// Success Alert Component
export const SuccessAlert = ({ onClose }) => {
  return (
    <div 
      className="success-alert"
      style={{
        backgroundColor: "#F1F9EC",
        border: "1px solid #F1F9EC",
        color: "A2DA86",
        borderRadius: "4px",
        padding: "10px 16px",
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
        marginBottom: "20px",
        width: "fit-content",
        margin: "0 auto",
        position: "fixed",
        top: "115px",
        left: "50%",
        transform: "translateX(-50%)",
      }}
    >
      <div style={{ display: "flex", alignItems: "center" }}>
        <svg 
          width="18" 
          height="18" 
          viewBox="0 0 18 18" 
          fill="none" 
          xmlns="http://www.w3.org/2000/svg"
          style={{ marginRight: "10px" }}
        >
          <circle cx="9" cy="9" r="8" fill="#A7F3D0" stroke="#059669" strokeWidth="1" />
          <path d="M6 9L8 11L12 7" stroke="#059669" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
        <span style={{ color: "#065F46", fontWeight: "500" }}>查询原产地证成功!</span>
      </div>
      <button 
        className='ms-3'
        onClick={onClose}
        style={{
          background: "none",
          border: "none",
          cursor: "pointer",
          padding: "0",
          color: "#6B7280"
        }}
      >
        <svg className='text-secondary' width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10.5 3.5L3.5 10.5M3.5 3.5L10.5 10.5" stroke="#6B7280" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  );
};