import React from "react";
import "./ModernContainer.css";

const ModernContainer = ({ children }) => (
  <div
    style={{
      minHeight: "100vh",
      width: "100%",
      padding: "20px",
      background: "linear-gradient(135deg, #ff69b4, #00bfff)",
      color: "white",
      animation: "gradientShift 15s ease infinite",
      backgroundSize: "200% 200%",
    }}
  >
    {children}
  </div>
);

const ModernButton = ({ children, ...props }) => (
  <button
    {...props}
    style={{
      padding: "8px 16px",
      backgroundColor: "var(--tv-accent-color)",
      color: "white",
      border: "none",
      borderRadius: "4px",
      cursor: "pointer",
      transition: "all 0.2s ease",
      fontSize: "14px",
      fontWeight: "500",
    }}
    onMouseOver={(e) => {
      e.target.style.backgroundColor = "#1e4dd8";
    }}
    onMouseOut={(e) => {
      e.target.style.backgroundColor = "var(--tv-accent-color)";
    }}
  >
    {children}
  </button>
);
export { ModernButton, ModernContainer };
