<div align="center">

# 🌊 Thinkpool — Backend

**REST API powering the Thinkpool developer networking platform.**

[![MongoDB](https://img.shields.io/badge/MongoDB-4EA94B?style=flat-square&logo=mongodb&logoColor=white)](https://mongodb.com)
[![Express](https://img.shields.io/badge/Express-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Node.js](https://img.shields.io/badge/Node.js-339933?style=flat-square&logo=nodedotjs&logoColor=white)](https://nodejs.org)
[![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black)](https://developer.mozilla.org/en-US/docs/Web/JavaScript)
[![Mongoose](https://img.shields.io/badge/Mongoose-880000?style=flat-square&logo=mongoose&logoColor=white)](https://mongoosejs.com)
[![JWT](https://img.shields.io/badge/JWT-000000?style=flat-square&logo=jsonwebtokens&logoColor=white)](https://jwt.io)

[Getting Started](#-getting-started) · [API Reference](#-api-reference)

</div>

---

## What is this?

This is the **backend** of Thinkpool — a developer-first social networking platform that blends swipe-based discovery with professional networking.

> The frontend lives here → [thinkpool-web](https://github.com/Vranda-Kansal/thinkpool-web)

---

## 🛠 Tech Stack

| Technology      | Purpose                   |
| --------------- | ------------------------- |
| Node.js         | Runtime environment       |
| Express.js      | REST API framework        |
| MongoDB         | NoSQL database            |
| Mongoose        | ODM & schema modeling     |
| JSON Web Tokens | Authentication            |
| bcrypt          | Password hashing          |
| Cookie-parser   | HTTP-only cookie sessions |

---

## 🚀 Getting Started

### Prerequisites

- Node.js `v18+`
- MongoDB (local or [Atlas](https://cloud.mongodb.com))
- npm or yarn

### Setup

```bash
git clone https://github.com/Vranda-Kansal/thinkpool.git
cd thinkpool
npm install
```

Create a `.env` file in the root directory:

```env
DB_PASSWORD= your mongoDb cluster password
DB_USERNAME=your mongoDb cluster username
SECRET=youe jwt token secret
FRONTED_URL=http://localhost:5173
```

Start the server:

```bash
npm run dev
```

Server runs at `http://localhost:3000`

---

## 📡 API Reference

### 🔐 Auth — `/auth.js`

| Method | Endpoint  | Description                                            |
| ------ | --------- | ------------------------------------------------------ |
| `POST` | `/login`  | Login with email & password, sets HTTP-only JWT cookie |
| `POST` | `/signup` | Register a new user account                            |

---

### 👤 Profile — `/profile.js`

| Method  | Endpoint        | Description                                            |
| ------- | --------------- | ------------------------------------------------------ |
| `GET`   | `/profile/view` | Get the logged-in user's profile                       |
| `PATCH` | `/profile/edit` | Update profile details (skills, bio, experience, etc.) |

---

### 🤝 Requests — `/requests.js`

| Method | Endpoint                                | Description                                    |
| ------ | --------------------------------------- | ---------------------------------------------- |
| `POST` | `/request/send/:status/:toUserId`       | Send a connection request to another developer |
| `POST` | `/request/review/:status/:connectionId` | Accept or reject a received connection request |

**`/request/send/:status/:toUserId`**

- `:status` — `interested` or `ignored`
- Sends a connection request to the target user or passes their profile

**`/request/review/:status/:connectionId`**

- `:status` — `accepted` or `rejected`
- Reviews a single incoming request and accepts or rejects it

---

### 👥 Users — `/users.js`

| Method | Endpoint                  | Description                                  |
| ------ | ------------------------- | -------------------------------------------- |
| `GET`  | `/user/feed`              | Get developer profiles to browse             |
| `GET`  | `/user/connections`       | Get all accepted connections                 |
| `GET`  | `/user/received/requests` | Get all pending incoming connection requests |

**`/user/feed` filters out:**

- The logged-in user themselves
- Users already sent a request to
- Users who were ignored/passed
- Users who have already sent the logged-in user a request
- Users who accepted or rejected the logged-in user

---

### 💬 Chat — `/chat.js`

| Method | Endpoint             | Description                                                             |
| ------ | -------------------- | ----------------------------------------------------------------------- |
| `GET`  | `/getchat/:toUserId` | Fetch the chat history between the logged-in user and another developer |

---

## 👨‍💻 Author

**Vranda** — Full Stack Developer

[![LinkedIn](https://img.shields.io/badge/LinkedIn-0077B5?style=flat-square&logo=linkedin&logoColor=white)](https://www.linkedin.com/in/vranda-kansal-824842203/)
[![GitHub](https://img.shields.io/badge/GitHub-100000?style=flat-square&logo=github&logoColor=white)](https://github.com/Vranda-Kansal)
