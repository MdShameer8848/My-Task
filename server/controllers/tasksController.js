const db = require("../database/db");

function createTask(req, res) {
  const groupId = req.params.groupId;

  const {
    title,
    description,
    assignedTo,
    createdBy,
    dueDate,
  } = req.body;

  if (
    !title?.trim() ||
    !assignedTo ||
    !createdBy
  ) {
    return res.status(400).json({
      message:
        "Task title, assigned member and creator ID are required",
    });
  }

  const checkAdminSql = `
    SELECT group_member_id
    FROM group_members
    WHERE group_id = ?
    AND user_id = ?
    AND role = 'Admin'
  `;

  db.query(
    checkAdminSql,
    [groupId, createdBy],
    (adminError, adminResult) => {
      if (adminError) {
        console.log(
          "Check admin error:",
          adminError
        );

        return res.status(500).json({
          message:
            "Failed to check admin permission",
        });
      }

      if (adminResult.length === 0) {
        return res.status(403).json({
          message:
            "Only the group admin can create tasks",
        });
      }

      const checkMemberSql = `
        SELECT group_member_id
        FROM group_members
        WHERE group_id = ?
        AND user_id = ?
      `;

      db.query(
        checkMemberSql,
        [groupId, assignedTo],
        (memberError, memberResult) => {
          if (memberError) {
            console.log(
              "Check assigned member error:",
              memberError
            );

            return res.status(500).json({
              message:
                "Failed to check assigned member",
            });
          }

          if (memberResult.length === 0) {
            return res.status(400).json({
              message:
                "Assigned user is not a member of this group",
            });
          }

          const createTaskSql = `
            INSERT INTO tasks(
              group_id,
              title,
              description,
              assigned_to,
              created_by,
              due_date,
              status
            )
            VALUES (?, ?, ?, ?, ?, ?, 'Pending')
          `;

          db.query(
            createTaskSql,
            [
              groupId,
              title.trim(),
              description?.trim() || null,
              assignedTo,
              createdBy,
              dueDate || null,
            ],
            (taskError, taskResult) => {
              if (taskError) {
                console.log(
                  "Create task error:",
                  taskError
                );

                return res.status(500).json({
                  message:
                    "Failed to create task",
                });
              }

              const fetchTaskSql = `
                SELECT
                  t.task_id,
                  t.group_id,
                  t.title,
                  t.description,
                  t.assigned_to,
                  assignedUser.name
                    AS assigned_to_name,
                  t.created_by,
                  t.due_date,
                  t.status
                FROM tasks t

                JOIN user assignedUser
                  ON t.assigned_to =
                    assignedUser.user_id

                WHERE t.task_id = ?
              `;

              db.query(
                fetchTaskSql,
                [taskResult.insertId],
                (fetchError, fetchResult) => {
                  if (fetchError) {
                    console.log(
                      "Fetch created task error:",
                      fetchError
                    );

                    return res.status(500).json({
                      message:
                        "Task created, but failed to return task data",
                    });
                  }

                  const task = fetchResult[0];

                  return res.status(201).json({
                    message:
                      "Task created successfully",

                    task: {
                      taskId: task.task_id,
                      groupId: task.group_id,
                      title: task.title,
                      description:
                        task.description,
                      assignedTo:
                        task.assigned_to,
                      assignedToName:
                        task.assigned_to_name,
                      createdBy:
                        task.created_by,
                      dueDate:
                        task.due_date,
                      status: task.status,
                    },
                  });
                }
              );
            }
          );
        }
      );
    }
  );
}

function getGroupTasks(req, res) {
  const groupId = req.params.groupId;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  const checkMembershipSql = `
    SELECT group_member_id
    FROM group_members
    WHERE group_id = ?
    AND user_id = ?
  `;

  db.query(
    checkMembershipSql,
    [groupId, userId],
    (membershipError, membershipResult) => {
      if (membershipError) {
        console.log(
          "Check membership error:",
          membershipError
        );

        return res.status(500).json({
          message:
            "Failed to check group membership",
        });
      }

      if (membershipResult.length === 0) {
        return res.status(403).json({
          message:
            "You are not a member of this group",
        });
      }

      const tasksSql = `
        SELECT
          t.task_id,
          t.group_id,
          t.title,
          t.description,
          t.assigned_to,
          assignedUser.name
            AS assigned_to_name,
          t.created_by,
          creatorUser.name
            AS created_by_name,
          t.due_date,
          t.status
        FROM tasks t

        JOIN user assignedUser
          ON t.assigned_to =
            assignedUser.user_id

        JOIN user creatorUser
          ON t.created_by =
            creatorUser.user_id

        WHERE t.group_id = ?

        ORDER BY t.task_id DESC
      `;

      db.query(
        tasksSql,
        [groupId],
        (tasksError, tasksResult) => {
          if (tasksError) {
            console.log(
              "Fetch group tasks error:",
              tasksError
            );

            return res.status(500).json({
              message:
                "Failed to fetch group tasks",
            });
          }

          const tasks = tasksResult.map(
            (task) => ({
              taskId: task.task_id,
              groupId: task.group_id,
              title: task.title,
              description:
                task.description,
              assignedTo:
                task.assigned_to,
              assignedToName:
                task.assigned_to_name,
              createdBy:
                task.created_by,
              createdByName:
                task.created_by_name,
              dueDate:
                task.due_date,
              status:
                task.status,
            })
          );

          return res.status(200).json({
            tasks,
          });
        }
      );
    }
  );
}

