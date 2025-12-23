# Full Stack Social App

## Technologies Used

- **Backend:** FastAPI (Python)
- **Frontend:** Next.js (App Router, TypeScript)
- **Database:** SQLite
- **Auth:** JWT (JSON Web Tokens)
- **UI:** Tailwind CSS + shadcn/ui
- **Token Storage:** localStorage

---

## User Interface

![image alt](https://github.com/Virat-py/Social-App-Full-Stack/blob/79a1d7fc46dc5cd6afcf495dd352ca722d81c837/ui.png)

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
