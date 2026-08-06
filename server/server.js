const express = require("express");
const cors = require("cors");

const { registerUser, loginUser } = require("./controllers/authController");

const {
  createGroup,
  getGroupsByUser,
  getGroupById,
  updateGroup,
  deleteGroup,
} = require("./controllers/groupsController");

const {
  createInvitation,
  getInvitationsByUser,
  acceptInvitation,
  rejectInvitation,
} = require("./controllers/invitationsController");

const {
  getGroupMembers,
  removeGroupMember,
} = require("./controllers/membersController");

const {
  createTask,
  getGroupTasks,
  getTasksByUser,
  updateTaskStatus,
  updateTask,
  deleteTask,
} = require("./controllers/tasksController");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Welcome to my backend");
});

/* Authentication */

app.post("/api/register", registerUser);

app.post("/api/login", loginUser);

/* Groups */

app.post("/api/groups", createGroup);

app.get("/api/groups/user/:userId", getGroupsByUser);

app.get("/api/groups/:groupId", getGroupById);

app.put("/api/groups/:groupId", updateGroup);

app.delete("/api/groups/:groupId", deleteGroup);

/* Invitations */

app.post("/api/groups/:groupId/invitations", createInvitation);

app.get("/api/invitations/user/:userId", getInvitationsByUser);

app.put("/api/invitations/:invitationId/accept", acceptInvitation);

app.put("/api/invitations/:invitationId/reject", rejectInvitation);

/* Members */

app.get("/api/groups/:groupId/members", getGroupMembers);

app.delete("/api/groups/:groupId/members/:memberUserId", removeGroupMember);

/* Tasks */

app.post("/api/groups/:groupId/tasks", createTask);

app.get("/api/groups/:groupId/tasks", getGroupTasks);

app.get("/api/tasks/user/:userId", getTasksByUser);

app.put("/api/tasks/:taskId/status", updateTaskStatus);

app.put("/api/tasks/:taskId", updateTask);

app.delete("/api/tasks/:taskId", deleteTask);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
