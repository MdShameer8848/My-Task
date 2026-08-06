const db = require("../database/db");

function getGroupMembers(req, res) {
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

      const membersSql = `
        SELECT
          u.user_id,
          u.name,
          u.email,
          gm.role
        FROM group_members gm

        JOIN user u
          ON gm.user_id = u.user_id

        WHERE gm.group_id = ?

        ORDER BY
          CASE
            WHEN gm.role = 'Admin'
            THEN 0
            ELSE 1
          END,
          u.name
      `;

      db.query(
        membersSql,
        [groupId],
        (membersError, membersResult) => {
          if (membersError) {
            console.log(
              "Fetch group members error:",
              membersError
            );

            return res.status(500).json({
              message:
                "Failed to fetch group members",
            });
          }

          const members = membersResult.map(
            (member) => ({
              userId: member.user_id,
              name: member.name,
              email: member.email,
              role: member.role,
            })
          );

          return res.status(200).json({
            members,
          });
        }
      );
    }
  );
}

function removeGroupMember(req, res) {
  const groupId = req.params.groupId;
  const memberUserId =
    req.params.memberUserId;

  const { adminUserId } = req.body;

  if (!adminUserId) {
    return res.status(400).json({
      message: "Admin user ID is required",
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
    [groupId, adminUserId],
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
            "Only the group admin can remove members",
        });
      }

      const findMemberSql = `
        SELECT role
        FROM group_members
        WHERE group_id = ?
        AND user_id = ?
      `;

      db.query(
        findMemberSql,
        [groupId, memberUserId],
        (memberError, memberResult) => {
          if (memberError) {
            console.log(
              "Find member error:",
              memberError
            );

            return res.status(500).json({
              message:
                "Failed to find group member",
            });
          }

          if (memberResult.length === 0) {
            return res.status(404).json({
              message:
                "Group member not found",
            });
          }

          const selectedMember =
            memberResult[0];

          if (
            selectedMember.role ===
            "Admin"
          ) {
            const countAdminsSql = `
              SELECT COUNT(*) AS adminCount
              FROM group_members
              WHERE group_id = ?
              AND role = 'Admin'
            `;

            db.query(
              countAdminsSql,
              [groupId],
              (
                countError,
                countResult
              ) => {
                if (countError) {
                  console.log(
                    "Count admins error:",
                    countError
                  );

                  return res
                    .status(500)
                    .json({
                      message:
                        "Failed to check admins",
                    });
                }

                if (
                  countResult[0]
                    .adminCount <= 1
                ) {
                  return res
                    .status(400)
                    .json({
                      message:
                        "The only Admin cannot be removed",
                    });
                }

                deleteMember();
              }
            );
          } else {
            deleteMember();
          }

          function deleteMember() {
            const deleteSql = `
              DELETE FROM group_members
              WHERE group_id = ?
              AND user_id = ?
            `;

            db.query(
              deleteSql,
              [
                groupId,
                memberUserId,
              ],
              (
                deleteError,
                deleteResult
              ) => {
                if (deleteError) {
                  console.log(
                    "Remove member error:",
                    deleteError
                  );

                  return res
                    .status(500)
                    .json({
                      message:
                        "Failed to remove member",
                    });
                }

                if (
                  deleteResult
                    .affectedRows === 0
                ) {
                  return res
                    .status(404)
                    .json({
                      message:
                        "Member not found",
                    });
                }

                return res
                  .status(200)
                  .json({
                    message:
                      "Member removed successfully",
                  });
              }
            );
          }
        }
      );
    }
  );
}

module.exports = {
  getGroupMembers,
  removeGroupMember,
};