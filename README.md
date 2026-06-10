<div align="center">
  
# 🌱 EcoStep

**Your AI-Powered Personal Carbon Footprint Tracker**

[![Next.js](https://img.shields.io/badge/Next.js-14-black?logo=next.js)](https://nextjs.org/)
[![Node.js](https://img.shields.io/badge/Node.js-Express-339933?logo=node.js)](https://nodejs.org/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Atlas-47A248?logo=mongodb)](https://mongodb.com/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css)](https://tailwindcss.com/)
[![Anthropic Claude](https://img.shields.io/badge/AI-Claude_3.5_Sonnet-purple)](https://anthropic.com/)
[![Jest](https://img.shields.io/badge/Testing-Jest_%2B_RTL-C21325?logo=jest)](https://jestjs.io/)

EcoStep is a beautifully designed, full-stack web application that helps users track, understand, and reduce their daily carbon emissions. Through gamification and AI-driven insights, EcoStep makes sustainability engaging and actionable.

[View Demo](#) • [Report Bug](#) • [Request Feature](#)

</div>

---

## ✨ Key Features

- **📊 Comprehensive Carbon Tracking:** Log daily activities across Travel, Food, Energy, and Shopping with region-specific (India & Global) emission factors.
- **🤖 AI Sustainability Tips:** Integrates with Anthropic's Claude AI to generate highly personalized, actionable advice based on your recent activity history.
- **🏆 Gamification & Leaderboards:** Earn *EcoPoints*, maintain daily *Streaks*, climb global rankings, and unlock eco-tiers (Seedling to Eco Champion).
- **📈 Advanced Analytics:** Visualize your footprint with interactive Recharts (Bar, Pie, Trend lines) and compare your usage against national and global benchmarks.
- **⚡ Blazing Fast Performance:** Next.js App Router, dynamic imports for heavy charts, React memoization, and strict API AbortControllers ensure a seamless, app-like experience.
- **🎨 Premium Dark UI:** A stunning, fully responsive glassmorphic dark-mode interface built with Tailwind CSS and Framer Motion animations.

---

## 🛠️ Tech Stack

### Frontend (Client)
- **Framework:** Next.js 14 (App Router)
- **Styling:** Tailwind CSS, Shadcn/UI, Framer Motion
- **Data Viz:** Recharts
- **Testing:** Jest, React Testing Library

### Backend (API)
- **Runtime:** Node.js, Express.js
- **Database:** MongoDB (Mongoose)
- **Authentication:** JWT, bcryptjs
- **AI Integration:** Anthropic API (Claude 3.5 Sonnet)
- **Testing:** Supertest, Jest

---

## 📂 Project Architecture

```text
EcoStep/
├── ecostep-frontend/       # Next.js Application
│   ├── app/                # Route definitions & Pages (Dashboard, Leaderboard, etc.)
│   ├── components/         # Reusable UI components & Layouts
│   ├── lib/                # API helpers, Carbon Factors
│   └── __tests__/          # Frontend Unit & Component Tests
│
└── ecostep-backend/        # Node.js/Express API
    ├── controllers/        # Route logic (Auth, Activities, Insights, Users)
    ├── models/             # Mongoose Schemas (User, Activity)
    ├── routes/             # API Endpoints
    ├── lib/                # Shared Carbon calculation logic
    └── __tests__/          # API Integration Tests
```

---

## 🚀 Quick Start (Local Development)

### Prerequisites
- Node.js (v18+)
- MongoDB Atlas cluster (or local MongoDB instance)
- Anthropic API Key

### 1. Clone the repository
```bash
git clone https://github.com/adii0018/EcoStep.git
cd EcoStep
```

### 2. Setup Backend
```bash
cd ecostep-backend
npm install
```
Create a `.env` file in the `ecostep-backend` directory:
```env
PORT=5000
MONGODB_URI=mongodb+srv://<your_username>:<your_password>@cluster0.mongodb.net/ecostep?retryWrites=true&w=majority
JWT_SECRET=your_super_secret_jwt_key
JWT_EXPIRES_IN=7d
ANTHROPIC_API_KEY=sk-ant-api03-...
CLIENT_URL=http://localhost:3000
```
Start the backend server:
```bash
npm run dev
```

### 3. Setup Frontend
Open a new terminal window:
```bash
cd ecostep-frontend
npm install
```
Create a `.env.local` file in the `ecostep-frontend` directory:
```env
NEXT_PUBLIC_API_URL=http://localhost:5000/api
```
Start the frontend development server:
```bash
npm run dev
```

Your app will be running at `http://localhost:3000`.

---

## 🧪 Testing

EcoStep is built with reliability in mind, featuring comprehensive test suites across both stacks.

### Frontend Tests (Jest + React Testing Library)
Tests cover component rendering, calculation edge cases, and API mocking.
```bash
cd ecostep-frontend
npm run test           # Run all tests
npm run test:coverage  # Generate coverage report
```

### Backend Tests (Supertest)
Tests cover route protection, data validation, and database operations.
```bash
cd ecostep-backend
npm run test
```

*For more detailed testing instructions and troubleshooting (e.g., PowerShell execution policies), see [TESTING.md](./TESTING.md).*

---

## 🌍 Emission Factors Reference

EcoStep calculations are localized for improved accuracy (including Indian-specific grid parameters).

| Category | Type | Factor | Unit |
|---|---|---|---|
| ⚡ **Energy** | Indian Grid Electricity | `0.72` | kg CO₂/kWh |
| ⚡ **Energy** | LPG cooking | `2.9` | kg CO₂/kg |
| 🚗 **Travel** | Auto-rickshaw (India) | `0.05` | kg CO₂/km |
| 🚗 **Travel** | Car (petrol) | `0.18` | kg CO₂/km |
| 🍽️ **Food** | Beef meal | `6.0` | kg CO₂/meal |
| 🍽️ **Food** | Vegan meal | `0.5` | kg CO₂/meal |

*A complete list is maintained within `lib/carbonFactors.js` on both the frontend and backend.*

---

## 📄 License

This project is licensed under the MIT License.

<div align="center">
  <p>Built with ❤️ to save the 🌍.</p>
</div>
