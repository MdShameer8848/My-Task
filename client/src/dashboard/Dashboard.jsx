import { useState } from "react";
import "../styles/Dashboard.css";

import { DashboardSidebar } from "./DashboardSidebar";
import { DashboardNavbar } from "./DashboardNavbar";
import { DashboardMain } from "./DashboardMain";

export function Dashboard() {
  const [searchText, setSearchText] = useState("");

  return (
    <div className="dashboard">
      <DashboardSidebar />

      <div className="dashboard-main">
        <DashboardNavbar
          searchText={searchText}
          setSearchText={setSearchText}
        />

        <DashboardMain searchText={searchText} />
      </div>
    </div>
  );
}