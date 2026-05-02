import { Cpu, Database, GitBranch, ShieldCheck } from "lucide-react"

const pillars = [
  {
    icon: Database,
    title: "2.1M+ records",
    description:
      "Trained on multi-source MLS data, public records, and satellite-derived features.",
  },
  {
    icon: GitBranch,
    title: "Gradient boosting",
    description:
      "An ensemble of XGBoost regressors with engineered geo, temporal, and structural features.",
  },
  {
    icon: Cpu,
    title: "Continuous learning",
    description:
      "Retrained nightly to keep pace with evolving micro-markets and seasonality.",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-first",
    description:
      "No PII stored — every prediction runs on anonymized property attributes.",
  },
]

export function AboutModel() {
  return (
    <section
      id="model"
      className="relative py-20 md:py-28"
      aria-labelledby="model-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-start">
          <div>
            <p className="text-sm font-medium text-primary tracking-wider uppercase">
              About the Model
            </p>
            <h2
              id="model-heading"
              className="mt-3 text-balance text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
            >
              An advanced regression engine,{" "}
              <span className="text-gradient">trained on real markets</span>
            </h2>
            <p className="mt-5 text-pretty text-muted-foreground leading-relaxed">
              PriceVision is built on a stacked ensemble of gradient-boosted
              regressors, blended with a neural geo-encoder for hyperlocal
              context. We benchmark against held-out market splits to ensure
              valuations stay calibrated — even when conditions shift.
            </p>
            <p className="mt-4 text-pretty text-muted-foreground leading-relaxed">
              Every prediction includes a transparent confidence interval, so
              you know how much uncertainty surrounds the estimate before you
              act on it.
            </p>

            {/* Mini metrics */}
            <dl className="mt-8 grid grid-cols-3 gap-4 max-w-md">
              {[
                { v: "$42k", l: "RMSE" },
                { v: "$28k", l: "MAE" },
                { v: "20,640", l: "Training rows" },
              ].map((m) => (
                <div
                  key={m.l}
                  className="rounded-xl border border-border/60 bg-card/30 backdrop-blur p-4"
                >
                  <dt className="text-xs text-muted-foreground">{m.l}</dt>
                  <dd className="mt-1 font-mono text-lg font-semibold text-foreground">
                    {m.v}
                  </dd>
                </div>
              ))}
            </dl>
          </div>

          <ul role="list" className="grid sm:grid-cols-2 gap-4">
            {pillars.map((p) => (
              <li
                key={p.title}
                className="glass rounded-2xl p-5 sm:p-6 hover:border-primary/40 transition-colors"
              >
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-lg bg-primary/15 text-primary border border-primary/30">
                  <p.icon className="h-4.5 w-4.5" aria-hidden="true" />
                </span>
                <h3 className="mt-4 text-base font-semibold text-foreground">
                  {p.title}
                </h3>
                <p className="mt-1.5 text-sm text-muted-foreground leading-relaxed">
                  {p.description}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  )
}
