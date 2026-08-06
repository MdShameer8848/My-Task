import { useNavigate } from "react-router-dom";

import {
  FaClipboardList,
  FaLayerGroup,
  FaListCheck,
  FaEnvelope,
  FaBullhorn,
  FaGear,
  FaCircleQuestion,
  FaRightFromBracket,
} from "react-icons/fa6";

import "../styles/DashboardSidebar.css";

export function DashboardSidebar() {
  const navigate = useNavigate();

  function handleLogout() {
    localStorage.removeItem("user");
    navigate("/login");
  }

  return (
    <aside className="dashboard-sidebar">
      <div className="sidebar-logo">
        <div className="sidebar-logo-icon">
          <FaClipboardList />
        </div>

        <h2>MyTask</h2>
      </div>

      <nav className="sidebar-navigation">
        <button
          type="button"
          className="sidebar-link active"
          onClick={() => navigate("/dashboard")}
        >
          <FaLayerGroup />
          <span>Dashboard</span>
        </button>

        <a className="sidebar-link" href="#my-groups">
          <FaLayerGroup />
          <span>My Groups</span>
        </a>

        <a className="sidebar-link" href="#my-tasks">
          <FaListCheck />
          <span>My Tasks</span>
        </a>

        <a className="sidebar-link" href="#invitations">
          <FaEnvelope />
          <span>Invitations</span>
        </a>

        <a className="sidebar-link" href="#announcements">
          <FaBullhorn />
          <span>Announcements</span>
        </a>
      </nav>

      <div className="sidebar-secondary">
        <button type="button" className="sidebar-link">
          <FaGear />
          <span>Settings</span>
        </button>

        <button type="button" className="sidebar-link">
          <FaCircleQuestion />
          <span>Help</span>
        </button>
      </div>

      <div className="sidebar-footer">
        <p>
          <span className="system-status-dot"></span>
          All systems operational
        </p>

        <button
          type="button"
          className="logout-button"
          onClick={handleLogout}
        >
          <FaRightFromBracket />
          <span>Logout</span>
        </button>
      </div>
    </aside>
  );
}