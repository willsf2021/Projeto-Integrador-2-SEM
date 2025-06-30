import React, { useState } from "react";
import { ModalUserInfo } from "./ModalUserInfo";

export const DashboardHeader = ({ userType, userName }) => {
  const [modalOpen, setModalOpen] = useState(false);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("type");
    localStorage.removeItem("userName");
    window.location.href = "/";
  };

  const userInfo = {
    name: localStorage.getItem("userName") || "Usuário",
    email: localStorage.getItem("email") || "",
    type: localStorage.getItem("type") || "",
  };

  return (
    <header className="dashboard-header">
      <div className="header-container">
        <div className="brand-section">
          <img
            src="/easy-wood-system.png"
            alt="Easy Wood System"
            className="brand-logo"
          />
          <h1 className="brand-title">Olá, {userName || "cliente"}</h1>
        </div>

        <div className="user-section">
          <div className="user-info" onClick={() => setModalOpen(true)}>
            <div className="user-avatar">{userName?.charAt(0) || "U"}</div>
            <span className="user-type">
              {userType === "client" ? "Cliente" : "Prestador"}
            </span>
          </div>

          <button className="btn btn-icon logout-button" onClick={handleLogout}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
              <polyline points="16 17 21 12 16 7"></polyline>
              <line x1="21" y1="12" x2="9" y2="12"></line>
            </svg>
          </button>
        </div>

        {modalOpen && (
          <ModalUserInfo
            userInfo={userInfo}
            onClose={() => setModalOpen(false)}
          />
        )}
      </div>
    </header>
  );
};
