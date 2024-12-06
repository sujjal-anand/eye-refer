import React from "react";

import { Outlet } from "react-router-dom";
import DashboardLayout from "./Dashboardlayout";

const App: React.FC = () => {
  return (
    <div>
      <DashboardLayout />
      <Outlet />
    </div>
  );
};

export default App;
