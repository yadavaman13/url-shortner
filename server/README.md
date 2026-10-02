# Shortly Server API

Production-ready, modular REST API and redirection service for the **Shortly** URL Shortener, engineered with **Node.js**, **Express 5**, and **MongoDB (Mongoose 9)**.

---

## Architecture Overview

The backend uses an ES Module (ESM) architecture with a layered design separating configuration, database models, request validation, rate limiting, and business controllers.

```
                      ┌─────────────────────────────────────────┐
                      │             Incoming Request            │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │    Global Middleware (JSON, Morgan)     │
                      └────────────────────┬────────────────────┘
                                           │
                                           ▼
                      ┌─────────────────────────────────────────┐
                      │  Global Rate Limiter (200 req / 15 min) │
                      └────────────────────┬────────────────────┘
                                           │
                        ┌──────────────────┴──────────────────┐
                        ▼                                     ▼
             [ /api/url Route Group ]                 [ Root Redirection ]
                        │                                     │
           ┌────────────┴────────────┐                        ▼
           ▼                         ▼                 GET /:shortCode
    Route Limiter             express-validator               │
   (e.g., 10 req/min)        (Schema & Sanitization)          ▼
           │                         │                  Atomic $inc &
           └────────────┬────────────┘                  302 Redirect
                        │
                        ▼
                Controller Actions
         (create, list, getById, delete)
                        │
                        ▼
                 Mongoose Model
                 (MongoDB Atlas)
```

---

## Tech Stack & Dependencies

### Core Framework & Runtime

