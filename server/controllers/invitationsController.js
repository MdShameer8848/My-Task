const db = require("../database/db");

function createInvitation(req, res) {
  const groupId = req.params.groupId;

  const { email, invitedBy } = req.body;

  if (!email?.trim() || !invitedBy) {
    return res.status(400).json({
      message: "Email and inviter ID are required",
    });
  }

  const findUserSql = `
    SELECT user_id, name, email
    FROM user
    WHERE email = ?
  `;

  db.query(
    findUserSql,
    [email.trim()],
    (findError, users) => {
      if (findError) {
        console.log(
          "Find invited user error:",
          findError
        );

        return res.status(500).json({
          message: "Failed to find the user",
        });
      }

      if (users.length === 0) {
        return res.status(404).json({
          message:
            "No registered user found with this email",
        });
      }

      const invitedUser = users[0];

      if (
        Number(invitedUser.user_id) ===
        Number(invitedBy)
      ) {
        return res.status(400).json({
          message: "You cannot invite yourself",
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
        [groupId, invitedBy],
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
                "Only the group admin can invite members",
            });
          }

          const invitationSql = `
            INSERT INTO group_invitations(
              group_id,
              invited_user_id,
              invited_by,
              status
            )
            VALUES (?, ?, ?, 'Pending')
          `;

          db.query(
            invitationSql,
            [
              groupId,
              invitedUser.user_id,
              invitedBy,
            ],
            (invitationError, result) => {
              if (invitationError) {
                console.log(
                  "Create invitation error:",
                  invitationError
                );

                if (
                  invitationError.code ===
                  "ER_DUP_ENTRY"
                ) {
                  return res.status(409).json({
                    message:
                      "This user has already been invited to the group",
                  });
                }

                return res.status(500).json({
                  message:
                    "Failed to create invitation",
                });
              }

              return res.status(201).json({
                message:
                  "Invitation sent successfully",

                invitation: {
                  invitationId:
                    result.insertId,

                  groupId:
                    Number(groupId),

                  invitedUserId:
                    invitedUser.user_id,

                  invitedUserName:
                    invitedUser.name,

                  invitedUserEmail:
                    invitedUser.email,

                  status: "Pending",
                },
              });
            }
          );
        }
      );
    }
  );
}

function getInvitationsByUser(req, res) {
  const userId = req.params.userId;

  const sql = `
    SELECT
      gi.invitation_id AS invitationId,
      gi.group_id AS groupId,
      gi.status,
      tg.group_name AS groupName,
      tg.group_description AS groupDescription,
      inviter.name AS invitedByName
    FROM group_invitations gi

    JOIN task_groups tg
      ON gi.group_id = tg.group_id

    JOIN user inviter
      ON gi.invited_by = inviter.user_id

    WHERE gi.invited_user_id = ?
    AND gi.status = 'Pending'

    ORDER BY gi.invitation_id DESC
  `;

  db.query(
    sql,
    [userId],
    (error, result) => {
      if (error) {
        console.log(
          "Fetch invitations error:",
          error
        );

        return res.status(500).json({
          message:
            "Failed to fetch invitations",
        });
      }

      return res.status(200).json({
        invitations: result,
      });
    }
  );
}

function acceptInvitation(req, res) {
  const invitationId =
    req.params.invitationId;

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  const findInvitationSql = `
    SELECT
      invitation_id,
      group_id,
      invited_user_id,
      status
    FROM group_invitations
    WHERE invitation_id = ?
    AND invited_user_id = ?
  `;

  db.query(
    findInvitationSql,
    [invitationId, userId],
    (findError, invitations) => {
      if (findError) {
        console.log(
          "Find invitation error:",
          findError
        );

        return res.status(500).json({
          message:
            "Failed to find invitation",
        });
      }

      if (invitations.length === 0) {
        return res.status(404).json({
          message:
            "Invitation not found",
        });
      }

      const invitation = invitations[0];

      if (invitation.status !== "Pending") {
        return res.status(409).json({
          message:
            "Invitation has already been handled",
        });
      }

      const addMemberSql = `
        INSERT INTO group_members(
          group_id,
          user_id,
          role
        )
        VALUES (?, ?, 'Member')
      `;

      db.query(
        addMemberSql,
        [
          invitation.group_id,
          userId,
        ],
        (memberError) => {
          if (memberError) {
            console.log(
              "Add member error:",
              memberError
            );

            if (
              memberError.code ===
              "ER_DUP_ENTRY"
            ) {
              return res.status(409).json({
                message:
                  "You are already a member of this group",
              });
            }

            return res.status(500).json({
              message:
                "Failed to add member",
            });
          }

          const updateInvitationSql = `
            UPDATE group_invitations
            SET status = 'Accepted'
            WHERE invitation_id = ?
          `;

          db.query(
            updateInvitationSql,
            [invitationId],
            (updateError) => {
              if (updateError) {
                console.log(
                  "Update invitation error:",
                  updateError
                );

                return res.status(500).json({
                  message:
                    "Member added, but failed to update invitation",
                });
              }

              return res.status(200).json({
                message:
                  "Invitation accepted successfully",

                groupId:
                  invitation.group_id,
              });
            }
          );
        }
      );
    }
  );
}

function rejectInvitation(req, res) {
  const invitationId =
    req.params.invitationId;

  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      message: "User ID is required",
    });
  }

  const sql = `
    UPDATE group_invitations
    SET status = 'Rejected'
    WHERE invitation_id = ?
    AND invited_user_id = ?
    AND status = 'Pending'
  `;

  db.query(
    sql,
    [invitationId, userId],
    (error, result) => {
      if (error) {
        console.log(
          "Reject invitation error:",
          error
        );

        return res.status(500).json({
          message:
            "Failed to reject invitation",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          message:
            "Pending invitation not found",
        });
      }

      return res.status(200).json({
        message:
          "Invitation rejected successfully",
      });
    }
  );
}

module.exports = {
  createInvitation,
  getInvitationsByUser,
  acceptInvitation,
  rejectInvitation,
};