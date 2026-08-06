import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";

export function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function handleLogin(event) {
    event.preventDefault();

    if (!email.trim() || !password.trim()) {
      setMessage("Please fill in all the fields");
      return;
    }

    const userData = {
      email: email.trim(),
      password: password.trim(),
    };

    const response = await fetch("http://localhost:5000/api/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    setMessage(data.message);

    if (response.ok) {
        localStorage.setItem("user", JSON.stringify(data.user));
        // console.log(data.user)
      setEmail("");
      setPassword("");

      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } else {
      setMessage(data.message);
    }
  }

  return (
    <div className="login-page">
      <div className="login-card">
        <h1 className="login-logo">MyTask</h1>

        <h2 className="login-title">Welcome back</h2>

        <p className="login-subtitle">
          Log in to manage your groups, projects, and tasks.
        </p>

        <form className="login-form" onSubmit={handleLogin}>
          <div className="login-form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              className="login-input"
              type="email"
              value={email}
              onChange={handleEmail}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="login-form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              className="login-input"
              type="password"
              value={password}
              onChange={handlePassword}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="login-button" type="submit">
            Login
          </button>
        </form>

        {message && <p className="login-message">{message}</p>}

        <p className="login-register-text">
          Don&apos;t have an account?
          <Link to="/register" className="login-register-link">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
}
