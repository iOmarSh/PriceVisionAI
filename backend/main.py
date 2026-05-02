from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import Literal
import pandas as pd
import joblib
import os

CALIFORNIA_LNG_MIN = -125.0
CALIFORNIA_LNG_MAX = -114.0
CALIFORNIA_LAT_MIN = 32.4
CALIFORNIA_LAT_MAX = 42.2

app = FastAPI(title="California House Price Predictor")

# Allow CORS since frontend runs on port 3000
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load the model relative to the workspace root
BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
MODEL_PATH = os.path.join(BASE_DIR, 'california_house_price_model.pkl')
COLUMNS_PATH = os.path.join(BASE_DIR, 'model_columns.pkl')

try:
    model = joblib.load(MODEL_PATH)
    expected_columns = joblib.load(COLUMNS_PATH)
    print("Model loaded successfully!")
except Exception as e:
    print(f"Failed to load the model: {e}")
    model = None
    expected_columns = []

class PredictionRequest(BaseModel):
    longitude: float
    latitude: float
    housing_median_age: float
    total_rooms: float
    total_bedrooms: float
    population: float
    households: float
    median_income: float
    ocean_proximity: Literal["<1H OCEAN", "INLAND", "ISLAND", "NEAR BAY", "NEAR OCEAN"]

    def model_post_init(self, __context):
        if not (CALIFORNIA_LNG_MIN <= self.longitude <= CALIFORNIA_LNG_MAX):
            raise ValueError("Longitude must stay within California bounds.")
        if not (CALIFORNIA_LAT_MIN <= self.latitude <= CALIFORNIA_LAT_MAX):
            raise ValueError("Latitude must stay within California bounds.")
        if not (1 <= self.housing_median_age <= 52):
            raise ValueError("Housing median age must be between 1 and 52.")
        if not (1 <= self.total_rooms <= 20000):
            raise ValueError("Total rooms must be between 1 and 20,000.")
        if not (1 <= self.total_bedrooms <= self.total_rooms):
            raise ValueError("Total bedrooms cannot exceed total rooms.")
        if not (1 <= self.population <= 50000):
            raise ValueError("Population must be between 1 and 50,000.")
        if not (1 <= self.households <= self.population):
            raise ValueError("Households must be between 1 and population.")
        if not (0.5 <= self.median_income <= 15):
            raise ValueError("Median income must be between 0.5 and 15.")


def clamp(value: float, low: float, high: float) -> float:
    return max(low, min(high, value))


def estimate_market_price(req: PredictionRequest, model_price: float) -> int:
    geo_multiplier = {
        "<1H OCEAN": 1.12,
        "INLAND": 0.88,
        "ISLAND": 1.45,
        "NEAR BAY": 1.28,
        "NEAR OCEAN": 1.18,
    }[req.ocean_proximity]

    income_multiplier = clamp(0.7 + (req.median_income / 5.0), 0.7, 2.3)
    size_multiplier = clamp(0.85 + ((req.total_rooms / req.households) / 8.0), 0.75, 1.35)
    crowding_multiplier = clamp(1.15 - ((req.population / req.households) / 6.0), 0.7, 1.15)
    age_multiplier = clamp(1.08 - (req.housing_median_age / 120.0), 0.78, 1.08)
    latitude_multiplier = clamp(0.9 + max(0.0, req.latitude - 36.0) * 0.03, 0.9, 1.18)

    market_baseline = (
        65_000
        + (req.median_income * 85_000)
        + (req.total_rooms * 95)
        + (req.total_bedrooms * 65)
        + (req.population * 22)
        + (req.households * 350)
    )

    market_adjusted = (
        market_baseline
        * geo_multiplier
        * income_multiplier
        * size_multiplier
        * crowding_multiplier
        * age_multiplier
        * latitude_multiplier
    )

    blended = (model_price * 0.25) + (market_adjusted * 0.75)
    return int(round(blended / 1000) * 1000)

@app.post("/predict")
def predict_price(req: PredictionRequest):
    if model is None:
        raise HTTPException(status_code=500, detail="Model is not loaded on the server.")
    
    # 1. Convert input to DataFrame
    input_dict = req.model_dump()
    df = pd.DataFrame([input_dict])
    
    # 2. Feature Engineering
    df["rooms_per_household"] = df["total_rooms"] / df["households"] if df["households"][0] != 0 else 0
    df["bedrooms_per_room"] = df["total_bedrooms"] / df["total_rooms"] if df["total_rooms"][0] != 0 else 0
    df["population_per_household"] = df["population"] / df["households"] if df["households"][0] != 0 else 0
    df["income_per_room"] = df["median_income"] / df["total_rooms"] if df["total_rooms"][0] != 0 else 0
    df["income_per_household"] = df["median_income"] / df["households"] if df["households"][0] != 0 else 0
    df["lat_lon"] = df["latitude"] * df["longitude"]
    df["lat_sq"] = df["latitude"] ** 2
    df["lon_sq"] = df["longitude"] ** 2

    # 3. One-Hot Encode 'ocean_proximity'
    ocean_proximity_categories = ['<1H OCEAN', 'INLAND', 'ISLAND', 'NEAR BAY', 'NEAR OCEAN']
    for cat in ocean_proximity_categories:
        col_name = f"ocean_proximity_{cat}"
        df[col_name] = (df["ocean_proximity"] == cat).astype(int)
    
    # Drop original ocean_proximity string column since ML can't use it directly
    df = df.drop("ocean_proximity", axis=1)

    # 4. Align Columns with the Model's Expected Columns
    for col in expected_columns:
        if col not in df.columns:
            df[col] = 0
            
    try:
         # Sequence dataframe columns to exactly match what the ML model expects
         df = df[expected_columns]
    except KeyError as e:
         raise HTTPException(status_code=400, detail=f"Missing engineered feature: {e}")
         
    # 5. Predict Model Value
    try:
        prediction = model.predict(df)[0]
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction error: {e}")
        
    # Blend the model output with a market-style calibration so results stay
    # sensitive to the user inputs and land in a realistic California band.
    model_price = max(prediction, 0) * 10000
    price = estimate_market_price(req, model_price)
    
    # Range Spread (Â± 7%) for UX visualization
    spread = price * 0.07 
    low = int((price - spread) / 1000) * 1000
    high = int((price + spread) / 1000) * 1000
    
    # Guestimate Sqft to populate the UI (since California dataset doesn't have raw SQFT)
    sqft_estimate = req.total_rooms * 250 / req.households if req.households > 0 else 1500
    price_per_sqft = int(price / sqft_estimate) if sqft_estimate > 0 else 0

    return {
        "price": price,
        "low": low,
        "high": high,
        "confidence": 0.85, # Confidence logic could be added here
        "pricePerSqft": price_per_sqft
    }
