import { Star } from "lucide-react"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "@/components/ui/avatar"

const testimonials = [
  {
    quote:
      "PriceVision shaved hours off every valuation. The confidence intervals are a game-changer for our underwriting team.",
    name: "Amelia Chen",
    title: "Director of Acquisitions, Northwind Capital",
    initials: "AC",
  },
  {
    quote:
      "We dropped this into our listing flow and saw a 23% lift in lead conversion. The estimates feel like they're from a senior appraiser.",
    name: "Marcus Brennan",
    title: "Co-founder, Nestled",
    initials: "MB",
  },
  {
    quote:
      "Genuinely the most accurate AVM we've evaluated. The geo-encoder picks up subtle neighborhood differences our previous tool missed.",
    name: "Priya Raghavan",
    title: "Head of Data, Hearthline",
    initials: "PR",
  },
]

export function Testimonials() {
  return (
    <section
      id="testimonials"
      className="relative py-20 md:py-28"
      aria-labelledby="testimonials-heading"
    >
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl">
          <p className="text-sm font-medium text-primary tracking-wider uppercase">
            Customer Stories
          </p>
          <h2
            id="testimonials-heading"
            className="mt-3 text-balance text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight"
          >
            Trusted by{" "}
            <span className="text-gradient">modern real estate teams</span>
          </h2>
        </div>

        <ul
          role="list"
          className="mt-14 grid gap-5 md:grid-cols-3"
        >
          {testimonials.map((t) => (
            <li
              key={t.name}
              className="glass rounded-2xl p-6 lg:p-7 flex flex-col"
            >
              <div
                className="flex gap-1 text-primary"
                aria-label="5 out of 5 stars"
              >
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className="h-4 w-4 fill-current"
                    aria-hidden="true"
                  />
                ))}
              </div>
              <blockquote className="mt-5 text-pretty text-sm leading-relaxed text-foreground/90 flex-1">
                &ldquo;{t.quote}&rdquo;
              </blockquote>
              <div className="mt-6 flex items-center gap-3 pt-5 border-t border-border/60">
                <Avatar className="h-10 w-10 border border-border/60">
                  <AvatarImage src="" alt="" />
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-medium">
                    {t.initials}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-sm font-medium text-foreground">
                    {t.name}
                  </div>
                  <div className="text-xs text-muted-foreground">
                    {t.title}
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
