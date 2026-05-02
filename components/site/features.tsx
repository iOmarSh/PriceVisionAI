import { Brain, MapPinned, LineChart, Zap } from "lucide-react"

const features = [
  {
    icon: Brain,
    title: "AI Powered Predictions",
    description:
      "Gradient-boosted regression models trained on millions of property records deliver pinpoint valuations.",
  },
  {
    icon: MapPinned,
    title: "Interactive Map Pricing",
    description:
      "Drop a pin anywhere — we factor neighborhood trends, schools, and proximity into every estimate.",
  },
  {
    icon: LineChart,
    title: "Real-Time Market Insights",
    description:
      "Live signals from listing feeds keep predictions in sync with the latest market shifts and seasonality.",
  },
  {
    icon: Zap,
    title: "Fast & Accurate Results",
    description:
      "Sub-200ms inference with confidence intervals — built for high-volume integrations and instant UX.",
  },
]

export function Features() {
  return (
    <section
      id="features"
      className="relative py-20 md:py-28"
      aria-labelledby="features-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary tracking-wider uppercase">
            Features
          </p>
          <h2
            id="features-heading"
            className="mt-3 text-balance text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Everything you need to value a home —{" "}
            <span className="text-gradient">in one platform</span>
          </h2>
          <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
            A complete prediction stack: data ingestion, geo-aware modeling,
            and an API-grade experience designed for product teams.
          </p>
        </div>

        <ul
          role="list"
          className="mt-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 lg:gap-5"
        >
          {features.map((feature) => (
            <li
              key={feature.title}
              className="group relative rounded-2xl border border-border/60 bg-card/40 backdrop-blur p-6 hover:border-primary/40 transition-all duration-300 hover:-translate-y-1"
            >
              <div
                aria-hidden="true"
                className="absolute inset-0 rounded-2xl bg-gradient-to-b from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"
              />
              <div className="relative">
                <span className="inline-flex h-11 w-11 items-center justify-center rounded-xl bg-gradient-to-br from-primary/30 to-accent/20 border border-primary/30 text-primary group-hover:glow-purple-sm transition-shadow">
                  <feature.icon className="h-5 w-5" aria-hidden="true" />
                </span>
                <h3 className="mt-5 text-base font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
