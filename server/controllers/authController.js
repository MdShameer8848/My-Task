const db = require("../database/db");

function registerUser(req, res) {
  const { name, email, password } = req.body;

  const sql = `
        INSERT INTO user(name, email, password)
        VALUES (?, ?, ?)
    `;

  db.query(sql, [name, email, password], (error, result) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "User with same email has already registered",
      });
    }

    res.status(201).json({
      message: `Registration completed successfully.
                Preparing your dashboard...`,
      user:{
        user_id:result.insertId,
        name:name,
        email:email
      }
    });
  });
}

function loginUser(req, res) {
  const { email, password } = req.body;

  const sql = `
        SELECT user_id, name, email
        FROM user
        WHERE email = ?
        AND password = ?
    `;

  db.query(sql, [email, password], (error, result) => {
    if (error) {
      console.log(error);

      return res.status(500).json({
        message: "Failed to login",
      });
    }

    if (result.length === 0) {
      return res.status(401).json({
        message: "Incorrect email or password",
      });
    }

    const user = result[0];

    return res.status(200).json({
      message: "Login successful. Redirecting to your dashboard",
      user:{
        user_id:user.user_id,
        name:user.name,
        email:user.email
      }
    });
  });
}

module.exports = {
  registerUser,
  loginUser,
};
