# URL Shortener (Full-Stack)

A modern, fast, and lightweight full-stack URL shortening service built with **Node.js**, **Express 5**, **MongoDB (Mongoose 9)**, and **React 19 (Vite)**.

Shorten lengthy URLs into clean 6-character links, redirect instantly, and track total click counts with atomic updates.

---

## Features

- **Unique 6-Character Codes**: Automatically generates random, collision-safe 6-character alphanumeric slugs (`[a-zA-Z0-9]`).
- **Atomic Click Tracking**: Uses MongoDB's native `$inc` operator to increment visits safely without race conditions.
- **Dual Redirection Routes**:
    - **Clean Short Links**: `http://localhost:3000/:shortCode` (direct root redirect for sharing).
    - **API Route**: `http://localhost:3000/api/url/redirect/:shortCode`.
- **Flexible Identifier Lookup**: Endpoints accept either a 24-character MongoDB `_id` or the 6-character `shortUrl` without throwing CastErrors.
- **Input Validation & Safety**:
    - Requires URLs to start with `http://` or `https://`.
    - Enforces URL length bounds (max 2048 characters).
    - Filters out browser `favicon.ico` queries during redirection.
- **Developer-Friendly Stack**:
    - React 19 frontend with Vite, Axios proxying, and Context API.
    - Express 5 with Morgan logging and ES Modules throughout.
    - Unified root formatting and linting via Prettier and ESLint.

---

## Tech Stack

| Layer            | Technologies                             |
| :--------------- | :--------------------------------------- |
| **Backend**      | Node.js (ESM), Express 5, Morgan, Dotenv |
| **Database**     | MongoDB, Mongoose 9                      |
| **Frontend**     | React 19, Vite, Axios                    |
| **Code Quality** | Prettier 3, ESLint 9, Stylelint          |

---

## Project Structure

```text
url-shortner/
├── client/                          # React + Vite Frontend
│   ├── src/
│   │   ├── app/
│   │   │   └── features/
│   │   │       └── url/
│   │   │           ├── context/     # React Context & hooks (UrlContext)
│   │   │           └── services/    # Axios API layer (url.api.js)
│   │   ├── App.jsx
│   │   └── main.jsx
│   ├── vite.config.js               # Dev server with /api proxy to backend
│   └── package.json
│
├── server/                          # Express 5 Backend
│   ├── src/
│   │   ├── config/
│   │   │   ├── db.js                # MongoDB connection handler
│   │   │   └── env.config.js        # Environment variables loader
│   │   ├── models/
│   │   │   └── url.model.js         # Mongoose URL schema with unique index
│   │   ├── modules/
│   │   │   └── url/
│   │   │       ├── controllers/     # Route logic (shorten, redirect, CRUD)
│   │   │       └── routes/          # Express router (/api/url)
│   │   ├── utils/
│   │   │   └── generateCode.js      # 6-character alphanumeric slug generator
│   │   └── app.js                   # Express app setup & middleware
│   ├── server.js                    # Server startup script
│   └── package.json
│
├── .prettierrc                      # Prettier formatting configuration
├── .prettierignore                  # Prettier ignore patterns
├── package.json                     # Root scripts for formatting & linting
└── README.md
```

---

## Getting Started

### Prerequisites

Ensure you have the following installed on your machine:

- [Node.js](https://nodejs.org/) (v18 or higher recommended; v22+ tested)
- [npm](https://www.npmjs.com/)
- [MongoDB](https://www.mongodb.com/) (local instance or MongoDB Atlas connection string)

---

### 1. Environment Setup

Inside the `server/` directory, create a `.env` file:

```env
# MongoDB Connection String (Atlas or Local)
DATABASE_URL=mongodb+srv://<username>:<password>@cluster.mongodb.net/url-shortener?retryWrites=true&w=majority

# Port for the Express server (default: 3000)
PORT=3000

# Base URL used to construct the full short link
SERVER_URL=http://localhost:3000

# Environment mode
NODE_ENV=development
```

---

### 2. Backend Setup (Server)

Navigate to the `server/` folder and install dependencies:

```bash
cd server
npm install
```

Start the backend server in development mode (with Nodemon):

```bash
npm run dev
```

The backend server will run on `http://localhost:3000`.

---

### 3. Frontend Setup (Client)

In a new terminal window, navigate to the `client/` folder and install dependencies:

```bash
cd client
npm install
```

Start the Vite development server:

```bash
npm run dev
```

The frontend will run on `http://localhost:5173`. Vite is configured with a proxy to forward all `/api` requests directly to `http://localhost:3000`.

---

## 📡 API Reference

Base URL: `http://localhost:3000`

### 1. Health & Discovery

#### `GET /`

Returns service status and a sitemap of all available endpoints.

**Response (200 OK):**

```json
{
    "message": "URL Shortener API is running",
    "endpoints": {
        "shorten": "POST /api/url",
        "getAll": "GET /api/url",
        "getByIdOrCode": "GET /api/url/:id",
        "delete": "DELETE /api/url/:id",
        "redirectApi": "GET /api/url/redirect/:shortCode",
        "redirectRoot": "GET /:shortCode"
    }
}
```

---

### 2. Create Shortened URL

#### `POST /api/url`

**Request Body:**

```json
{
    "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
}
```

**Response (201 Created):**

```json
{
    "message": "shorten url created successfully",
    "data": {
        "id": "6724a1f3c5d8a9e71b2f4a12",
        "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        "shortUrl": "aB3eZ1",
        "fullShortUrl": "http://localhost:3000/aB3eZ1",
        "clicks": 0,
        "createdAt": "2026-10-02T10:00:00.000Z"
    }
}
```

---

### 3. Redirect to Original URL

#### `GET /:shortCode` or `GET /api/url/redirect/:shortCode`

- Increments the `clicks` counter atomically (`+1`).
- Responds with an **HTTP 302** redirect to the original destination URL.
- Returns **404 Not Found** if the code does not exist.

---

### 4. Get All Shortened URLs

#### `GET /api/url`

Fetches all stored URLs, sorted by newest first.

**Response (200 OK):**

```json
{
    "message": "URLs fetched successfully",
    "data": {
        "urls": [
            {
                "_id": "6724a1f3c5d8a9e71b2f4a12",
                "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
                "shortUrl": "aB3eZ1",
                "clicks": 5,
                "createdAt": "2026-10-02T10:00:00.000Z",
                "updatedAt": "2026-10-02T10:15:00.000Z"
            }
        ]
    }
}
```

---

### 5. Get URL Details by ID or Short Code

#### `GET /api/url/:id`

Accepts either the MongoDB ObjectId (e.g. `6724a1f...`) or the short code (e.g. `aB3eZ1`).

**Response (200 OK):**

```json
{
    "message": "url fetched successfully",
    "data": {
        "url": {
            "_id": "6724a1f3c5d8a9e71b2f4a12",
            "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            "shortUrl": "aB3eZ1",
            "clicks": 5,
            "createdAt": "2026-10-02T10:00:00.000Z"
        }
    }
}
```

---

### 6. Delete a URL

#### `DELETE /api/url/:id`

Accepts either the MongoDB ObjectId or the short code.

**Response (200 OK):**

```json
{
    "message": "Url deleted successfully"
}
```

---

## Code Quality & Formatting

The root repository includes shared configuration for code consistency:

```bash
# Format all supported files across client & server
npm run format

# Check formatting without modifying files
npm run format:check
```

Configured in [.prettierrc](file:///.prettierrc) with tab width 4, single quotes, trailing commas, and semicolons.

---
