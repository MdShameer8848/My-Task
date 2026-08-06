import "../styles/Preview.css";

export function Preview() {
  return (
    <section className="preview-section" id="how-it-works">
      <div className="preview-heading">
        <p>HOW IT WORKS</p>

        <h2>One account, different groups and different roles</h2>

        <span>
          You can manage your own group as an admin and also join another group
          as a member.
        </span>
      </div>

      <div className="dashboard-preview">
        <aside className="preview-sidebar">
          <h3>MyTask</h3>

          <div className="preview-menu active-menu">Dashboard</div>

          <div className="preview-menu">My Groups</div>

          <div className="preview-menu">My Tasks</div>

          <div className="preview-menu">Invitations</div>

          <div className="preview-menu">Announcements</div>
        </aside>

        <div className="preview-main-content">
          <div className="preview-top">
            <div>
              <p>Welcome back</p>
              <h3>Shameer's Dashboard</h3>
            </div>

            <button>Create Group</button>
          </div>

          <div className="preview-summary">
            <div>
              <p>My Groups</p>
              <h3>3</h3>
            </div>

            <div>
              <p>Assigned Tasks</p>
              <h3>8</h3>
            </div>

            <div>
              <p>Completed</p>
              <h3>5</h3>
            </div>

            <div>
              <p>Invitations</p>
              <h3>1</h3>
            </div>
          </div>

          <div className="preview-groups">
            <h4>My Groups</h4>

            <div className="preview-group-card">
              <div>
                <h5>MyTask Development Team</h5>
                <p>6 members · 3 projects</p>
              </div>

              <span className="group-admin-role">Admin</span>
            </div>

            <div className="preview-group-card">
              <div>
                <h5>Sahil University Group</h5>
                <p>5 members · 2 projects</p>
              </div>

              <span className="group-member-role">Member</span>
            </div>
          </div>

          <div className="preview-table">
            <div className="preview-table-heading">
              <h4>My Assigned Tasks</h4>
            </div>

            <div className="preview-table-row">
              <span>Create dashboard page</span>
              <span>High</span>
              <span className="task-progress">In Progress</span>
            </div>

            <div className="preview-table-row">
              <span>Test registration API</span>
              <span>Medium</span>
              <span className="task-done">Completed</span>
            </div>

            <div className="preview-table-row">
              <span>Design projects table</span>
              <span>Low</span>
              <span className="task-pending">To Do</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
