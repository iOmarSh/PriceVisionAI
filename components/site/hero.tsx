import Link from "next/link"
import { ArrowRight, Sparkles, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { AnimatedBackground } from "./animated-background"

export function Hero() {
  return (
    <section className="relative isolate overflow-hidden pt-32 pb-24 md:pt-44 md:pb-32">
      <AnimatedBackground />

      <div className="relative mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-4xl text-center">
          <div className="animate-fade-up inline-flex items-center gap-2 rounded-full border border-border/60 bg-card/40 backdrop-blur px-4 py-1.5 text-xs text-muted-foreground">
            <Sparkles className="h-3.5 w-3.5 text-primary" />
            <span>Powered by advanced ML regression models</span>
          </div>

          <h1
            className="animate-fade-up mt-6 text-balance font-sans text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-semibold tracking-tight leading-[1.05]"
            style={{ animationDelay: "80ms" }}
          >
            Predict House Prices{" "}
            <span className="text-gradient">Instantly</span> with AI
          </h1>

          <p
            className="animate-fade-up mt-6 text-pretty text-base sm:text-lg leading-relaxed text-muted-foreground max-w-2xl mx-auto"
            style={{ animationDelay: "160ms" }}
          >
            Accurate market estimates powered by machine learning. Trained on
            millions of data points to deliver confidence-scored valuations in
            seconds.
          </p>

          <div
            className="animate-fade-up mt-10 flex flex-col sm:flex-row items-center justify-center gap-3"
            style={{ animationDelay: "240ms" }}
          >
            <Button
              asChild
              size="lg"
              className="group relative h-12 px-7 bg-primary hover:bg-primary/90 text-primary-foreground glow-purple text-sm font-medium"
            >
              <Link href="#predict">
                Try Prediction
                <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="ghost"
              className="h-12 px-6 text-muted-foreground hover:text-foreground hover:bg-card/40"
            >
              <Link href="#model">How it works</Link>
            </Button>
          </div>

          {/* small themed scroll indicator */}
          <div className="animate-fade-up mt-6 flex items-center justify-center" style={{ animationDelay: "280ms" }}>
            <a href="#features" aria-label="Scroll down" className="scroll-indicator-link" title="Scroll to features">
              <span className="scroll-indicator" aria-hidden>
                <ChevronDown className="chev h-5 w-5" />
              </span>
              <span className="scroll-indicator-label">Scroll</span>
            </a>
          </div>

          {/* Stats */}
          <div
            className="animate-fade-up mt-16 grid grid-cols-3 gap-4 sm:gap-8 max-w-2xl mx-auto"
            style={{ animationDelay: "320ms" }}
          >
            {[
              { value: "85%", label: "Accuracy" },
              { value: "20,640", label: "Homes analyzed" },
              { value: "<200ms", label: "Avg. response" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="rounded-xl border border-border/60 bg-card/30 backdrop-blur px-4 py-5"
              >
                <div className="font-mono text-2xl sm:text-3xl font-semibold text-foreground">
                  {stat.value}
                </div>
                <div className="mt-1 text-xs sm:text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
