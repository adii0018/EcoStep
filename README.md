# 🌱 EcoStep Backend

A RESTful API for **EcoStep** — a personal carbon footprint tracker that lets users log daily activities, calculate CO₂ emissions, view analytics, and receive AI-generated sustainability tips powered by Anthropic Claude.

---

## Tech Stack

| Layer | Technology |
|---|---|
| Runtime | Node.js |
| Framework | Express.js |
| Database | MongoDB (via Mongoose) |
| Auth | JWT + bcryptjs |
| AI | Anthropic Claude (`claude-sonnet-4-20250514`) |
| Security | helmet, cors |
| Validation | express-validator |

---

## Project Structure

```
ecostep-backend/
├── server.js                 # Entry point
├── .env.example              # Environment variable template
├── package.json
├── config/
│   └── db.js                 # Mongoose connection
├── lib/
│   └── carbonFactors.js      # Emission constants + calculator
├── models/
│   ├── User.js
│   └── Activity.js
├── middleware/
│   └── auth.js               # JWT verification
├── routes/
│   ├── auth.js
│   ├── activities.js
│   └── insights.js
└── controllers/
    ├── authController.js
    ├── activityController.js
    └── insightController.js
```

---

## Setup

### 1. Clone & Install

```bash
git clone <repo-url>
cd ecostep-backend
npm install
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` and fill in the required values:

```env
PORT=5000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ecostep?retryWrites=true&w=majority
JWT_SECRET=replace_with_a_long_random_string
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-api03-...
CLIENT_URL=http://localhost:3000
```

### 3. Run

```bash
# Development (auto-restart on file changes)
npm run dev

# Production
npm start
```

You should see:
```
MongoDB connected: cluster0.xxxxx.mongodb.net
Server running on port 5000
```

---

## How to Get Credentials

### MongoDB Atlas URI