function getTasksByUser(req, res) {
  const userId = req.params.userId;

  const sql = `
    SELECT
      t.task_id,
      t.group_id,
      tg.group_name,
      t.title,
      t.description,
      t.assigned_to,
      t.due_date,
      t.status
    FROM tasks t

    JOIN task_groups tg
      ON t.group_id = tg.group_id

    WHERE t.assigned_to = ?

    ORDER BY t.task_id DESC
  `;

  db.query(
    sql,
    [userId],
    (error, result) => {
      if (error) {
        console.log(
          "Fetch user tasks error:",
          error
        );

        return res.status(500).json({
          message:
            "Failed to fetch assigned tasks",
        });
      }

      const tasks = result.map(
        (task) => ({
          taskId:
            task.task_id,
          groupId:
            task.group_id,
          groupName:
            task.group_name,
          title:
            task.title,
          description:
            task.description,
          assignedTo:
            task.assigned_to,
          dueDate:
            task.due_date,
          status:
            task.status,
        })
      );

      return res.status(200).json({
        tasks,
      });
    }
  );
}

function updateTaskStatus(req, res) {
  const taskId = req.params.taskId;

  const {
    userId,
    status,
  } = req.body;

  const allowedStatuses = [
    "Pending",
    "In Progress",
    "Completed",
  ];

  if (
    !userId ||
    !allowedStatuses.includes(status)
  ) {
    return res.status(400).json({
      message:
        "Valid user ID and task status are required",
    });
  }

  const findTaskSql = `
    SELECT
      group_id,
      assigned_to
    FROM tasks
    WHERE task_id = ?
  `;

  db.query(
    findTaskSql,
    [taskId],
    (taskError, taskResult) => {
      if (taskError) {
        console.log(
          "Find task error:",
          taskError
        );

        return res.status(500).json({
          message:
            "Failed to find task",
        });
      }

      if (taskResult.length === 0) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      const task = taskResult[0];

      if (
        Number(task.assigned_to) ===
        Number(userId)
      ) {
        updateStatus();
        return;
      }

      const checkAdminSql = `
        SELECT group_member_id
        FROM group_members
        WHERE group_id = ?
        AND user_id = ?
        AND role = 'Admin'
      `;

      db.query(
        checkAdminSql,
        [task.group_id, userId],
        (adminError, adminResult) => {
          if (adminError) {
            console.log(
              "Check admin error:",
              adminError
            );

            return res.status(500).json({
              message:
                "Failed to check permission",
            });
          }

          if (adminResult.length === 0) {
            return res.status(403).json({
              message:
                "Only the assigned member or group admin can update this task",
            });
          }

          updateStatus();
        }
      );

      function updateStatus() {
        const updateSql = `
          UPDATE tasks
          SET status = ?
          WHERE task_id = ?
        `;

        db.query(
          updateSql,
          [status, taskId],
          (updateError, updateResult) => {
            if (updateError) {
              console.log(
                "Update task status error:",
                updateError
              );

              return res.status(500).json({
                message:
                  "Failed to update task status",
              });
            }

            if (
              updateResult.affectedRows === 0
            ) {
              return res.status(404).json({
                message:
                  "Task not found",
              });
            }

            return res.status(200).json({
              message:
                "Task status updated successfully",
              status,
            });
          }
        );
      }
    }
  );
}

