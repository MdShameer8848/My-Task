import { FaBell, FaMagnifyingGlass } from "react-icons/fa6";
import "../styles/DashboardNavbar.css";

export function DashboardNavbar({
  searchText,
  setSearchText,
}) {
  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  return (
    <header className="dashboard-navbar">
      <div className="navbar-welcome">
        <h1>
          Welcome back,{" "}
          <span>{user?.name || "User"}</span>
        </h1>

        <p>
          Manage your groups, tasks and
          collaborations.
        </p>
      </div>

      <div className="navbar-actions">
        <div className="navbar-search">
          <FaMagnifyingGlass />

          <input
            type="text"
            placeholder="Search groups..."
            value={searchText}
            onChange={(event) =>
              setSearchText(
                event.target.value
              )
            }
          />
        </div>

        <button
          type="button"
          className="notification-button"
        >
          <FaBell />
        </button>

        <div className="navbar-avatar">
          {user?.name
            ? user.name
                .charAt(0)
                .toUpperCase()
            : "U"}
        </div>
      </div>
    </header>
  );
}