1. Go to [https://cloud.mongodb.com](https://cloud.mongodb.com) and create a free account.
2. Create a new **Cluster** (free M0 tier works).
3. Go to **Database Access** → Add a new database user with a username and password.
4. Go to **Network Access** → Add IP `0.0.0.0/0` (or your server IP).
5. Click **Connect** on your cluster → **Connect your application**.
6. Copy the connection string and replace `<username>` and `<password>`.

### Anthropic API Key

1. Go to [https://console.anthropic.com](https://console.anthropic.com) and sign up.
2. Navigate to **API Keys** → Create a new key.
3. Copy the key starting with `sk-ant-api03-...` and paste it as `ANTHROPIC_API_KEY`.

---

## API Reference

Base URL: `http://localhost:5000`

All protected routes require the header:
```
Authorization: Bearer <jwt_token>
```

---

### Health Check

#### `GET /health`

```json
// Response 200
{
  "status": "ok",
  "timestamp": "2025-06-09T06:00:00.000Z"
}
```

---

### Auth — `/api/auth`

#### `POST /api/auth/register`

**Request body:**
```json
{
  "name": "Aditya Sharma",
  "email": "aditya@example.com",
  "password": "securepass123"
}
```

**Response 201:**
```json
{
  "message": "Account created successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "Aditya Sharma",
    "email": "aditya@example.com",
    "createdAt": "2025-06-09T06:00:00.000Z"
  }
}
```

---

#### `POST /api/auth/login`

**Request body:**
```json
{
  "email": "aditya@example.com",
  "password": "securepass123"
}
```

**Response 200:**
```json
{
  "message": "Logged in successfully.",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "664f1a2b3c4d5e6f7a8b9c0d",
    "name": "Aditya Sharma",
    "email": "aditya@example.com",
    "createdAt": "2025-06-09T06:00:00.000Z"
  }
}
```

---

### Activities — `/api/activities` 🔒

#### `POST /api/activities`

Logs a new activity. CO₂ is calculated automatically.

**Request body:**
```json
{
  "category": "travel",
  "type": "Car (petrol)",
  "quantity": 25
}
```

**Response 201:**
```json
{
  "message": "Activity logged successfully.",
  "activity": {
    "_id": "664f1a2b3c4d5e6f7a8b9c01",
    "userId": "664f1a2b3c4d5e6f7a8b9c0d",
    "category": "travel",
    "type": "Car (petrol)",
    "quantity": 25,
    "co2": 4.5,
    "date": "2025-06-09T06:00:00.000Z"
  }
}
```

Valid `category` → `type` combinations:

| Category | Types |
|---|---|
| `travel` | `Car (petrol)`, `Car (diesel)`, `Bike/scooter`, `Bus`, `Metro/train`, `Flight (domestic)` |
| `food` | `Beef meal`, `Chicken meal`, `Fish meal`, `Vegetarian meal`, `Vegan meal` |
| `energy` | `Home electricity`, `LPG cooking`, `AC usage (hr)` |
| `shopping` | `New clothing`, `Electronics`, `Groceries` |

---

#### `GET /api/activities`

Returns up to 100 activities for the logged-in user, sorted newest first.

**Response 200:**
```json
{
  "count": 2,
  "activities": [
    {
      "_id": "664f1a2b3c4d5e6f7a8b9c01",
      "userId": "664f1a2b3c4d5e6f7a8b9c0d",
      "category": "travel",
      "type": "Car (petrol)",
      "quantity": 25,
      "co2": 4.5,
      "date": "2025-06-09T06:00:00.000Z"
    }
  ]
}
```

---

#### `GET /api/activities/summary`

Returns aggregate analytics for the current user.

**Response 200:**
```json
{
  "totalCo2ThisWeek": 12.4,
  "totalCo2ThisMonth": 47.2,
  "breakdown": {
    "travel": 20.0,
    "food": 18.2,
    "energy": 6.5,
    "shopping": 2.5
  },
  "savedVsAverage": 45.8
}
```

> `savedVsAverage` = India monthly average (93 kg) − your monthly total. Positive = you emitted less than average. Negative = you emitted more.

---

#### `DELETE /api/activities/:id`

Deletes an activity belonging to the authenticated user.

**Response 200:**
```json
{
  "message": "Activity deleted successfully."
}
```

**Response 404:**
```json
{
  "message": "Activity not found or not owned by you."
}
```

---

#### `GET /api/activities/factors`

Returns all valid emission factor keys (useful for frontend dropdowns).

**Response 200:**
```json
{
  "carbonFactors": {
    "travel": { "Car (petrol)": 0.18, "..." : "..." },
    "food": { "..." : "..." },
    "energy": { "..." : "..." },
    "shopping": { "..." : "..." }
  }
}
```

---

### Insights — `/api/insights` 🔒

#### `POST /api/insights`

Generates 3 AI-powered personalised sustainability tips from the last 7 days of logged activities. Falls back to hardcoded tips if the Claude API is unavailable.

**Request body:** _(empty — uses JWT to identify the user)_

**Response 200 (AI):**
```json
{
  "source": "ai",
  "tips": [
    {
      "title": "Reduce your car commute",
      "description": "You drove 75 km by petrol car this week, generating 13.5 kg CO₂. Switching to the metro for 3 of those trips could save up to 11 kg per week.",
      "savingKg": 11.0,
      "icon": "🚇"
    },
    {
      "title": "Try plant-based meals twice a week",
      "description": "Your 4 chicken meals contributed 24 kg CO₂. Swapping 2 meals for vegetarian options saves around 10.2 kg per week.",
      "savingKg": 10.2,
      "icon": "🥗"
    },
    {
      "title": "Optimise AC usage",
      "description": "You logged 6 hours of AC use (4.8 kg CO₂). Using a fan instead for 3 of those hours and setting the thermostat to 24°C saves roughly 2.4 kg.",
      "savingKg": 2.4,
      "icon": "❄️"
    }
  ]
}
```

**Response 200 (fallback):**
```json
{
  "source": "fallback",
  "tips": [...]
}
```

---

## Emission Factors Reference

| Category | Type | Factor (kg CO₂/unit) | Unit |
|---|---|---|---|
| travel | Car (petrol) | 0.18 | per km |
| travel | Car (diesel) | 0.16 | per km |
| travel | Bike/scooter | 0.09 | per km |
| travel | Bus | 0.04 | per km |
| travel | Metro/train | 0.02 | per km |
| travel | Flight (domestic) | 0.25 | per km |
| food | Beef meal | 6.0 | per meal |
| food | Chicken meal | 6.0 | per meal |
| food | Fish meal | 3.2 | per meal |
| food | Vegetarian meal | 0.9 | per meal |
| food | Vegan meal | 0.5 | per meal |
| energy | Home electricity | 0.42 | per kWh |
| energy | LPG cooking | 2.9 | per kg |
| energy | AC usage (hr) | 0.8 | per hour |
| shopping | New clothing | 10.0 | per item |
| shopping | Electronics | 30.0 | per item |
| shopping | Groceries | 0.5 | per kg |

---

## Error Responses

| Status | Meaning |
|---|---|
| 400 | Validation error / bad input |
| 401 | Missing, expired, or invalid JWT |
| 404 | Resource not found |
| 500 | Internal server error |

All error responses follow the format:
```json
{ "message": "Human-readable error description" }
```

---

## License

MIT
