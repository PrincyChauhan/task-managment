# Task Management System

A robust task management system built with **Node.js**, **Express**, and **MongoDB** to handle user and task operations with admin and user privileges.

## Features

- User Authentication and Authorization
- Admin functionalities:
  - Invite users via email
  - Manage users
- Task management:
  - Create, update, delete tasks and subtasks
  - Update task and subtask statuses
  - Set reminders for due dates
- Password management:
  - Forgot and reset password functionality
- API endpoints for efficient task and user operations

## Tech Stack

- **Backend**: Node.js, Express.js
- **Database**: MongoDB
- **Middleware**: Authentication and authorization
- **Email Service**: Nodemailer (for sending user invitations)

## API Endpoints

### Admin Routes

- **POST** `/signup`: Register a new admin.
- **POST** `/signin`: Admin login.
- **POST** `/create-invite`: Create an invitation for a user via email. *(Admin only)*
- **POST** `/accept-invitation`: Accept an invitation and register as a user.
- **GET** `/users`: Get the list of all users. *(Admin only)*
- **POST** `/forgot-password`: Initiate forgot password process.
- **POST** `/reset-password`: Reset the user password.
- **DELETE** `/delete/:userId`: Delete a user. *(Admin only)*
- **POST** `/logout`: Logout the admin.

### Subtask Routes

- **POST** `/subtask/create`: Create a subtask. *(Admin only)*
- **POST** `/subtask/update`: Update a subtask. *(Admin only)*
- **GET** `/subtask/:taskId`: Retrieve subtasks for a task. *(Admin only)*
- **DELETE** `/subtask/delete`: Delete a subtask. *(Admin only)*
- **POST** `/subtask/status`: Update the status of a subtask.

### Task Routes

- **POST** `/create`: Create a new task. *(Admin only)*
- **POST** `/update/:taskId`: Update an existing task. *(Admin only)*
- **DELETE** `/delete/:taskId`: Delete a task. *(Admin only)*
- **GET** `/tasks`: Get all tasks created by the admin. *(Admin only)*
- **GET** `/user/:userId`: Get all tasks assigned to a user.
- **POST** `/status`: Update the status of a task.
- **POST** `/reminder`: Send a reminder for a task's due date.
- **GET** `/:taskId`: Retrieve details of a specific task.

## Getting Started

### Prerequisites

- Node.js (version >= 14)
- MongoDB instance
- **Nodemailer** (used for sending email invitations)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/PrincyChauhan/task-managment.git
   cd task-managment
2. Install dependencies:
```bash
npm install
```
3. Set up the environment variables in a .env file:
```bash
PORT=3000
MONGO_URI=mongodb://localhost:27017/task_management
JWT_SECRET=your_secret_key
EMAIL_HOST=smtp.gmail.com
EMAIL_PORT=587
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-email-password
```
4. Start Server
   
```bash
npm start
```
