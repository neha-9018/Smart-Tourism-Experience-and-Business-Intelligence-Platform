# Tourism360 – AI-Powered Multi-Destination Tourism & Business Intelligence Platform

> **Explore More. Experience More.**

Tourism360 is a full-stack tourism technology platform that combines AI-driven trip planning, destination discovery, and business intelligence into a single, unified application. It supports multiple countries and destination collections, with Nepal and Japan (Yamanashi / Mount Fuji) as primary demonstration destinations.

---

## Features

### Screen 1 – Destination Discovery (Explore)
- Browse tourism destinations across Nepal and Japan.
- Filter by category: Nature, Culture, Adventure, Food, Relaxation.
- Search destinations by name or keyword.
- View detailed destination cards with images, descriptions, costs, and tags.

### Screen 2 – AI Trip Planner (Plan My Trip)
- Select trip duration (1, 2, 3, or 5 days), budget (Budget / Standard / Premium), interests, and travel style.
- Content-based explainable AI recommendation engine scores destinations by interest match, budget compatibility, duration, and travel style.
- Generates a professional day-wise itinerary (Morning / Afternoon / Evening).
- Clearly labelled as an **Explainable AI Recommendation Prototype** – no paid AI APIs used.

### Screen 3 – Business Intelligence Dashboard (Admin)
- KPI cards: Total Bookings, Estimated Revenue (¥/NPR), Top Destination, Returning Visitors.
- Charts: Monthly booking trends, revenue trends, destination comparison, customer interest distribution, booking category breakdown.
- Customer intelligence: popular interests, budget segment distribution, new vs. returning visitors, cross-selling opportunities.
- Clearly labelled illustrative demonstration data.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, Vite, Tailwind CSS, Recharts |
| Backend | FastAPI (Python 3.x) |
| Database | MySQL (Hotel Management schema) |
| Styling | Tailwind CSS with custom Tourism360 navy & red branding |
| Routing | React Router v6 |

---

## Project Structure

```
Tourism 360/
├── frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Home.jsx              # Landing page
│   │   │   ├── Explore.jsx           # Destination discovery
│   │   │   ├── PlanMyTrip.jsx        # AI trip planner
│   │   │   ├── AdminDashboard.jsx    # Business intelligence dashboard
│   │   │   ├── DestinationDetails.jsx
│   │   │   ├── Hotels.jsx
│   │   │   └── MyBookings.jsx
│   │   ├── components/
│   │   │   ├── Navbar.jsx
│   │   │   ├── Footer.jsx
│   │   │   ├── DestinationCard.jsx
│   │   │   ├── AttractionCard.jsx
│   │   │   ├── SearchBar.jsx
│   │   │   └── PageLayout.jsx
│   │   ├── data/
│   │   │   └── destinations.js       # Destination catalogue (Nepal + Japan)
│   │   └── services/
│   │       └── api.js                # API service layer
│   ├── package.json
│   └── vite.config.js
├── backend/
│   ├── app.py                        # FastAPI application
│   ├── requirements.txt
│   └── __init__.py
├── app.py                            # Streamlit hotel management app
├── config.py                         # Environment variable loader
├── requirements.txt
├── .env.example                      # Environment variable template
├── docs/
│   └── SETUP.md
└── README.md
```

---

## Getting Started

### Prerequisites
- Node.js 18+
- Python 3.9+
- MySQL Server (5.5+)

### 1. Clone the Repository

```bash
git clone https://github.com/neha-9018/Smart-Tourism-Experience-and-Business-Intelligence-Platform.git
cd Smart-Tourism-Experience-and-Business-Intelligence-Platform
```

### 2. Configure Environment Variables

```bash
cp .env.example .env
```

Edit `.env` with your MySQL credentials:

```env
DB_HOST=localhost
DB_PORT=3306
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=Hotel_Management
```

### 3. Install Frontend Dependencies

```bash
cd frontend
npm install
npm run dev
```

Frontend runs at: `http://localhost:5173`

### 4. Install Backend Dependencies

```bash
pip install -r requirements.txt
uvicorn backend.app:app --reload --port 8000
```

Backend API runs at: `http://localhost:8000`

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/health` | FastAPI + MySQL status check |
| GET | `/api/hotels` | List all hotels from MySQL |
| GET | `/api/rooms` | List all rooms from MySQL |

---

## Destination Collections

### Nepal
Kathmandu, Pokhara, Chitwan, Lumbini, Everest Base Camp, Annapurna Circuit, Rara Lake, Pashupatinath, Bhaktapur, and more.

### Japan (Yamanashi / Mount Fuji)
Mount Fuji, Lake Kawaguchiko, Chureito Pagoda, Aokigahara Forest, Fuji-Q Highland, Oshino Hakkai, and more.

---

## Screenshots

> *(Add screenshots of the three main screens here)*

---

## Disclaimer

> The Business Intelligence Dashboard and trip planner use **illustrative demonstration data** for educational and prototype purposes. No real customer, booking, or revenue data is represented. The AI recommendation engine is a **rule-based explainable prototype** and does not use any paid or external AI APIs.

---

## License

This project is licensed under the terms of the [LICENSE](LICENSE) file included in this repository.

---

## Author

**Neha** – Tourism360 Project  
GitHub: [@neha-9018](https://github.com/neha-9018)
