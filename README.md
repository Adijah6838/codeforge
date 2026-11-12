# CodeForge Studio — Problem Setter & Test Case Management

A professional programming problem authoring and validation platform inspired by the internal workflows of competitive programming platforms. CodeForge allows problem setters to create algorithmic challenges, manage test cases, validate reference solutions, organize problem versions, and submit challenges for approval.

## 🚀 Tech Stack

| Layer | Technology |
|-------|------------|
| **Frontend** | React, TypeScript, Tailwind CSS, Monaco Editor, Recharts |
| **Backend** | Node.js, Express.js, TypeScript |
| **Database** | PostgreSQL, Prisma ORM |
| **Security** | JWT Authentication, Role-Based Access Control (RBAC), bcrypt |
| **Evaluation** | Isolated execution engine for reference solutions |
| **DevOps** | Docker, Nginx |

## 🛠️ Quick Start (Docker)

The entire platform is containerized. You can run it with a single command.

1. Ensure **Docker Desktop** is running.
2. Clone the repository and navigate to the root directory.
3. Build and start the containers:
   ```bash
   docker-compose up --build -d