"use client"

import { useState, useTransition, type FormEvent } from "react"
import dynamic from "next/dynamic"
import { Sparkles, MapPin, Loader2 } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { useToast } from "@/hooks/use-toast"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

import {
  PredictionResults,
  type PredictionResult,
} from "./prediction-results"

const CALIFORNIA_BOUNDS: [[number, number], [number, number]] = [
  [32.4, -125.0],
  [42.2, -114.0],
]

const OCEAN_PROXIMITIES = [
  "<1H OCEAN",
  "INLAND",
  "ISLAND",
  "NEAR BAY",
  "NEAR OCEAN",
] as const

const MapPicker = dynamic(() => import("./map-picker"), {
  ssr: false,
  loading: () => (
    <div className="flex h-full w-full items-center justify-center rounded-xl bg-card/40 text-sm text-muted-foreground">
      Loading map...
    </div>
  ),
})

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000"

type FormState = {
  longitude: number | string
  latitude: number | string
  housing_median_age: number | string
  total_rooms: number | string
  total_bedrooms: number | string
  population: number | string
  households: number | string
  median_income: number | string
  ocean_proximity: string
}

const initialState: FormState = {
  longitude: -119.18,
  latitude: 36.74,
  housing_median_age: 18,
  total_rooms: 480,
  total_bedrooms: 92,
  population: 240,
  households: 84,
  median_income: 2.9,
  ocean_proximity: "INLAND",
}

