import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaCheck,
  FaEnvelope,
  FaLayerGroup,
  FaListCheck,
  FaXmark,
} from "react-icons/fa6";

import "../styles/DashboardMain.css";

export function DashboardMain({ searchText }) {
  const navigate = useNavigate();

  const storedUser = localStorage.getItem("user");

  const user = storedUser ? JSON.parse(storedUser) : null;

  const [isFormOpen, setIsFormOpen] = useState(false);

  const [groupName, setGroupName] = useState("");

  const [groupDescription, setGroupDescription] = useState("");

  const [groups, setGroups] = useState([]);

  const [invitations, setInvitations] = useState([]);

  const [message, setMessage] = useState("");

  const [myTasks, setMyTasks] = useState([]);
 
 useEffect(() => {
  async function fetchDashboardData() {
    if (!user) {
      return;
    }

    try {
      // Fetch groups
      const groupsResponse = await fetch(
        `http://localhost:5000/api/groups/user/${user.user_id}`
      );

      const groupsData = await groupsResponse.json();

      if (groupsResponse.ok) {
        setGroups(groupsData.groups);
      } else {
        console.log(groupsData.message);
      }

      // Fetch invitations
      const invitationsResponse = await fetch(
        `http://localhost:5000/api/invitations/user/${user.user_id}`
      );

      const invitationsData =
        await invitationsResponse.json();

      if (invitationsResponse.ok) {
        setInvitations(
          invitationsData.invitations
        );
      } else {
        console.log(
          invitationsData.message
        );
      }

      // Fetch tasks assigned to this user
      const tasksResponse = await fetch(
        `http://localhost:5000/api/tasks/user/${user.user_id}`
      );

      const tasksData =
        await tasksResponse.json();

      if (tasksResponse.ok) {
        setMyTasks(tasksData.tasks);
      } else {
        console.log(tasksData.message);
      }
    } catch (error) {
      console.log(
        "Failed to fetch dashboard data:",
        error
      );

      setMessage(
        "Unable to load dashboard data"
      );
    }
  }

  fetchDashboardData();
}, [user]);

  async function handleCreateGroup(event) {
    event.preventDefault();

    if (!user) {
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/api/groups", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          groupName: groupName.trim(),

          groupDescription: groupDescription.trim(),

          createdBy: user.user_id,
        }),
      });

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setGroups((previousGroups) => [data.group, ...previousGroups]);

        setGroupName("");
        setGroupDescription("");
        setIsFormOpen(false);
      }
    } catch (error) {
      console.log("Failed to create group:", error);

      setMessage("Unable to create group");
    }
  }

  async function handleAcceptInvitation(invitationId) {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/invitations/${invitationId}/accept`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: user.user_id,
          }),
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setInvitations((previousInvitations) =>
          previousInvitations.filter(
            (invitation) => invitation.invitationId !== invitationId
          )
        );

        const groupsResponse = await fetch(
          `http://localhost:5000/api/groups/user/${user.user_id}`
        );

        const groupsData = await groupsResponse.json();

        if (groupsResponse.ok) {
          setGroups(groupsData.groups);
        }
      }
    } catch (error) {
      console.log("Failed to accept invitation:", error);

      setMessage("Unable to accept invitation");
    }
  }

  async function handleRejectInvitation(invitationId) {
    if (!user) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/invitations/${invitationId}/reject`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: user.user_id,
          }),
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setInvitations((previousInvitations) =>
          previousInvitations.filter(
            (invitation) => invitation.invitationId !== invitationId
          )
        );
      }
    } catch (error) {
      console.log("Failed to reject invitation:", error);

      setMessage("Unable to reject invitation");
    }
  }

  function closeForm() {
    setGroupName("");
    setGroupDescription("");
    setIsFormOpen(false);
  }

  function openGroup(groupId) {
    navigate(`/groups/${groupId}`);
  }

  const filteredGroups = groups.filter((group) =>
    group.groupName.toLowerCase().includes((searchText || "").toLowerCase())
  );

  return (
    <main className="dashboard-content" id="dashboard-top">
      <section className="welcome-section">
        <div>
          <h2>Welcome back, {user?.name || "User"}</h2>

          <p>Create groups, manage members and assign tasks.</p>
        </div>

        <button
          type="button"
          className="create-group-button"
          onClick={() => setIsFormOpen(true)}
        >
          Create Group
        </button>
      </section>

      {message && <p className="dashboard-message">{message}</p>}

      <section className="statistics-section">
        <article className="statistic-card">
          <div className="statistic-icon purple">
            <FaLayerGroup />
          </div>

          <div>
            <p>Total Groups</p>
            <strong>{groups.length}</strong>
          </div>
        </article>

        <article className="statistic-card">
          <div className="statistic-icon blue">
            <FaListCheck />
          </div>

          <div>
            <p>My Tasks</p>
            <strong>{myTasks.length}</strong>
          </div>
        </article>

        <article className="statistic-card">
          <div className="statistic-icon green">
            <FaCheck />
          </div>

          <div>
            <p>Completed</p>
            <strong>0</strong>
          </div>
        </article>

        <article className="statistic-card">
          <div className="statistic-icon orange">
            <FaEnvelope />
          </div>

          <div>
            <p>Invitations</p>

            <strong>{invitations.length}</strong>
          </div>
        </article>
      </section>

      <section className="groups-section" id="my-groups">
        <h2>My Groups</h2>

        {filteredGroups.length === 0 ? (
          <div className="empty-section">
            <p>
              {searchText
                ? "No matching groups found."
                : "No groups created or joined yet."}
            </p>
          </div>
        ) : (
          <div className="groups-list">
            {filteredGroups.map((group) => (
              <article
                className="group-item"
                key={group.groupId}
                onClick={() => openGroup(group.groupId)}
              >
                <div className="group-item-header">
                  <span className="group-role-badge">
                    {group.role || "Admin"}
                  </span>
                </div>

                <h3>{group.groupName}</h3>

                <p>{group.groupDescription}</p>
              </article>
            ))}
          </div>
        )}
      </section>

      <section
  className="tasks-section"
  id="my-tasks"
>
  <h2>My Tasks</h2>

  {myTasks.length === 0 ? (
    <div className="empty-section">
      <p>No tasks assigned yet.</p>
    </div>
  ) : (
    <div className="dashboard-task-list">

      {myTasks.map((task) => (

        <article
          key={task.taskId}
          className="dashboard-task-card"
        >

          <div>

            <h3>{task.title}</h3>

            <p>{task.groupName}</p>

            <small>
              Due :
              {" "}
              {task.dueDate
                ? task.dueDate
                : "No Due Date"}
            </small>

          </div>

          <span className="dashboard-task-status">
            {task.status}
          </span>

        </article>

      ))}

    </div>
  )}
</section>

      <section className="invitations-section" id="invitations">
        <h2>Invitations</h2>

        {invitations.length === 0 ? (
          <div className="empty-section">
            <p>No invitations available.</p>
          </div>
        ) : (
          <div className="invitations-list">
            {invitations.map((invitation) => (
              <article
                className="invitation-card"
                key={invitation.invitationId}
              >
                <div className="invitation-details">
                  <h3>{invitation.groupName}</h3>

                  <p>{invitation.groupDescription}</p>

                  <small>Invited by {invitation.invitedByName}</small>
                </div>

                <div className="invitation-actions">
                  <button
                    type="button"
                    className="accept-invitation-button"
                    onClick={() =>
                      handleAcceptInvitation(invitation.invitationId)
                    }
                  >
                    <FaCheck />
                    Accept
                  </button>

                  <button
                    type="button"
                    className="reject-invitation-button"
                    onClick={() =>
                      handleRejectInvitation(invitation.invitationId)
                    }
                  >
                    <FaXmark />
                    Reject
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

      {isFormOpen && (
        <div className="form-overlay">
          <section className="group-form-container">
            <h2>Create Group</h2>

            <form onSubmit={handleCreateGroup}>
              <div className="form-field">
                <label htmlFor="groupName">Group Name</label>

                <input
                  id="groupName"
                  type="text"
                  value={groupName}
                  onChange={(event) => setGroupName(event.target.value)}
                  placeholder="Enter group name"
                  required
                />
              </div>

              <div className="form-field">
                <label htmlFor="groupDescription">Description</label>

                <textarea
                  id="groupDescription"
                  value={groupDescription}
                  onChange={(event) => setGroupDescription(event.target.value)}
                  placeholder="Enter description"
                  required
                />
              </div>

              <div className="form-buttons">
                <button
                  type="button"
                  className="cancel-button"
                  onClick={closeForm}
                >
                  Cancel
                </button>

                <button type="submit" className="submit-button">
                  Create Group
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
