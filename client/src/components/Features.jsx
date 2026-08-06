import "../styles/Features.css";

export function Features() {
    return (
        <section
            className="features-section"
            id="features"
        >

            <div className="features-heading">

                <p>FEATURES</p>

                <h2>
                    Everything needed to manage a small team
                </h2>

                <span>
                    Create a group, invite members and manage project work
                    without unnecessary complexity.
                </span>

            </div>

            <div className="features-container">

                <div className="feature-card">

                    <div className="feature-icon">
                        👥
                    </div>

                    <h3>Create Groups</h3>

                    <p>
                        Create your own group and automatically become
                        the administrator of that group.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        ✉️
                    </div>

                    <h3>Invite Members</h3>

                    <p>
                        Invite users through email and allow them to
                        accept or decline the group invitation.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        📁
                    </div>

                    <h3>Manage Projects</h3>

                    <p>
                        Create projects inside a group and organise all
                        related tasks in one place.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        ✅
                    </div>

                    <h3>Assign Tasks</h3>

                    <p>
                        Assign tasks to group members with priority,
                        deadline and progress status.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        📊
                    </div>

                    <h3>Track Progress</h3>

                    <p>
                        View tasks that are pending, in progress or
                        completed from the group dashboard.
                    </p>

                </div>

                <div className="feature-card">

                    <div className="feature-icon">
                        📢
                    </div>

                    <h3>Share Updates</h3>

                    <p>
                        Post announcements and allow members to share
                        progress updates for their assigned tasks.
                    </p>

                </div>

            </div>

        </section>
    );
}