export function PredictionStudio() {
  const [state, setState] = useState<FormState>(initialState)
  const [result, setResult] = useState<PredictionResult | null>(null)
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()

  const update = <K extends keyof FormState>(key: K, value: FormState[K]) =>
    setState((s) => ({ ...s, [key]: value }))


  const validate = (draft: FormState) => {
    const num = (v: number | string) => Number(v)
    if (num(draft.longitude) < CALIFORNIA_BOUNDS[0][1] || num(draft.longitude) > CALIFORNIA_BOUNDS[1][1]) {
      return "Longitude must stay within California."
    }

    if (num(draft.latitude) < CALIFORNIA_BOUNDS[0][0] || num(draft.latitude) > CALIFORNIA_BOUNDS[1][0]) {
      return "Latitude must stay within California."
    }

    if (num(draft.housing_median_age) < 1 || num(draft.housing_median_age) > 52) {
      return "Housing age must be between 1 and 52 years."
    }

    if (num(draft.total_rooms) < 1 || num(draft.total_rooms) > 20000) {
      return "Total rooms must be between 1 and 20,000."
    }

    if (num(draft.total_bedrooms) < 1 || num(draft.total_bedrooms) > num(draft.total_rooms)) {
      return "Total bedrooms cannot exceed total rooms."
    }

    if (num(draft.population) < 1 || num(draft.population) > 50000) {
      return "Population must be between 1 and 50,000."
    }

    if (num(draft.households) < 1 || num(draft.households) > num(draft.population)) {
      return "Households must be between 1 and population."
    }

    if (num(draft.median_income) < 0.5 || num(draft.median_income) > 15) {
      return "Median income must be between 0.5 and 15 in dataset units."
    }

    if (!OCEAN_PROXIMITIES.includes(draft.ocean_proximity as (typeof OCEAN_PROXIMITIES)[number])) {
      return "Pick a valid ocean proximity value."
    }

    return null
  }

  const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const payload = {
      longitude: Number(state.longitude),
      latitude: Number(state.latitude),
      housing_median_age: Number(state.housing_median_age),
      total_rooms: Number(state.total_rooms),
      total_bedrooms: Number(state.total_bedrooms),
      population: Number(state.population),
      households: Number(state.households),
      median_income: Number(state.median_income),
      ocean_proximity: state.ocean_proximity,
    }

    const validationError = validate(payload)
    if (validationError) {
      toast({
        title: "Check your inputs",
        description: validationError,
        variant: "destructive",
      })
      return
    }

    startTransition(async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/predict`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        })

        if (!response.ok) {
          const errorData = await response.json().catch(() => null)
          throw new Error(errorData?.detail || "Failed to fetch prediction")
        }

        const data = await response.json()
        setResult(data)

        // Smooth scroll to results
        requestAnimationFrame(() => {
          document
            .getElementById("results")
            ?.scrollIntoView({ behavior: "smooth", block: "start" })
        })
      } catch (error) {
        console.error("Prediction Error:", error)
        toast({
          title: "Prediction Failed",
          description: error instanceof Error ? error.message : "Ensure the FastAPI backend is running.",
          variant: "destructive",
        })
      }
    })
  }

  return (
    <section
      id="predict"
      className="relative py-20 md:py-28"
      aria-labelledby="predict-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary tracking-wider uppercase">
            Prediction Studio
          </p>
          <h2
            id="predict-heading"
            className="mt-3 text-balance text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Get an instant {" "}
            <span className="text-gradient">AI-powered estimate</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            Enter California property details and pick a location inside the
            highlighted state boundary. Our model returns a confidence-scored
            valuation with a comparables breakdown.
          </p>
        </div>

        <div className="mt-12 grid gap-5 lg:grid-cols-5">
          {/* Form */}
          <form
            onSubmit={handleSubmit}
            className="glass rounded-2xl p-6 lg:p-8 lg:col-span-3"
            aria-labelledby="form-heading"
          >
            <h3 id="form-heading" className="sr-only">
              Property details
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <Field label="Housing Age (Years)" htmlFor="housing_median_age">
                <Input
                  id="housing_median_age"
                  type="number"
                  min={1}
                  max={52}
                  value={state.housing_median_age}
                  onChange={(e) => update("housing_median_age", e.target.value)}
                  className="h-11 bg-input/60 border-border/60 focus-visible:ring-primary"
                />
              </Field>

              <Field label="Total Rooms" htmlFor="total_rooms">
                <Input
                  id="total_rooms"
                  type="number"
                  min={1}
                  max={20000}
                  value={state.total_rooms}
                  onChange={(e) => update("total_rooms", e.target.value)}
                  className="h-11 bg-input/60 border-border/60 focus-visible:ring-primary"
                />
              </Field>

              <Field label="Total Bedrooms" htmlFor="total_bedrooms">
                <Input
                  id="total_bedrooms"
                  type="number"
                  min={1}
                  max={20000}
                  value={state.total_bedrooms}
                  onChange={(e) => update("total_bedrooms", e.target.value)}
                  className="h-11 bg-input/60 border-border/60 focus-visible:ring-primary"
                />
              </Field>

              <Field label="Population" htmlFor="population">
                <Input
                  id="population"
                  type="number"
                  min={1}
                  max={50000}
                  value={state.population}
                  onChange={(e) => update("population", e.target.value)}
                  className="h-11 bg-input/60 border-border/60 focus-visible:ring-primary"
                />
              </Field>

              <Field label="Households" htmlFor="households">
                <Input
                  id="households"
                  type="number"
                  min={1}
                  max={50000}
                  value={state.households}
                  onChange={(e) => update("households", e.target.value)}
                  className="h-11 bg-input/60 border-border/60 focus-visible:ring-primary"
                />
              </Field>

              <Field label="Median Income (x$10k)" htmlFor="median_income">
                <Input
                  id="median_income"
                  type="number"
                  step="0.0001"
                  min={0.5}
                  max={15}
                  value={state.median_income}
                  onChange={(e) => update("median_income", e.target.value)}
                  className="h-11 bg-input/60 border-border/60 focus-visible:ring-primary"
                />
              </Field>
              <div className="sm:col-span-2 -mt-2 text-xs text-muted-foreground">
                Median income is stored in tens of thousands of dollars. For
                example, 3.8 means about $38,000 annual median income.
              </div>

              <Field label="Ocean Proximity" htmlFor="ocean_proximity">
                <Select
                  value={state.ocean_proximity}
                  onValueChange={(v) => update("ocean_proximity", v)}
                >
                  <SelectTrigger
                    id="ocean_proximity"
                    className="h-11 bg-input/60 border-border/60 focus:ring-primary"
                  >
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="<1H OCEAN">&lt;1H OCEAN</SelectItem>
                    <SelectItem value="INLAND">INLAND</SelectItem>
                    <SelectItem value="ISLAND">ISLAND</SelectItem>
                    <SelectItem value="NEAR BAY">NEAR BAY</SelectItem>
                    <SelectItem value="NEAR OCEAN">NEAR OCEAN</SelectItem>
                  </SelectContent>
                </Select>
              </Field>

              <div className="hidden sm:block"></div>

              <Field label="Latitude" htmlFor="latitude">
                <Input
                  id="latitude"
                  type="number"
                  step="any"
                  min={32.4}
                  max={42.2}
                  value={state.latitude}
                  inputMode="decimal"
                  onChange={(e) => update("latitude", e.target.value)}
                  className="h-11 bg-input/60 border-border/60 focus-visible:ring-primary font-mono"
                />
              </Field>

              <Field label="Longitude" htmlFor="longitude">
                <Input
                  id="longitude"
                  type="number"
                  step="any"
                  min={-125}
                  max={-114}
                  value={state.longitude}
                  inputMode="decimal"
                  onChange={(e) => update("longitude", e.target.value)}
                  className="h-11 bg-input/60 border-border/60 focus-visible:ring-primary font-mono"
                />
              </Field>
            </div>

            <Button
              type="submit"
              size="lg"
              disabled={isPending}
              className="mt-8 w-full h-12 bg-primary hover:bg-primary/90 text-primary-foreground glow-purple text-sm font-medium"
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Running model...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Predict Price
                </>
              )}
            </Button>
          </form>

          {/* Map */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            <div className="glass rounded-2xl p-2 h-[420px] lg:h-full overflow-hidden">
              <MapPicker
                bounds={CALIFORNIA_BOUNDS}
                position={{ lat: state.latitude, lng: state.longitude }}
                onChange={({ lat, lng }) => {
                  setState((s) => ({
                    ...s,
                    latitude: Number(lat.toFixed(4)),
                    longitude: Number(lng.toFixed(4)),
                  }))
                }}
              />
            </div>
            <p className="flex items-start gap-2 text-xs text-muted-foreground px-1">
              <MapPin className="h-3.5 w-3.5 mt-0.5 text-primary shrink-0" />
              Map is locked to California. Click inside the highlighted region
              to set the property location.
            </p>
          </div>
        </div>

        {result && (
          <PredictionResults
            result={result}
            context={{
              latitude: Number(state.latitude),
              longitude: Number(state.longitude),
              housing_median_age: Number(state.housing_median_age),
              total_rooms: Number(state.total_rooms),
              total_bedrooms: Number(state.total_bedrooms),
              population: Number(state.population),
              households: Number(state.households),
              median_income: Number(state.median_income),
              ocean_proximity: state.ocean_proximity,
            }}
          />
        )}
      </div>
    </section>
  )
}

function Field({
  label,
  htmlFor,
  children,
}: {
  label: string
  htmlFor: string
  children: React.ReactNode
}) {
  return (
    <div className="space-y-2">
      <Label
        htmlFor={htmlFor}
        className="text-xs uppercase tracking-wider text-muted-foreground font-medium"
      >
        {label}
      </Label>
      {children}
    </div>
  )
}
