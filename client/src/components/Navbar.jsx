import "../styles/Navbar.css";
import { Link } from "react-router-dom";

export function Navbar() {
    return (
        <nav className="navbar">

            <div className="navbar-logo">

                <Link to="/">
                    MyTask
                </Link>

            </div>

            <div className="navbar-links">

                <a href="#features">
                    Features
                </a>

                <a href="#how-it-works">
                    How It Works
                </a>

                <Link to="/login">
                    Login
                </Link>

                <Link
                    to="/register"
                    className="register-btn"
                >
                    Register
                </Link>

            </div>

        </nav>
    );
}