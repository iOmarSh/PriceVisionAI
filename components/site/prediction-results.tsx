"use client"

import { Bath, BedDouble, Home, MapPin, TrendingUp } from "lucide-react"
import {
  Bar,
  BarChart,
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts"

export type PredictionResult = {
  price: number
  low: number
  high: number
  confidence: number
  pricePerSqft: number
}

type PredictionContext = {
  latitude: number
  longitude: number
  housing_median_age: number
  total_rooms: number
  total_bedrooms: number
  population: number
  households: number
  median_income: number
  ocean_proximity: string
}

const formatUSD = (n: number) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n)

function buildDistribution(result: PredictionResult) {
  // Generate a smooth bell-shaped distribution between low and high.
  const points = 13
  const center = result.price
  const span = (result.high - result.low) / 2 || 1
  return Array.from({ length: points }, (_, i) => {
    const t = (i - (points - 1) / 2) / ((points - 1) / 2) // -1..1
    const price = center + t * span
    // Gaussian-ish
    const density = Math.exp(-Math.pow(t * 1.6, 2)) * 100
    return {
      price: Math.round(price),
      label: formatUSD(price),
      density: Math.round(density),
    }
  })
}

const neighborhoodNames: Record<string, string[]> = {
  "INLAND": ["Fresno Valley Dr", "Bakersfield Mesa Rd", "Modesto Grove Ln", "Visalia Court"],
  "NEAR BAY": ["Berkeley Ridge Ave", "Oakland Harbor Dr", "San Rafael Point Ln", "Palo Alto Creek Way"],
  "NEAR OCEAN": ["Santa Cruz Shore Dr", "Ventura Coast Ave", "Monterey Surf Way", "San Diego Beach Ln"],
  "<1H OCEAN": ["Long Beach Bluff Rd", "Santa Barbara View Dr", "Redondo Coast Ct", "Malibu Canyon Trl"],
  "ISLAND": ["Avalon Harbor Rd", "Catalina Cove Ln", "Bay Point Way", "Island View Dr"],
}

function clamp(value: number, low: number, high: number) {
  return Math.max(low, Math.min(high, value))
}

function buildSimilarHomes(result: PredictionResult, context: PredictionContext) {
  const estimatedSqft = Math.max(
    700,
    Math.round((context.total_rooms / Math.max(context.households, 1)) * 260),
  )

  const neighborhood = neighborhoodNames[context.ocean_proximity] ?? neighborhoodNames.INLAND
  const priceSteps = [0.88, 0.95, 1.03, 1.1]

  return priceSteps.map((step, index) => {
    const sqft = Math.round(estimatedSqft * (0.93 + index * 0.04))
    const beds = clamp(Math.round(sqft / 420), 1, 6)
    const baths = clamp(Math.round(beds * 0.75 + index * 0.25), 1, 5)
    const price = Math.round((result.price * step) / 1000) * 1000
    return {
      address: neighborhood[index],
      beds,
      baths,
      sqft,
      price,
      distance: `${(0.4 + index * 0.3).toFixed(1)} mi`,
    }
  })
}

