# EcoStep Backend

## Setup
```bash
npm install
cp .env.example .env
# Fill in your values in .env
npm run dev
```

## Environment Variables
| Variable | Description | Example |
|----------|-------------|---------|
| PORT | Server port | 5000 |
| MONGODB_URI | MongoDB connection string | mongodb+srv://... |
| JWT_SECRET | Secret for JWT signing | random-string-here |
| JWT_EXPIRES_IN | JWT expiry | 7d |
| ANTHROPIC_API_KEY | Claude API key | sk-ant-... |
| CLIENT_URL | Frontend URL | http://localhost:3000 |

## API Endpoints

### Auth
| Method | Endpoint | Body | Response |
|--------|----------|------|----------|
| POST | /api/auth/register | {name, email, password} | {token, user} |
| POST | /api/auth/login | {email, password} | {token, user} |

### Activities (all require Bearer token)
| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | /api/activities | Get all user activities |
| POST | /api/activities | Create new activity |
| DELETE | /api/activities/:id | Delete activity |
| GET | /api/activities/summary | Get CO2 summary stats |

### Insights
| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | /api/insights | Get AI-powered tips |
