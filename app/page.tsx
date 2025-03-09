import Link from 'next/link'
import { HeroSection } from '@/components/home/HeroSection'
import { FeaturedMenu } from '@/components/home/FeaturedMenu'
import { HowItWorks } from '@/components/home/HowItWorks'

export default function Home() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <FeaturedMenu />
      <HowItWorks />
      
      <section className="container mx-auto px-4 py-16">
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-8">Ready to Order?</h2>
          <Link 
            href="/menu" 
            className="btn-primary inline-block"
          >
            View Full Menu
          </Link>
        </div>
      </section>
    </main>
  )
} 