import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Register.css";

export function Register() {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");

  const navigate = useNavigate();

  function handleName(event) {
    setName(event.target.value);
  }

  function handleEmail(event) {
    setEmail(event.target.value);
  }

  function handlePassword(event) {
    setPassword(event.target.value);
  }

  async function handleRegister(event) {
    event.preventDefault();

    const userData = {
      name: name.trim(),
      email: email.trim(),
      password: password.trim(),
    };

    const response = await fetch("http://localhost:5000/api/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(userData),
    });

    const data = await response.json();

    if (response.ok) {
      setMessage(
        "Registration successful! Redirecting to your dashboard..."
      );
      localStorage.setItem("user", JSON.stringify(data.user));

      setName("");
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
    <div className="register-page">
      <div className="register-card">
        <h1 className="register-title">Create Account</h1>

        <p className="register-description">
          Register to join the student community.
        </p>

        <form className="register-form" onSubmit={handleRegister}>
          <div className="form-group">
            <label htmlFor="name">Full Name</label>

            <input
              id="name"
              className="register-input"
              type="text"
              value={name}
              onChange={handleName}
              placeholder="Enter your name"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="email">Email Address</label>

            <input
              id="email"
              className="register-input"
              type="email"
              value={email}
              onChange={handleEmail}
              placeholder="Enter your email"
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>

            <input
              id="password"
              className="register-input"
              type="password"
              value={password}
              onChange={handlePassword}
              placeholder="Enter your password"
              required
            />
          </div>

          <button className="register-button" type="submit">
            Register
          </button>
        </form>


        {message && <p className="register-message">{message}</p>}


        <p className="register-login-text">
    Already have an account?

    <Link
        to="/login"
        className="register-login-link"
    >
        Login
    </Link>
</p>
      </div>
    </div>
  );
}