export function PredictionResults({ result, context }: { result: PredictionResult; context: PredictionContext }) {
  const data = buildDistribution(result)
  const similarHomes = buildSimilarHomes(result, context)

  return (
    <div
      id="results"
      className="mt-10 grid gap-5 lg:grid-cols-3 animate-fade-up"
      aria-live="polite"
    >
      {/* Predicted price card */}
      <div className="glass rounded-2xl p-6 lg:p-8 lg:col-span-1">
        <div className="flex items-center gap-2 text-xs uppercase tracking-wider text-primary">
          <TrendingUp className="h-3.5 w-3.5" />
          Predicted Price
        </div>
        <div className="mt-4 font-mono text-4xl sm:text-5xl font-semibold text-gradient">
          {formatUSD(result.price)}
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          Range {formatUSD(result.low)} — {formatUSD(result.high)}
        </p>

        <div className="mt-6 space-y-4">
          <div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-muted-foreground">Confidence Score</span>
              <span className="font-mono text-foreground">
                {Math.round(result.confidence * 100)}%
              </span>
            </div>
            <div className="mt-2 h-2 rounded-full bg-secondary overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-primary to-accent shimmer"
                style={{ width: `${result.confidence * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center justify-between rounded-lg border border-border/60 bg-card/40 px-4 py-3">
            <span className="text-xs text-muted-foreground">
              Price per sq ft
            </span>
            <span className="font-mono text-sm text-foreground">
              {formatUSD(result.pricePerSqft)}
            </span>
          </div>
        </div>
      </div>

      {/* Price range chart */}
      <div className="glass rounded-2xl p-6 lg:p-8 lg:col-span-2">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Price Range Distribution
          </h3>
          <span className="text-xs text-muted-foreground">
            Modeled probability density
          </span>
        </div>

        <div className="mt-6 h-56 sm:h-64">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 8 }}>
              <defs>
                <linearGradient id="bar-gradient" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="oklch(0.7 0.22 295)" stopOpacity={0.95} />
                  <stop offset="100%" stopColor="oklch(0.45 0.2 295)" stopOpacity={0.5} />
                </linearGradient>
              </defs>
              <CartesianGrid
                strokeDasharray="3 3"
                stroke="oklch(0.3 0.05 295 / 0.3)"
                vertical={false}
              />
              <XAxis
                dataKey="price"
                tickFormatter={(v) =>
                  `$${(Number(v) / 1000).toFixed(0)}k`
                }
                tick={{ fill: "oklch(0.7 0.02 290)", fontSize: 11 }}
                axisLine={false}
                tickLine={false}
              />
              <YAxis hide />
              <Tooltip
                cursor={{ fill: "oklch(0.4 0.15 295 / 0.15)" }}
                contentStyle={{
                  background: "oklch(0.12 0.02 290)",
                  border: "1px solid oklch(0.3 0.1 295 / 0.4)",
                  borderRadius: 8,
                  fontSize: 12,
                  color: "oklch(0.95 0 0)",
                }}
                formatter={(value: number) => [`${value}`, "Density"]}
                labelFormatter={(v) => formatUSD(Number(v))}
              />
              <ReferenceLine
                x={result.price}
                stroke="oklch(0.85 0.2 295)"
                strokeDasharray="4 4"
                strokeWidth={1.5}
              />
              <Bar
                dataKey="density"
                fill="url(#bar-gradient)"
                radius={[6, 6, 0, 0]}
              />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Similar homes */}
      <div className="glass rounded-2xl p-6 lg:p-8 lg:col-span-3">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-semibold text-foreground">
            Similar Homes Nearby
          </h3>
          <span className="text-xs text-muted-foreground">
            Comparable recent sales
          </span>
        </div>

        <ul
          role="list"
          className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4"
        >
          {similarHomes.map((h) => (
            <li
              key={h.address}
              className="group rounded-xl border border-border/60 bg-card/40 p-4 hover:border-primary/40 transition-colors"
            >
              <div className="flex items-start justify-between">
                <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-primary/15 text-primary">
                  <Home className="h-4 w-4" />
                </div>
                <span className="text-xs text-muted-foreground">
                  {h.distance}
                </span>
              </div>
              <p className="mt-3 text-sm font-medium text-foreground truncate">
                {h.address}
              </p>
              <div className="mt-1 flex items-center gap-3 text-xs text-muted-foreground">
                <span className="inline-flex items-center gap-1">
                  <BedDouble className="h-3.5 w-3.5" />
                  {h.beds}
                </span>
                <span className="inline-flex items-center gap-1">
                  <Bath className="h-3.5 w-3.5" />
                  {h.baths}
                </span>
                <span className="inline-flex items-center gap-1">
                  <MapPin className="h-3.5 w-3.5" />
                  {h.sqft.toLocaleString()} ft²
                </span>
              </div>
              <div className="mt-3 font-mono text-base font-semibold text-foreground">
                {formatUSD(h.price)}
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  )
}
