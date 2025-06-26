import React, { useEffect, useState } from "react";
import "./ModalUserInfo.css";

export const ModalUserInfo = ({ userInfo, onClose }) => {
  if (!userInfo) return null;
  const [typeName, setTypeName] = useState("");

  useEffect(() => {
    setTypeName(() => {
      if (userInfo.type) {
        return userInfo.type === "client" ? "Cliente" : "Prestador de Serviço";
      }
    });
  }, []);

  return (
    <div className="modal-overlay">
      <dialog open className="modal-user-info">
        <div className="modal-content">
          <h2>Informações do Usuário</h2>

          <div className="info-item">
            <strong>Nome:</strong> <span>{userInfo.name}</span>
          </div>

          <div className="info-item">
            <strong>Email:</strong> <span>{userInfo.email}</span>
          </div>

          <div className="info-item">
            <strong>Tipo:</strong> <span>{typeName}</span>
          </div>

          <button onClick={onClose} className="close-button">
            Fechar
          </button>
        </div>
      </dialog>
    </div>
  );
};
