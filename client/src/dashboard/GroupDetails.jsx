import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  FaArrowLeft,
  FaPlus,
  FaPen,
  FaTrash,
  FaUserPlus,
  FaUsers,
  FaListCheck,
  FaCircleCheck,
  FaXmark,
} from "react-icons/fa6";

import "../styles/GroupDetails.css";

export function GroupDetails() {
  const { groupId } = useParams();
  const navigate = useNavigate();

  const [group, setGroup] = useState(null);
  const [message, setMessage] = useState("");

  const [isInviteOpen, setIsInviteOpen] = useState(false);
  const [inviteEmail, setInviteEmail] = useState("");
  const [inviteMessage, setInviteMessage] = useState("");

  const [isEditOpen, setIsEditOpen] = useState(false);

  const [editName, setEditName] = useState("");

  const [editDescription, setEditDescription] = useState("");

  const [members, setMembers] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [isTaskOpen, setIsTaskOpen] = useState(false);

  const [taskTitle, setTaskTitle] = useState("");

  const [taskDescription, setTaskDescription] = useState("");

  const [assignedTo, setAssignedTo] = useState("");

  const [dueDate, setDueDate] = useState("");

 useEffect(() => {
  async function fetchGroup() {
    const storedUser = localStorage.getItem("user");

    const user = storedUser
      ? JSON.parse(storedUser)
      : null;

    if (!user) {
      navigate("/login");
      return;
    }

    try {
      // Fetch Group Details
      const groupResponse = await fetch(
        `http://localhost:5000/api/groups/${groupId}?userId=${user.user_id}`
      );

      const groupData = await groupResponse.json();

      if (groupResponse.ok) {
        setGroup(groupData.group);
      } else {
        setMessage(groupData.message);
        return;
      }

      // Fetch Members
      const membersResponse = await fetch(
        `http://localhost:5000/api/groups/${groupId}/members?userId=${user.user_id}`
      );

      const membersData = await membersResponse.json();

      if (membersResponse.ok) {
        setMembers(membersData.members);
      } else {
        console.log(membersData.message);
      }

      // Fetch Tasks
      const tasksResponse = await fetch(
        `http://localhost:5000/api/groups/${groupId}/tasks?userId=${user.user_id}`
      );

      const tasksData = await tasksResponse.json();

      if (tasksResponse.ok) {
        setTasks(tasksData.tasks);
      } else {
        console.log(tasksData.message);
      }

    } catch (error) {
      console.log(error);

      setMessage("Unable to connect to the server.");
    }
  }

  fetchGroup();
}, [groupId, navigate]);

  function openEditForm() {
    setEditName(group.groupName);

    setEditDescription(group.groupDescription);

    setIsEditOpen(true);
  }

  function closeEditForm() {
    setIsEditOpen(false);
    setEditName("");
    setEditDescription("");
  }

  async function handleUpdateGroup(event) {
    event.preventDefault();

    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setMessage("Logged-in user not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          method: "PUT",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            groupName: editName.trim(),

            groupDescription: editDescription.trim(),

            userId: user.user_id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        setGroup(data.group);
        closeEditForm();
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log("Failed to update group:", error);

      setMessage("Unable to update the group.");
    }
  }

  async function handleDeleteGroup() {
    const shouldDelete = window.confirm(
      "Are you sure you want to delete this group?"
    );

    if (!shouldDelete) {
      return;
    }

    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setMessage("Logged-in user not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            userId: user.user_id,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        navigate("/dashboard");
      } else {
        setMessage(data.message);
      }
    } catch (error) {
      console.log("Failed to delete group:", error);

      setMessage("Unable to delete the group");
    }
  }

  async function handleSendInvitation(event) {
    event.preventDefault();

    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

    if (!user) {
      setInviteMessage("Logged-in user not found");
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/invitations`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email: inviteEmail.trim(),
            invitedBy: user.user_id,
          }),
        }
      );

      const data = await response.json();

      setInviteMessage(data.message);

      if (response.ok) {
        setInviteEmail("");
      }
    } catch (error) {
      console.log("Invitation error:", error);

      setInviteMessage("Unable to send the invitation");
    }
  }

  async function handleRemoveMember(memberUserId) {
    const shouldRemove = window.confirm("Remove this member from the group?");

    if (!shouldRemove) {
      return;
    }

    const storedUser = localStorage.getItem("user");

    const user = storedUser ? JSON.parse(storedUser) : null;

    try {
      const response = await fetch(
        `http://localhost:5000/api/groups/${groupId}/members/${memberUserId}`,
        {
          method: "DELETE",

          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            adminUserId: user.user_id,
          }),
        }
      );

      const data = await response.json();

      setMessage(data.message);

      if (response.ok) {
        setMembers((previousMembers) =>
          previousMembers.filter((member) => member.userId !== memberUserId)
        );
      }
    } catch (error) {
      console.log(error);

      setMessage("Unable to remove member.");
    }
  }

 async function handleCreateTask(event) {
  event.preventDefault();

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  if (!user) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/groups/${groupId}/tasks`,
      {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: taskTitle.trim(),

          description:
            taskDescription.trim(),

          assignedTo: Number(assignedTo),

          createdBy: user.user_id,

          dueDate: dueDate || null,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTasks((previousTasks) => [
        data.task,
        ...previousTasks,
      ]);

      setTaskTitle("");
      setTaskDescription("");
      setAssignedTo("");
      setDueDate("");

      setIsTaskOpen(false);
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log(error);

    alert("Unable to create task");
  }
}

async function handleDeleteTask(taskId) {
  const shouldDelete = window.confirm(
    "Are you sure you want to delete this task?"
  );

  if (!shouldDelete) {
    return;
  }

  const storedUser = localStorage.getItem("user");

  const user = storedUser
    ? JSON.parse(storedUser)
    : null;

  if (!user) {
    return;
  }

  try {
    const response = await fetch(
      `http://localhost:5000/api/tasks/${taskId}`,
      {
        method: "DELETE",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          userId: user.user_id,
        }),
      }
    );

    const data = await response.json();

    if (response.ok) {
      setTasks((previousTasks) =>
        previousTasks.filter(
          (task) => task.taskId !== taskId
        )
      );
    } else {
      alert(data.message);
    }
  } catch (error) {
    console.log("Delete task error:", error);

    alert("Unable to delete task");
  }
}

  if (message) {
    return (
      <main className="group-details-page">
        <div className="group-message-card">
          <p>{message}</p>

          <button
            type="button"
            className="group-back-button"
            onClick={() => navigate("/dashboard")}
          >
            <FaArrowLeft />
            Back to Dashboard
          </button>
        </div>
      </main>
    );
  }

  if (!group) {
    return (
      <main className="group-details-page">
        <div className="group-loading-card">
          <p>Loading group...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="group-details-page">
      <header className="group-details-topbar">
        <button
          type="button"
          className="group-back-button"
          onClick={() => navigate("/dashboard")}
        >
          <FaArrowLeft />
          Back to Dashboard
        </button>

        <div className="group-top-actions">
          <button
            type="button"
            className="group-edit-button"
            onClick={openEditForm}
          >
            <FaPen />
            Edit Group
          </button>

          <button
            type="button"
            className="group-delete-button"
            onClick={handleDeleteGroup}
          >
            <FaTrash />
            Delete Group
          </button>
        </div>
      </header>

      <section className="group-hero">
        <div className="group-hero-content">
          <span className="group-label">Group Workspace</span>

          <h1>{group.groupName}</h1>

          <p>{group.groupDescription}</p>
        </div>

        <div className="group-owner-badge">{group.role}</div>
      </section>

      <section className="group-statistics">
        <article className="group-stat-card">
          <div className="group-stat-icon purple">
            <FaUsers />
          </div>

          <div>
            <p>Members</p>
            <strong>{members.length}</strong>
          </div>
        </article>

        <article className="group-stat-card">
          <div className="group-stat-icon blue">
            <FaListCheck />
          </div>

          <div>
            <p>Total Tasks</p>
            <strong>0</strong>
          </div>
        </article>

        <article className="group-stat-card">
          <div className="group-stat-icon green">
            <FaCircleCheck />
          </div>

          <div>
            <p>Completed</p>
            <strong>0</strong>
          </div>
        </article>
      </section>

      <section className="group-panel">
        <div className="group-panel-header">
          <div>
            <h2>Group Members</h2>
            <p>Manage all members in this group.</p>
          </div>

          <button
            type="button"
            className="group-primary-button"
            onClick={() => {
              setInviteEmail("");
              setInviteMessage("");
              setIsInviteOpen(true);
            }}
          >
            <FaUserPlus />
            Add Member
          </button>
        </div>

        {members.length === 0 ? (
          <div className="group-empty-state">
            <FaUsers />
            <h3>No members yet</h3>
            <p>Invite your first member.</p>
          </div>
        ) : (
          <div className="members-list">
            {members.map((member) => (
              <article key={member.userId} className="member-card">
                <div className="member-avatar">
                  {member.name.charAt(0).toUpperCase()}
                </div>

                <div className="member-information">
                  <h3>{member.name}</h3>
                  <p>{member.email}</p>
                </div>

                <div className="member-actions">
                  <span className="member-role">{member.role}</span>

                  {group.role === "Admin" && member.role !== "Admin" && (
                    <button
                      className="remove-member-button"
                      onClick={() => handleRemoveMember(member.userId)}
                    >
                      <FaXmark />
                    </button>
                  )}
                </div>
              </article>
            ))}
          </div>
        )}
      </section>

<section className="group-panel">

  <div className="group-panel-header">

    <div>
      <h2>Group Tasks</h2>

      <p>
        Create tasks and assign them to group members.
      </p>
    </div>

    {group.role === "Admin" && (
      <button
        type="button"
        className="group-primary-button"
        onClick={() => setIsTaskOpen(true)}
      >
        <FaPlus />
        Create Task
      </button>
    )}

  </div>

  {tasks.length === 0 ? (

    <div className="group-empty-state">

      <FaListCheck />

      <h3>No tasks created yet</h3>

      <p>
        Create your first task and assign it to a member.
      </p>

    </div>

  ) : (

    <div className="task-list">

      {tasks.map((task) => (

        <article
          key={task.taskId}
          className="task-card"
        >

          <div className="task-content">

            <h3>{task.title}</h3>

            <p>{task.description}</p>

            <small>
              Assigned To:
              <strong> {task.assignedToName}</strong>
            </small>

            <br />

            <small>
              Due Date:
              {" "}
              {task.dueDate || "No Due Date"}
            </small>

          </div>

        <div className="task-card-actions">

  <span className="task-status">
    {task.status}
  </span>

  {group.role === "Admin" && (
    <button
      type="button"
      className="delete-task-button"
      onClick={() =>
        handleDeleteTask(task.taskId)
      }
    >
      <FaTrash />
    </button>
  )}

</div>

        </article>

      ))}

    </div>

  )}

</section>

      {isEditOpen && (
        <div className="group-modal-overlay">
          <section className="group-edit-modal">
            <h2>Edit Group</h2>

            <form onSubmit={handleUpdateGroup}>
              <div className="group-form-field">
                <label htmlFor="editGroupName">Group Name</label>

                <input
                  id="editGroupName"
                  type="text"
                  value={editName}
                  onChange={(event) => setEditName(event.target.value)}
                  required
                />
              </div>

              <div className="group-form-field">
                <label htmlFor="editDescription">Description</label>

                <textarea
                  id="editDescription"
                  value={editDescription}
                  onChange={(event) => setEditDescription(event.target.value)}
                  required
                />
              </div>

              <div className="group-edit-actions">
                <button
                  type="button"
                  className="group-edit-cancel"
                  onClick={closeEditForm}
                >
                  Cancel
                </button>

                <button type="submit" className="group-edit-save">
                  Save Changes
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {isInviteOpen && (
        <div className="group-modal-overlay">
          <section className="group-edit-modal">
            <h2>Invite Member</h2>

            <form onSubmit={handleSendInvitation}>
              <div className="group-form-field">
                <label htmlFor="inviteEmail">Registered User Email</label>

                <input
                  id="inviteEmail"
                  type="email"
                  placeholder="Enter registered email"
                  value={inviteEmail}
                  onChange={(event) => setInviteEmail(event.target.value)}
                  required
                />
              </div>

              {inviteMessage && (
                <p className="invite-message">{inviteMessage}</p>
              )}

              <div className="group-edit-actions">
                <button
                  type="button"
                  className="group-edit-cancel"
                  onClick={() => {
                    setIsInviteOpen(false);
                    setInviteEmail("");
                    setInviteMessage("");
                  }}
                >
                  Cancel
                </button>

                <button type="submit" className="group-edit-save">
                  Send Invitation
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {isTaskOpen && (
        <div className="group-modal-overlay">
          <section className="group-edit-modal">
            <h2>Create Task</h2>

            <form onSubmit ={handleCreateTask}>
              <div className="group-form-field">
                <label>Task Title</label>

                <input
                  type="text"
                  value={taskTitle}
                  onChange={(event) => setTaskTitle(event.target.value)}
                  placeholder="Enter task title"
                />
              </div>

              <div className="group-form-field">
                <label>Description</label>

                <textarea
                  value={taskDescription}
                  onChange={(event) => setTaskDescription(event.target.value)}
                  placeholder="Task description"
                />
              </div>

              <div className="group-form-field">
                <label>Assign To</label>

                <select
                  value={assignedTo}
                  onChange={(event) => setAssignedTo(event.target.value)}
                >
                  <option value="">Select Member</option>

                  {members.map((member) => (
                    <option key={member.userId} value={member.userId}>
                      {member.name}
                    </option>
                  ))}
                </select>
              </div>

              <div className="group-form-field">
                <label>Due Date</label>

                <input
                  type="date"
                  value={dueDate}
                  onChange={(event) => setDueDate(event.target.value)}
                />
              </div>

              <div className="group-edit-actions">
                <button
                  type="button"
                  className="group-edit-cancel"
                  onClick={() => setIsTaskOpen(false)}
                >
                  Cancel
                </button>

                <button type="submit" className="group-edit-save">
                  Create Task
                </button>
              </div>
            </form>
          </section>
        </div>
      )}
    </main>
  );
}
