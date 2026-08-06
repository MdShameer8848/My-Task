import "../styles/Hero.css";
import { Link } from "react-router-dom";

export function Hero() {
    return (
        <section className="hero-section">

            <div className="hero-content">

                <p className="hero-small-title">
                    SIMPLE TEAM PROJECT MANAGEMENT
                </p>

                <h1 className="hero-title">
                    Create groups, assign tasks and track progress together
                </h1>

                <p className="hero-description">
                    MyTask helps users create teams, invite members,
                    organise projects and manage assigned tasks from one
                    simple dashboard.
                </p>

                <div className="hero-buttons">

                    <Link
                        to="/register"
                        className="hero-primary-button"
                    >
                        Create Account
                    </Link>

                    <Link
                        to="/login"
                        className="hero-secondary-button"
                    >
                        Login
                    </Link>

                </div>

            </div>

            <div className="hero-image-card">

                <div className="hero-card-heading">

                    <div>
                        <p>Group</p>
                        <h3>MyTask Development Team</h3>
                    </div>

                    <span>Admin</span>

                </div>

                <div className="hero-card-statistics">

                    <div>
                        <h4>6</h4>
                        <p>Members</p>
                    </div>

                    <div>
                        <h4>3</h4>
                        <p>Projects</p>
                    </div>

                    <div>
                        <h4>12</h4>
                        <p>Tasks</p>
                    </div>

                </div>

                <div className="hero-card-task">

                    <div>
                        <h4>Create dashboard page</h4>
                        <p>Assigned to Shameer</p>
                    </div>

                    <span className="in-progress">
                        In Progress
                    </span>

                </div>

                <div className="hero-card-task">

                    <div>
                        <h4>Connect login API</h4>
                        <p>Assigned to Sahil</p>
                    </div>

                    <span className="completed">
                        Completed
                    </span>

                </div>

            </div>

        </section>
    );
}