- **[Node.js](https://nodejs.org/)** (v18+) – High-performance JavaScript runtime with native ES Modules (`"type": "module"`).
- **[Express 5](https://expressjs.com/)** (`v5.2.1`) – Next-generation web framework featuring native Promise/async-await error propagation, modernized routing, and lean middleware execution.

### Database & ODM

- **[MongoDB](https://www.mongodb.com/)** – Distributed NoSQL document database.
- **[Mongoose 9](https://mongoosejs.com/)** (`v9.10.2`) – Object Data Modeling (ODM) library with schema validation, strict typing, and unique indexing.

### Security, Validation & Traffic Control

- **[express-rate-limit](https://github.com/express-rate-limit/express-rate-limit)** (`v8.7.0`) – Tiered IP-based rate limiting adhering to IETF Draft-7 RateLimit headers (`RateLimit-Limit`, `RateLimit-Remaining`, `RateLimit-Reset`).
- **[express-validator](https://express-validator.github.io/)** (`v7.3.2`) – Schema-based request body and parameter validation with sanitized output and 422 Unprocessable Entity formatting.
- **[cors](https://github.com/expressjs/cors)** (`v2.8.6`) – Cross-Origin Resource Sharing control.

### Observability & Tooling

- **[morgan](https://github.com/expressjs/morgan)** (`v1.12.1`) – Standard Apache `combined` format HTTP access logger.
- **[dotenv](https://github.com/motdotla/dotenv)** (`v18.0.4`) – Runtime environment configuration loader with startup assertion checks.
- **nodemon** – Hot-reloading development monitor.

---

## Directory Structure

```text
server/
├── src/
│   ├── config/
│   │   ├── db.js                     # MongoDB connection bootstrap & event logging
│   │   └── env.config.js             # Environment variable validation & centralized export
│   │
│   ├── middleware/
│   │   ├── rateLimit.middleware.js   # Tiered rate limiters (global, creation, redirect)
│   │   └── validate.middleware.js    # express-validator chains & 422 error formatter
│   │
│   ├── models/
│   │   └── url.model.js              # Mongoose schema with unique indexes & timestamps
│   │
│   ├── modules/
│   │   └── url/
│   │       ├── controllers/
│   │       │   └── url.controller.js # Endpoint logic (shorten, redirect, query, delete)
│   │       └── routes/
│   │           └── url.routes.js     # Modular router with attached validators & limiters
│   │
│   ├── utils/
│   │   └── generateCode.js           # 6-character Base62 alphanumeric slug generator
│   │
│   └── app.js                        # Express application factory & middleware composition
│
├── .env                              # Environment secrets (git-ignored)
├── package.json                      # Dependencies and lifecycle scripts
├── README.md                         # Server documentation
└── server.js                         # Application entrypoint & HTTP listener
```

---

## Implemented Features

### 1. Collision-Resistant 6-Character Slug Generation

- Generates random 6-character Base62 alphanumeric strings (`[a-zA-Z0-9]`), yielding $62^6 \approx 56.8\text{ billion}$ distinct combinations.
- Uses an active collision verification loop against MongoDB with a maximum retry ceiling (5 attempts) before failing safely.

### 2. High-Performance Atomic Redirection

- **Dual Redirection Routes**:
    - `GET /:shortCode` (Root-level clean short link for direct user navigation).
    - `GET /api/url/redirect/:shortCode` (API-namespaced redirect).
- **Atomic Click Tracking**: Uses MongoDB's `$inc: { clicks: 1 }` via `findOneAndUpdate`, eliminating concurrency race conditions and separate read-write overhead.
- **Favicon Query Bypass**: Explicitly intercepts and suppresses `GET /favicon.ico` browser prefetch requests (`204 No Content`) so analytics counts remain pristine.

### 3. Dual-Identifier Lookup (ObjectId & Short Code)

- Endpoints supporting lookup and deletion (`GET /api/url/:id` and `DELETE /api/url/:id`) accept **either**:
    - A 24-character hexadecimal MongoDB `ObjectId`.
    - The 6-character alphanumeric `shortUrl` slug.
- Protects against Mongoose `CastError` exceptions by evaluating `mongoose.Types.ObjectId.isValid(id)` prior to querying.

### 4. Multi-Layer Rate Limiting

Configured using IETF Draft-7 headers to prevent denial-of-service and brute-force abuse:

- **Global Limiter**: 200 requests per 15-minute window per IP across all routes.
- **Creation Limiter**: 10 requests per 1-minute window per IP on `POST /api/url`.
- **Redirect Limiter**: 60 requests per 1-minute window per IP on `GET /api/url/redirect/:shortCode`.

### 5. Strict Request Validation & Sanitization

Implemented via `express-validator` middleware chains:

- **URL Validation**: Requires strict `http://` or `https://` protocol prefix, valid URL URI syntax, and max 2048-character length.
- **Alias Validation**: Supports custom slugs (4–20 alphanumeric characters and hyphens `^[a-zA-Z0-9-]+$`).
- **Expiration Bounds**: Validates optional link expiration (1 to 8,760 hours / 1 year) with integer casting.
- **Standardized Error Envelope**: Returns `422 Unprocessable Entity` containing an array of field-specific validation messages.

### 6. Health Check & Route Discovery

- Root route `GET /` returns an instant service health ping (`200 OK`) and status confirmation.

---

## Database Schema (`urls`)

The Mongoose model defined in `src/models/url.model.js` persists shortened link documents:

```javascript
{
  originalUrl: {
    type: String,
    required: true,
    trim: true
  },
  shortUrl: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    index: true
  },
  clicks: {
    type: Number,
    default: 0
  },
  createdAt: ISODate, // Automatic via timestamps: true
  updatedAt: ISODate  // Automatic via timestamps: true
}
```

---

## Environment Configuration

Configuration is managed centrally in `src/config/env.config.js`. Create a `.env` file in the `server/` root:

| Variable       | Type   | Required | Default                 | Description                                                                                     |
| :------------- | :----- | :------: | :---------------------- | :---------------------------------------------------------------------------------------------- |
| `DATABASE_URL` | String | **Yes**  | —                       | MongoDB connection string (Atlas or local `mongodb://...`). Throws error on startup if missing. |
| `SERVER_PORT`  | Number |    No    | `3000`                  | HTTP port on which the Express server listens.                                                  |
| `SERVER_URL`   | String |    No    | `http://localhost:3000` | Fully qualified base domain used to construct `fullShortUrl` links in responses.                |
| `NODE_ENV`     | String |    No    | `development`           | Environment mode (`development` or `production`).                                               |

---

## API Reference

Base URL: `http://localhost:3000`

### 1. Service Health

```http
GET /
```

#### Response `200 OK`

```json
{
    "message": "URL Shortener API is running"
}
```

---

### 2. Create Shortened URL

```http
POST /api/url
Content-Type: application/json
Rate Limit: 10 requests / 1 minute
```

#### Request Body

```json
{
    "url": "https://developer.mozilla.org/en-US/docs/Web/JavaScript"
}
```

#### Response `201 Created`

```json
{
    "message": "shorten url created successfully",
    "data": {
        "id": "6724a1f3c5d8a9e71b2f4a12",
        "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
        "shortUrl": "k9xL2p",
        "fullShortUrl": "http://localhost:3000/k9xL2p",
        "clicks": 0,
        "createdAt": "2026-10-02T10:00:00.000Z"
    }
}
```

#### Validation Error Response `422 Unprocessable Entity`

```json
{
    "error": "Validation failed",
    "details": [
        {
            "field": "url",
            "message": "url must start with http:// or https:// and be a valid URL"
        }
    ]
}
```

---

### 3. Redirect to Original Destination

```http
GET /:shortCode
GET /api/url/redirect/:shortCode
Rate Limit: 60 requests / 1 minute
```

#### Behavior

- Atomically increments `clicks` count by `1`.
- Responds with an **HTTP 302 Found** redirect pointing to `originalUrl`.
- Returns **404 Not Found** if the short code is nonexistent.
- Suppresses `favicon.ico` queries with **204 No Content**.

---

### 4. Get All Shortened URLs

```http
GET /api/url
```

#### Response `200 OK`

```json
{
    "message": "URLs fetched successfully",
    "data": {
        "urls": [
            {
                "_id": "6724a1f3c5d8a9e71b2f4a12",
                "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
                "shortUrl": "k9xL2p",
                "clicks": 14,
                "createdAt": "2026-10-02T10:00:00.000Z",
                "updatedAt": "2026-10-02T10:45:00.000Z"
            }
        ]
    }
}
```

---

### 5. Get URL Details by ID or Short Code

```http
GET /api/url/:id
```

_(Accepts either MongoDB `_id` or 6-character `shortUrl` slug)_

#### Response `200 OK`

```json
{
    "message": "url fetched successfully",
    "data": {
        "url": {
            "_id": "6724a1f3c5d8a9e71b2f4a12",
            "originalUrl": "https://developer.mozilla.org/en-US/docs/Web/JavaScript",
            "shortUrl": "k9xL2p",
            "clicks": 14,
            "createdAt": "2026-10-02T10:00:00.000Z",
            "updatedAt": "2026-10-02T10:45:00.000Z"
        }
    }
}
```

#### Response `404 Not Found`

```json
{
    "error": "No url exists with this Id or short code"
}
```

---

### 6. Delete URL by ID or Short Code

```http
DELETE /api/url/:id
```

_(Accepts either MongoDB `_id` or 6-character `shortUrl` slug)_

#### Response `200 OK`

```json
{
    "message": "Url deleted successfully"
}
```

#### Response `404 Not Found`

```json
{
    "error": "No url exists with this id"
}
```

---

## HTTP Status Codes

| Status Code                 | Description                 | Usage                                                              |
| :-------------------------- | :-------------------------- | :----------------------------------------------------------------- |
| `200 OK`                    | Request succeeded           | `GET /`, `GET /api/url`, `GET /api/url/:id`, `DELETE /api/url/:id` |
| `201 Created`               | Resource created            | `POST /api/url`                                                    |
| `204 No Content`            | No response body            | Intercepted browser `GET /favicon.ico`                             |
| `302 Found`                 | URL redirection             | Successful short code redirection                                  |
| `400 Bad Request`           | Client request syntax error | Missing payload or parameter                                       |
| `404 Not Found`             | Resource does not exist     | Short code or URL ID not found in database                         |
| `422 Unprocessable Entity`  | Validation error            | Input violates validation schema (`express-validator`)             |
| `429 Too Many Requests`     | Rate limit exceeded         | IP exceeded permitted requests per window                          |
| `500 Internal Server Error` | Unhandled server exception  | Database or internal runtime error                                 |

---

## Local Development & Scripts

### Installation

```bash
cd server
npm install
```

### Run in Development (Live Reload via Nodemon)

```bash
npm run dev
```

### Run in Production

```bash
npm start
```
