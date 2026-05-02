import Link from "next/link"
import { Github, Linkedin, Mail, Sparkles } from "lucide-react"

const sections = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "Try Prediction", href: "#predict" },
      { label: "About Model", href: "#model" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "Blog", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Press", href: "#" },
    ],
  },
  {
    title: "Legal",
    links: [
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
      { label: "Security", href: "#" },
    ],
  },
]

export function Footer() {
  return (
    <footer className="relative border-t border-border/60 mt-12">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="lg:col-span-2">
            <Link href="#" className="flex items-center gap-2">
              <span className="relative flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-accent shadow-lg shadow-primary/30">
                <Sparkles className="h-4 w-4 text-primary-foreground" />
              </span>
              <span className="font-semibold tracking-tight text-foreground">
                PriceVision <span className="text-primary">AI</span>
              </span>
            </Link>
            <p className="mt-4 max-w-sm text-sm text-muted-foreground leading-relaxed">
              Confidence-scored real estate valuations powered by advanced
              machine learning. Built for modern property teams.
            </p>

            <div className="mt-6 flex items-center gap-2">
              <SocialLink
                href="https://github.com"
                label="GitHub"
                icon={Github}
              />
              <SocialLink
                href="https://linkedin.com"
                label="LinkedIn"
                icon={Linkedin}
              />
              <SocialLink
                href="mailto:hello@pricevision.ai"
                label="Contact"
                icon={Mail}
              />
            </div>
          </div>

          {sections.map((section) => (
            <div key={section.title}>
              <h3 className="text-xs uppercase tracking-wider text-muted-foreground font-medium">
                {section.title}
              </h3>
              <ul role="list" className="mt-4 space-y-3">
                {section.links.map((link) => (
                  <li key={link.label}>
                    <Link
                      href={link.href}
                      className="text-sm text-foreground/80 hover:text-foreground transition-colors"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-14 pt-8 border-t border-border/60 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} PriceVision AI. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Crafted with precision · Predictions are estimates, not appraisals.
          </p>
        </div>
      </div>
    </footer>
  )
}

function SocialLink({
  href,
  label,
  icon: Icon,
}: {
  href: string
  label: string
  icon: React.ComponentType<{ className?: string }>
}) {
  return (
    <Link
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={label}
      className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-border/60 bg-card/40 text-muted-foreground hover:text-foreground hover:border-primary/40 hover:bg-primary/10 transition-colors"
    >
      <Icon className="h-4 w-4" />
    </Link>
  )
}
