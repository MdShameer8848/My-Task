const db = require("../database/db");

function createGroup(req, res) {
  const {
    groupName,
    groupDescription,
    createdBy,
  } = req.body;

  if (
    !groupName?.trim() ||
    !groupDescription?.trim() ||
    !createdBy
  ) {
    return res.status(400).json({
      message:
        "Group name, description and user ID are required",
    });
  }

  const createGroupSql = `
    INSERT INTO task_groups(
      group_name,
      group_description,
      created_by
    )
    VALUES (?, ?, ?)
  `;

  db.query(
    createGroupSql,
    [
      groupName.trim(),
      groupDescription.trim(),
      createdBy,
    ],
    (groupError, groupResult) => {
      if (groupError) {
        console.log(
          "Create group error:",
          groupError
        );

        return res.status(500).json({
          message: "Failed to create group",
        });
      }

      const newGroupId =
        groupResult.insertId;

      const addAdminSql = `
        INSERT INTO group_members(
          group_id,
          user_id,
          role
        )
        VALUES (?, ?, 'Admin')
      `;

      db.query(
        addAdminSql,
        [newGroupId, createdBy],
        (memberError) => {
          if (memberError) {
            console.log(
              "Add group admin error:",
              memberError
            );

            return res.status(500).json({
              message:
                "Group created, but failed to add the creator as admin",
            });
          }

          return res.status(201).json({
            message:
              "Group created successfully",

            group: {
              groupId: newGroupId,
              groupName:
                groupName.trim(),
              groupDescription:
                groupDescription.trim(),
              createdBy,
              role: "Admin",
            },
          });
        }
      );
    }
  );
}

function getGroupsByUser(req, res) {
  const userId = req.params.userId;

  const sql = `
    SELECT
      tg.group_id,
      tg.group_name,
      tg.group_description,
      tg.created_by,
      gm.role
    FROM group_members gm

    JOIN task_groups tg
      ON gm.group_id = tg.group_id

    WHERE gm.user_id = ?

    ORDER BY tg.group_id DESC
  `;

  db.query(
    sql,
    [userId],
    (error, result) => {
      if (error) {
        console.log(
          "Fetch groups error:",
          error
        );

        return res.status(500).json({
          message:
            "Failed to fetch groups",
        });
      }

      const groups = result.map(
        (group) => ({
          groupId: group.group_id,
          groupName:
            group.group_name,
          groupDescription:
            group.group_description,
          createdBy:
            group.created_by,
          role: group.role,
        })
      );

      return res.status(200).json({
        groups,
      });
    }
  );
}

function getGroupById(req, res) {
  const groupId = req.params.groupId;
  const userId = req.query.userId;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  const sql = `
    SELECT
      tg.group_id,
      tg.group_name,
      tg.group_description,
      tg.created_by,
      gm.role
    FROM task_groups tg

    JOIN group_members gm
      ON tg.group_id = gm.group_id

    WHERE tg.group_id = ?
    AND gm.user_id = ?
  `;

  db.query(
    sql,
    [groupId, userId],
    (error, result) => {
      if (error) {
        console.log(
          "Fetch group error:",
          error
        );

        return res.status(500).json({
          message:
            "Failed to fetch group",
        });
      }

      if (result.length === 0) {
        return res.status(403).json({
          message:
            "Group not found or you are not a member",
        });
      }

      const group = result[0];

      return res.status(200).json({
        group: {
          groupId:
            group.group_id,
          groupName:
            group.group_name,
          groupDescription:
            group.group_description,
          createdBy:
            group.created_by,
          role: group.role,
        },
      });
    }
  );
}

function updateGroup(req, res) {
  const groupId = req.params.groupId;

  const {
    groupName,
    groupDescription,
    userId,
  } = req.body;

  if (
    !groupName?.trim() ||
    !groupDescription?.trim() ||
    !userId
  ) {
    return res.status(400).json({
      message:
        "Group name, description and user ID are required",
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
    [groupId, userId],
    (adminError, adminResult) => {
      if (adminError) {
        console.log(
          "Check admin error:",
          adminError
        );

        return res.status(500).json({
          message:
            "Failed to check group permission",
        });
      }

      if (adminResult.length === 0) {
        return res.status(403).json({
          message:
            "Only the group admin can edit this group",
        });
      }

      const updateSql = `
        UPDATE task_groups
        SET
          group_name = ?,
          group_description = ?
        WHERE group_id = ?
      `;

      db.query(
        updateSql,
        [
          groupName.trim(),
          groupDescription.trim(),
          groupId,
        ],
        (updateError, result) => {
          if (updateError) {
            console.log(
              "Update group error:",
              updateError
            );

            return res.status(500).json({
              message:
                "Failed to update group",
            });
          }

          if (
            result.affectedRows === 0
          ) {
            return res.status(404).json({
              message:
                "Group not found",
            });
          }

          return res.status(200).json({
            message:
              "Group updated successfully",

            group: {
              groupId:
                Number(groupId),
              groupName:
                groupName.trim(),
              groupDescription:
                groupDescription.trim(),
              role: "Admin",
            },
          });
        }
      );
    }
  );
}

function deleteGroup(req, res) {
  const groupId = req.params.groupId;
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
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
    [groupId, userId],
    (adminError, adminResult) => {
      if (adminError) {
        console.log("Check admin error:", adminError);

        return res.status(500).json({
          message: "Failed to check permission",
        });
      }

      if (adminResult.length === 0) {
        return res.status(403).json({
          message: "Only the Admin can delete this group",
        });
      }

      const deleteTasksSql = `
        DELETE FROM tasks
        WHERE group_id = ?
      `;

      db.query(
        deleteTasksSql,
        [groupId],
        (tasksError) => {
          if (tasksError) {
            console.log("Delete tasks error:", tasksError);

            return res.status(500).json({
              message: "Failed to delete group tasks",
            });
          }

          const deleteInvitationsSql = `
            DELETE FROM group_invitations
            WHERE group_id = ?
          `;

          db.query(
            deleteInvitationsSql,
            [groupId],
            (invitationsError) => {
              if (invitationsError) {
                console.log(
                  "Delete invitations error:",
                  invitationsError
                );

                return res.status(500).json({
                  message: "Failed to delete group invitations",
                });
              }

              const deleteMembersSql = `
                DELETE FROM group_members
                WHERE group_id = ?
              `;

              db.query(
                deleteMembersSql,
                [groupId],
                (membersError) => {
                  if (membersError) {
                    console.log(
                      "Delete members error:",
                      membersError
                    );

                    return res.status(500).json({
                      message: "Failed to delete group members",
                    });
                  }

                  const deleteGroupSql = `
                    DELETE FROM task_groups
                    WHERE group_id = ?
                  `;

                  db.query(
                    deleteGroupSql,
                    [groupId],
                    (groupError, result) => {
                      if (groupError) {
                        console.log(
                          "Delete group error:",
                          groupError
                        );

                        return res.status(500).json({
                          message: "Failed to delete group",
                        });
                      }

                      if (result.affectedRows === 0) {
                        return res.status(404).json({
                          message: "Group not found",
                        });
                      }

                      return res.status(200).json({
                        message: "Group deleted successfully",
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
  );
}

module.exports = {
  createGroup,
  getGroupsByUser,
  getGroupById,
  updateGroup,
  deleteGroup,
};