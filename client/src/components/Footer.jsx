import "../styles/Footer.css";
import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="home-footer">
      <div className="footer-content">
        <div>
          <h2>MyTask</h2>

          <p>
            A simple group-based project and task management application
          </p>
        </div>

        <div className="footer-links">
          <a href="#features">Features</a>

          <a href="#how-it-works">How It Works</a>

          <Link to="/login">Login</Link>

          <Link to="/register">Register</Link>
        </div>
      </div>

      <div className="footer-bottom">
        <p>© 2026 MyTask.</p>
      </div>
    </footer>
  );
}
