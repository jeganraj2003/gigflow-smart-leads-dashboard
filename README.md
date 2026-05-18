# GigFlow – Smart Leads Dashboard

A full-stack Lead Management Dashboard built using the MERN stack (MongoDB, Express, React, Node) with TypeScript.

## 🚀 Features

- **Authentication System**: JWT-based auth with registration, login, and protected routes.
- **Role-Based Access Control (RBAC)**: Admin and Sales User roles with different permissions.
- **Leads Management**: Full CRUD operations for leads.
- **Advanced Filtering & Search**:
  - Filter by Status (New, Contacted, Qualified, Lost).
  - Filter by Source (Website, Instagram, Referral).
  - Debounced Search by Name or Email.
  - Sorting by Latest and Oldest.
- **Pagination**: Backend-driven pagination with 10 records per page.
- **CSV Export**: Export lead data to CSV format.
- **Responsive UI**: Built with TailwindCSS and Lucide React icons.
- **Docker Support**: Containerized for easy deployment.

## 🛠️ Tech Stack

- **Frontend**: React.js, TypeScript, TailwindCSS, React Router, Axios, React Hook Form, Zod.
- **Backend**: Node.js, Express.js, TypeScript, MongoDB, Mongoose, JWT, Bcryptjs.
- **DevOps**: Docker, Docker Compose.

## ⚙️ Setup Instructions

### Prerequisites
- Node.js (v18+)
- MongoDB (local or Atlas)
- Docker (optional, for containerized setup)

### Local Development

1. **Clone the repository**:
   ```bash
   git clone <repository-url>
   cd GigFlow-Smart-Leads-DashBoard
   ```

2. **Server Setup**:
   ```bash
   cd server
   npm install
   # Create .env file based on .env.example
   npm run dev
   ```

3. **Frontend Setup**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

4. **Access the app**:
   Open [http://localhost:5173](http://localhost:5173) in your browser.

### Using Docker

1. **Run with Docker Compose**:
   ```bash
   docker-compose up --build
   ```

2. **Access the app**:
   - Frontend: [http://localhost](http://localhost)
   - Backend API: [http://localhost:5000](http://localhost:5000)

## 📄 API Documentation

### Auth Routes
- `POST /api/users/register`: Register a new user.
- `POST /api/users/login`: Login and get JWT token.

### Lead Routes
- `GET /api/leads`: Get all leads (supports filtering, search, sorting, and pagination).
- `POST /api/leads`: Create a new lead (Protected).
- `GET /api/leads/:id`: Get lead by ID (Protected).
- `PUT /api/leads/:id`: Update a lead (Protected).
- `DELETE /api/leads/:id`: Delete a lead (Admin only).
- `GET /api/leads/export`: Export leads to CSV (Protected).

## 📝 License
MIT
