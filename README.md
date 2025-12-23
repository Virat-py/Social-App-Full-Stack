# Full Stack Social App

## Technologies Used

- **Backend:** FastAPI (Python)
- **Frontend:** Next.js (App Router, TypeScript)
- **Database:** SQLite
- **Auth:** JWT (JSON Web Tokens)
- **UI:** Tailwind CSS + shadcn/ui
- **Token Storage:** localStorage

---

## Overview

This project is a full-stack application with authentication and post management.

The backend exposes a REST API secured with JWTs.  
The frontend consumes the API using `fetch`, stores the token in `localStorage`, and handles redirects on unauthorized access.

---

## Backend Design

- JWT-based authentication
- Short-lived access tokens (15 minutes)
- Passwords stored **only after hashing**
- Authorization enforced server-side

---

## Frontend Design

- Built with Next.js App Router
- JWT stored in `localStorage`
- Token attached as `Authorization: Bearer <token>`
- Automatic redirect to `/login` on `401`

---

## API Endpoints

### Authentication
- `POST /register`
- `POST /login`

### Posts
- `GET /posts`
- `POST /create_post`
- `DELETE /delete_post/{post_id}`

All protected routes require a valid JWT.

---

## Authorization Rules

- Only the post author can delete a post
- Enforced server-side
- Frontend mirrors checks for better UX
