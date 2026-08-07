# My Task

My Task is a full-stack task management web application designed for students and small teams to organise group work, manage members, and assign tasks.

The project was developed to demonstrate full-stack application development using React, Node.js, Express.js, and MySQL.

## Features

- User registration and login
- Create and delete groups
- Invite registered users to groups by email
- Accept or reject group invitations
- Admin and Member roles
- View group members
- Admin can remove members
- Admin can create tasks
- Assign tasks to specific group members
- Members can view their assigned tasks
- Admin can delete tasks
- Dashboard showing groups and task information

## Tech Stack

### Frontend
- React
- React Router
- JavaScript
- CSS
- Fetch API

### Backend
- Node.js
- Express.js
- REST APIs

### Database
- MySQL

### Development Tools
- Git
- GitHub
- Visual Studio Code

## Project Structure

```text
My-Task/
│
├── client/
│   ├── src/
│   │   ├── components/
│   │   ├── dashboard/
│   │   ├── pages/
│   │   └── styles/
│   └── package.json
│
├── server/
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── groupsController.js
│   │   ├── invitationsController.js
│   │   ├── membersController.js
│   │   └── tasksController.js
│   │
│   ├── database/
│   │   ├── db.js
│   │   ├── setup.sql
│   │   └── queries.sql
│   │
│   ├── server.js
│   └── package.json
│
└── README.md
```

## How the Application Works

The React frontend communicates with the Node.js and Express backend using REST API requests.

```text
React Frontend
      ↓
REST API
      ↓
Node.js + Express
      ↓
Controllers
      ↓
MySQL Database
```

The backend processes requests, communicates with MySQL, and returns JSON responses to the frontend.

## Group Workflow

```text
User creates a group
        ↓
User becomes Admin
        ↓
Admin invites another registered user
        ↓
User receives invitation
        ↓
User accepts invitation
        ↓
User becomes a Member
        ↓
Admin creates and assigns a task
        ↓
Member sees the assigned task
```

## Role-Based Functionality

### Admin

Admins can:

- Create groups
- Invite members
- Remove members
- Create tasks
- Assign tasks
- Delete tasks

### Member

Members can:

- Join groups through invitations
- View group information
- View group members
- View tasks assigned to them

## Database

The application uses relational MySQL tables for:

- Users
- Groups
- Group members
- Group invitations
- Tasks

Foreign keys are used to maintain relationships between the application's data.

## Future Improvements

Possible future improvements include:

- Password hashing
- JWT authentication
- Stronger server-side authorization
- Task status updates
- Notifications
- Search and filtering
- Automated testing
- Cloud deployment

## Author

**Mohammad Shameer**

BSc Computer Science  
Ravensbourne University London
