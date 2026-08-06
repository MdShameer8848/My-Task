
CREATE DATABASE my_task;
USE my_task;

CREATE TABLE user(
user_id INT PRIMARY KEY AUTO_INCREMENT,
name VARCHAR(100) NOT NULL,
email VARCHAR(100) UNIQUE NOT NULL,
password VARCHAR(100) NOT NULL

);

CREATE TABLE task_groups(
group_id INT PRIMARY KEY AUTO_INCREMENT,
group_name VARCHAR(100) NOT NULL,
group_description VARCHAR(100) NOT NULL,
created_by INT NOT NULL,
FOREIGN KEY(created_by)
REFERENCES user(user_id)
);

CREATE TABLE group_members (
    group_member_id INT PRIMARY KEY AUTO_INCREMENT,

    group_id INT NOT NULL,

    user_id INT NOT NULL,

    role ENUM('Admin', 'Member')
    DEFAULT 'Member',

    FOREIGN KEY (group_id)
    REFERENCES task_groups(group_id),

    FOREIGN KEY (user_id)
    REFERENCES user(user_id)
);

USE my_task;

CREATE TABLE group_invitations (
    invitation_id INT PRIMARY KEY AUTO_INCREMENT,

    group_id INT NOT NULL,
    invited_user_id INT NOT NULL,
    invited_by INT NOT NULL,

    status ENUM(
        'Pending',
        'Accepted',
        'Rejected'
    ) DEFAULT 'Pending',

    FOREIGN KEY (group_id)
    REFERENCES task_groups(group_id)
    ON DELETE CASCADE,

    FOREIGN KEY (invited_user_id)
    REFERENCES user(user_id)
    ON DELETE CASCADE,

    FOREIGN KEY (invited_by)
    REFERENCES user(user_id)
    ON DELETE CASCADE,

    UNIQUE (group_id, invited_user_id)
);

CREATE TABLE tasks (
  task_id INT PRIMARY KEY AUTO_INCREMENT,

  group_id INT NOT NULL,

  title VARCHAR(150) NOT NULL,

  description VARCHAR(500),

  assigned_to INT NOT NULL,

  created_by INT NOT NULL,

  due_date DATE,

  status ENUM(
    'Pending',
    'In Progress',
    'Completed'
  ) DEFAULT 'Pending',

  FOREIGN KEY (group_id)
  REFERENCES task_groups(group_id)
  ON DELETE CASCADE,

  FOREIGN KEY (assigned_to)
  REFERENCES user(user_id)
  ON DELETE CASCADE,

  FOREIGN KEY (created_by)
  REFERENCES user(user_id)
  ON DELETE CASCADE
);

SELECT *
FROM user;
DROP TABLE task_groups;

