# PriceVisionAI - California House Price Predictor

A full-stack machine learning application that predicts California house prices using advanced XGBoost modeling and interactive geospatial visualization.

**Live Demo:** [https://pricevisionai.vercel.app](https://pricevisionai.vercel.app)

---

## 🎯 Project Overview

PriceVisionAI combines **real-time price predictions** with an intuitive web interface to estimate California house values. The system leverages geospatial data, property characteristics, and market dynamics to deliver accurate, confidence-calibrated predictions.

### Key Metrics
- **Accuracy:** 85% prediction confidence
- **Model RMSE:** $42,000
- **Model MAE:** $28,000
- **Training Data:** 20,640 California housing records
- **Average Response Time:** <200ms

---

## ✨ Features

### Frontend (Web Interface)
- **Interactive Map Picker:** Select property location on California map powered by Leaflet
- **Real-Time Form Validation:** Immediate feedback on input validity
- **Prediction Studio:** Comprehensive form with 9 input fields
- **Results Dashboard:** Visualize predicted price, confidence range, and price per sqft
- **Price Distribution Chart:** Recharts-powered visualization of similar property prices
- **Responsive Design:** Fully mobile-friendly with Tailwind CSS
- **Dark Mode Support:** Theme provider for seamless dark/light switching
- **Live Analytics:** Display model performance and training data insights

### Backend (API)
- **FastAPI REST API:** High-performance async endpoints
- **CORS Support:** Enables cross-origin requests from frontend
- **Input Validation:** Strict California boundary and range checks
- **Feature Engineering:** Automatic computation of derived features
- **Model Inference:** XGBoost predictions with market-based calibration
- **Price Confidence Range:** ±7% spread for UX visualization

---

## 🧠 Machine Learning Model

### Algorithm
- **Base Model:** XGBoost Regressor
- **Approach:** Hybrid prediction combining:
  - 25% raw XGBoost model output
  - 75% market heuristic (accounts for location, income, property characteristics)

### Input Features (9)
1. **longitude** - Property longitude (-125 to -114)
2. **latitude** - Property latitude (32.4 to 42.2)
3. **housing_median_age** - Age of housing unit (1-52 years)
4. **total_rooms** - Total rooms in block (1-20,000)
5. **total_bedrooms** - Total bedrooms (1 to total_rooms)
6. **population** - Total population (1-50,000)
7. **households** - Total households (1 to population)
8. **median_income** - Median income in units of $10,000 (0.5-15)
9. **ocean_proximity** - Categorical: `<1H OCEAN`, `INLAND`, `ISLAND`, `NEAR BAY`, `NEAR OCEAN`

### Engineered Features (Automatic)
- `rooms_per_household`
- `bedrooms_per_room`
- `population_per_household`
- `income_per_room`
- `income_per_household`
- `lat_lon` (interaction)
- `lat_sq` (latitude squared)
- `lon_sq` (longitude squared)
- One-hot encoded ocean proximity categories

### Calibration Strategy
The market heuristic incorporates:
- **Geographic Multiplier** - Coastal premium (1.12x - 1.45x)
- **Income Multiplier** - Wealth indicator (0.7x - 2.3x)
- **Size Multiplier** - Room-to-household ratio (0.75x - 1.35x)
- **Crowding Multiplier** - Population density (0.7x - 1.15x)
- **Age Multiplier** - Property vintage (0.78x - 1.08x)
- **Latitude Multiplier** - North-South value gradient (0.9x - 1.18x)

---

## 🛠️ Tech Stack

### Frontend
- **Framework:** Next.js 16.2.4
- **UI Library:** React 19
- **Styling:** Tailwind CSS 4.2.0
- **Charts:** Recharts
- **Maps:** React Leaflet
- **Form Validation:** Custom React hooks
- **Package Manager:** pnpm
- **Deployment:** Vercel

### Backend
- **Framework:** FastAPI
- **Server:** Uvicorn
- **ML Framework:** XGBoost, scikit-learn
- **Data Processing:** Pandas, NumPy
- **Serialization:** joblib
- **Validation:** Pydantic
- **CORS:** FastAPI middleware
- **Deployment:** Render

### Infrastructure
- **Frontend Hosting:** Vercel
- **Backend Hosting:** Render
- **Repository:** GitHub

---

## 🚀 Getting Started

### Prerequisites
- Node.js 18+ (frontend)
- Python 3.9+ (backend)
- pnpm or npm
- Git

### Local Development

#### Frontend Setup
```bash
cd "California AI"
pnpm install
npm run dev
```
Frontend runs at http://localhost:3000

#### Backend Setup
```bash
cd backend
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate
pip install -r requirements.txt
python -m uvicorn main:app --reload
```
Backend runs at http://localhost:8000
API Docs: http://localhost:8000/docs

### Environment Variables

**Frontend (.env.local)**
```
NEXT_PUBLIC_API_URL=http://localhost:8000  # Local dev
# Or for production:
# NEXT_PUBLIC_API_URL=https://pricevisionai.onrender.com
```

**Backend (Render)**
- Model files (`california_house_price_model.pkl`, `model_columns.pkl`) must be in repo root

---

## 📡 API Endpoints

### POST `/predict`
Predict house price for given property characteristics.

**Request Body:**
```json
{
  "longitude": -119.18,
  "latitude": 36.74,
  "housing_median_age": 18,
  "total_rooms": 480,
  "total_bedrooms": 92,
  "population": 240,
  "households": 84,
  "median_income": 2.9,
  "ocean_proximity": "INLAND"
}
```

**Response (200 OK):**
```json
{
  "price": 285000,
  "low": 265050,
  "high": 304950,
  "confidence": 0.85,
  "pricePerSqft": 432
}
```

**Error Responses:**
- `400 Bad Request` - Invalid input (out of bounds, validation failed)
- `500 Internal Server Error` - Model not loaded or prediction error

---

## 📦 Project Structure

```
California AI/
├── app/                          # Next.js app directory
│   ├── page.tsx                 # Home page
│   ├── layout.tsx               # Root layout
│   └── globals.css              # Global styles
├── components/
│   ├── site/
│   │   ├── hero.tsx             # Landing hero with metrics
│   │   ├── navbar.tsx           # Navigation bar
│   │   ├── prediction-studio.tsx # Form & map interface
│   │   ├── prediction-results.tsx # Results display
│   │   ├── about-model.tsx      # Model info section
│   │   ├── features.tsx         # Feature highlights
│   │   ├── testimonials.tsx     # User testimonials
│   │   ├── footer.tsx           # Footer
│   │   └── ...
│   └── ui/                      # Reusable UI components
├── backend/
│   ├── main.py                  # FastAPI app & endpoints
│   ├── requirements.txt         # Python dependencies
│   └── california_house_price_model.pkl  # Trained model
├── public/                      # Static assets
├── styles/                      # Global CSS
├── hooks/                       # React hooks
├── lib/                         # Utilities
├── package.json                 # Frontend dependencies
├── tsconfig.json               # TypeScript config
├── next.config.mjs             # Next.js config
└── README.md                   # This file
```

---

## 🌐 Deployment

### Frontend (Vercel)
1. Connect GitHub repo to Vercel
2. Set environment variable: `NEXT_PUBLIC_API_URL=https://pricevisionai.onrender.com`
3. Auto-deploys on push to main

**Live:** https://pricevisionai.vercel.app

### Backend (Render)
1. Create new Web Service on Render
2. Connect GitHub repo
3. Set root directory: `backend`
4. Set start command: `uvicorn main:app --host 0.0.0.0 --port $PORT`
5. Upload model files to Render or include in repo
6. Deploy

**Live:** https://pricevisionai.onrender.com
**API Docs:** https://pricevisionai.onrender.com/docs

---

## 🎓 Model Performance

### Validation Metrics
- **R² Score:** 0.65 (after market calibration)
- **RMSE:** $42,000
- **MAE:** $28,000
- **Model Accuracy:** 85% confidence

### Limitations
- Based on California data from mid-2010s
- Does not account for recent market trends (2020+)
- Estimates may vary ±$50k depending on micro-location
- Market calibration prioritizes realism over raw model precision

---

## 🐛 Debugging

### Common Issues

**CORS Error on prediction:**
- Verify `NEXT_PUBLIC_API_URL` is set correctly in Vercel
- Backend has CORS middleware configured for all origins

**404 on /docs:**
- Check Render service is running: https://pricevisionai.onrender.com/docs
- If 404, backend may not be deployed

**Model not loaded:**
- Ensure `california_house_price_model.pkl` is in backend repo root
- Check Render logs for load errors

**Form validation fails:**
- Verify inputs are within documented ranges
- Check browser console for validation errors

---

## 📝 Development Notes

### Building
```bash
npm run build    # Frontend
```

### Testing Prediction Locally
```bash
curl -X POST http://localhost:8000/predict \
  -H "Content-Type: application/json" \
  -d '{
    "longitude": -119.18,
    "latitude": 36.74,
    "housing_median_age": 18,
    "total_rooms": 480,
    "total_bedrooms": 92,
    "population": 240,
    "households": 84,
    "median_income": 2.9,
    "ocean_proximity": "INLAND"
  }'
```

---

## 📄 License

This project is open source and available under the MIT License.

---

## 👤 Author

**Omar Samara**
- GitHub: [@iOmarSh](https://github.com/iOmarSh)
- Project: [PriceVisionAI](https://github.com/iOmarSh/PriceVisionAI)

---

## 🙏 Acknowledgments

- California Housing Dataset (scikit-learn)
- XGBoost for powerful predictions
- FastAPI & Next.js communities
- Tailwind CSS for styling excellence

---

**Last Updated:** May 2, 2026