function updateTask(req, res) {
  const taskId = req.params.taskId;

  const {
    userId,
    title,
    description,
    assignedTo,
    dueDate,
  } = req.body;

  if (
    !userId ||
    !title?.trim() ||
    !assignedTo
  ) {
    return res.status(400).json({
      message:
        "User ID, title and assigned member are required",
    });
  }

  const findTaskSql = `
    SELECT group_id
    FROM tasks
    WHERE task_id = ?
  `;

  db.query(
    findTaskSql,
    [taskId],
    (taskError, taskResult) => {
      if (taskError) {
        console.log(
          "Find task error:",
          taskError
        );

        return res.status(500).json({
          message:
            "Failed to find task",
        });
      }

      if (taskResult.length === 0) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      const groupId =
        taskResult[0].group_id;

      const checkAdminSql = `
        SELECT group_member_id
        FROM group_members
        WHERE group_id = ?
        AND user_id = ?
        AND role = 'Admin'
      `;

      db.query(
        checkAdminSql,
        [groupId, userId],
        (adminError, adminResult) => {
          if (adminError) {
            console.log(
              "Check admin error:",
              adminError
            );

            return res.status(500).json({
              message:
                "Failed to check permission",
            });
          }

          if (adminResult.length === 0) {
            return res.status(403).json({
              message:
                "Only the group admin can edit tasks",
            });
          }

          const checkAssignedMemberSql = `
            SELECT group_member_id
            FROM group_members
            WHERE group_id = ?
            AND user_id = ?
          `;

          db.query(
            checkAssignedMemberSql,
            [groupId, assignedTo],
            (
              memberError,
              memberResult
            ) => {
              if (memberError) {
                console.log(
                  "Check assigned member error:",
                  memberError
                );

                return res.status(500).json({
                  message:
                    "Failed to check assigned member",
                });
              }

              if (
                memberResult.length === 0
              ) {
                return res.status(400).json({
                  message:
                    "Assigned user is not a group member",
                });
              }

              const updateSql = `
                UPDATE tasks
                SET
                  title = ?,
                  description = ?,
                  assigned_to = ?,
                  due_date = ?
                WHERE task_id = ?
              `;

              db.query(
                updateSql,
                [
                  title.trim(),
                  description?.trim() ||
                    null,
                  assignedTo,
                  dueDate || null,
                  taskId,
                ],
                (
                  updateError,
                  updateResult
                ) => {
                  if (updateError) {
                    console.log(
                      "Update task error:",
                      updateError
                    );

                    return res
                      .status(500)
                      .json({
                        message:
                          "Failed to update task",
                      });
                  }

                  if (
                    updateResult
                      .affectedRows === 0
                  ) {
                    return res
                      .status(404)
                      .json({
                        message:
                          "Task not found",
                      });
                  }

                  return res
                    .status(200)
                    .json({
                      message:
                        "Task updated successfully",
                    });
                }
              );
            }
          );
        }
      );
    }
  );
}

function deleteTask(req, res) {
  const taskId = req.params.taskId;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  const findTaskSql = `
    SELECT group_id
    FROM tasks
    WHERE task_id = ?
  `;

  db.query(
    findTaskSql,
    [taskId],
    (taskError, taskResult) => {
      if (taskError) {
        console.log(
          "Find task error:",
          taskError
        );

        return res.status(500).json({
          message:
            "Failed to find task",
        });
      }

      if (taskResult.length === 0) {
        return res.status(404).json({
          message: "Task not found",
        });
      }

      const groupId =
        taskResult[0].group_id;

      const checkAdminSql = `
        SELECT group_member_id
        FROM group_members
        WHERE group_id = ?
        AND user_id = ?
        AND role = 'Admin'
      `;

      db.query(
        checkAdminSql,
        [groupId, userId],
        (adminError, adminResult) => {
          if (adminError) {
            console.log(
              "Check admin error:",
              adminError
            );

            return res.status(500).json({
              message:
                "Failed to check permission",
            });
          }

          if (adminResult.length === 0) {
            return res.status(403).json({
              message:
                "Only the group admin can delete tasks",
            });
          }

          const deleteSql = `
            DELETE FROM tasks
            WHERE task_id = ?
          `;

          db.query(
            deleteSql,
            [taskId],
            (
              deleteError,
              deleteResult
            ) => {
              if (deleteError) {
                console.log(
                  "Delete task error:",
                  deleteError
                );

                return res.status(500).json({
                  message:
                    "Failed to delete task",
                });
              }

              if (
                deleteResult
                  .affectedRows === 0
              ) {
                return res.status(404).json({
                  message:
                    "Task not found",
                });
              }

              return res.status(200).json({
                message:
                  "Task deleted successfully",
              });
            }
          );
        }
      );
    }
  );
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
  }
}
module.exports = {
  createTask,
  getGroupTasks,
  getTasksByUser,
  updateTaskStatus,
  updateTask,
  deleteTask,
};