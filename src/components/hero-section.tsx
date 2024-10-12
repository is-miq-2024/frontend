import { Button } from "@/components/ui/button"
import { Rocket } from "lucide-react"

export default function Hero() {
  return (
    <section className="container py-12">
      <div className="flex flex-col lg:flex-row items-center justify-between py-12 lg:py-24">
        <div className="w-full lg:w-1/2 lg:pr-12 mb-8 lg:mb-0 px-4 sm:px-6 lg:px-8">
          <h1 className="scroll-m-20 text-4xl font-extrabold tracking-tight lg:text-5xl mb-6">Создай свой идельный маршрут</h1>
          <p className="text-lg leading-7 mb-8">Создавайте персонализированные маршруты для путешествий и исследуйте мир как никогда раньше</p>
          <Button className="bg-primary hover:bg-primary/90 text-primary-foreground">
            <div className="flex flex-row items-center gap-2">
              <Rocket className="h-5 w-5" />
              Начать путешествие
            </div>
          </Button>
        </div>
        <div className="w-full lg:w-1/2 relative">
          <img
            src="https://images.unsplash.com/photo-1728425964065-c581bc5ec9ae?q=80&w=2670&auto=format&fit=crop&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
            alt="Scenic mountain road with traveler"
            className="w-full h-auto rounded-xl"
          />
          <div className="absolute inset-0 bg-gradient-to-b lg:bg-gradient-to-r from-white dark:from-black via-transparent dark:via-transparent to-white dark:to-black opacity-100" />
        </div>
      </div>
    </section>
  )
}
