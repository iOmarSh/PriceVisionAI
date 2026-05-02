import { Navbar } from "@/components/site/navbar"
import { Hero } from "@/components/site/hero"
import { Features } from "@/components/site/features"
import { PredictionStudio } from "@/components/site/prediction-studio"
import { AboutModel } from "@/components/site/about-model"
import { Testimonials } from "@/components/site/testimonials"
import { Footer } from "@/components/site/footer"

export default function Page() {
  return (
    <>
      <Navbar />
      <main className="relative pt-20 md:pt-24">
        <Hero />
        <Features />
        <PredictionStudio />
        <AboutModel />
        <Testimonials />
      </main>
      <Footer />
    </>
  )
}
