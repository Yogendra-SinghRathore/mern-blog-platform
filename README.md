# Mindful Pages — MERN Blog Platform

A production-style full-stack blogging platform built to go deep on backend architecture — secure auth, scalable API design, and clean error handling — beyond typical tutorial-level implementations.

🔗 **[Live Demo](#)** &nbsp;|&nbsp; **[GitHub](https://github.com/Yogendra-SinghRathore/mern-blog-platform)**

---

## Tech Stack

`MongoDB` `Express.js` `React.js` `Node.js` `JWT` `Cloudinary` `Multer` `Axios` `Bootstrap`

---

## Key Features

### 🔐 Advanced Authentication
- Secure JWT authentication with **refresh token rotation** and DB-backed revocation
- HTTP-only cookies to prevent XSS token theft
- Email verification and password reset flow with SHA-256 hashed reset tokens
- Rate limiting on sensitive auth routes

### 🏗️ Backend Architecture
- RESTful APIs following a Controller-Service pattern for clean separation of concerns
- Full CRUD operations with pagination, search, sorting, and filtering
- Centralized error handling middleware
- Parallelized DB queries (`Promise.all`) for performance — e.g. fetching paginated posts and total count concurrently

### 🖼️ Integrations
- Cloudinary + Multer for image uploads, with cleanup on delete/update
- Axios interceptor for silent token refresh on 401s, with request deduplication via a shared refresh promise
- Context API + Protected Routes on the frontend for auth-aware navigation

---

## What I Learned

This project was built specifically to strengthen backend skills beyond frontend work — real auth flows, secure token handling, and API design decisions that don't show up in short tutorials. Debugging real issues (like silent token refresh race conditions) taught me more about async JS and request lifecycle than any course did.

---

## Setup

```bash
git clone https://github.com/Yogendra-SinghRathore/mern-blog-platform.git
cd mern-blog-platform

# Backend
cd backend
npm install
npm run dev

# Frontend
cd frontend
npm install
npm run dev
```
