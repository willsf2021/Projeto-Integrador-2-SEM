import React from "react";
import { Outlet } from "react-router-dom";
import { DashboardHeader } from "./DashboardHeader";
import { DashboardSidebar } from "./DashboardSidebar";

export const DashboardLayout = ({ userType, sidebarLinks }) => {
  const userName = localStorage.getItem("userName") || "Usuário";
  
  return (
    <div className={`dashboard-layout ${userType}-dashboard`}>
      <DashboardHeader userType={userType} userName={userName} />
      
      <main className="dashboard-main">
        <div className="dashboard-grid">
          <DashboardSidebar links={sidebarLinks} userType={userType} />
          
          <section className="content-area">
            <Outlet />
          </section>
        </div>
      </main>
    </div>
  );
};