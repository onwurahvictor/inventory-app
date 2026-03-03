# Inventory Management System

A full-stack inventory management application built with the MERN stack (MongoDB, Express.js, React, Node.js).

## Features
- 📦 Item management (CRUD operations)
- 📂 Category management
- 📊 Dashboard with statistics
- 🔔 Low stock alerts via email
- 👥 User authentication & authorization
- 📱 Responsive design

## Tech Stack
- **Frontend**: React, React Router, Axios, CSS3
- **Backend**: Node.js, Express.js, MongoDB, Mongoose
- **Email**: Nodemailer (Gmail SMTP)
- **Authentication**: JWT, Bcrypt

## Installation

### Prerequisites
- Node.js (v14 or higher)
- MongoDB
- Git

### Backend Setup
```bash
cd backend
npm install
cp .env.example .env
# Edit .env with your values
npm run dev
