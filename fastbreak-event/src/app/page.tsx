import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Calendar, MapPin, Users, Zap, Trophy, Star } from "lucide-react"

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800">
      {/* Video Background */}
      <div className="fixed inset-0 -z-10 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="absolute inset-0 h-full w-full object-cover opacity-20"
        >
          <source src="/videos/Fastbreak-Background-Video.mp4" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900/90 via-slate-900/90 to-gray-800/90" />
      </div>

      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Image
              src="/FastbreakAI.svg"
              alt="Fastbreak AI"
              width={50}
              height={50}
              priority
            />
            <span className="text-2xl font-black text-[#17f2e3]">
              Fastbreak AI
            </span>
          </div>
          
          <div className="flex items-center gap-4">
            <Link href="/login">
              <Button variant="ghost" className="text-gray-300 hover:text-white hover:bg-white/10">
                Sign In
              </Button>
            </Link>
            <Link href="/signup">
              <Button className="bg-[#17f2e3] hover:bg-[#13cfc2] text-gray-900 font-semibold">
                Get Started
              </Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Hero Section */}
      <main className="container mx-auto px-4">
        <section className="py-20 text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-7xl font-black text-white mb-6 drop-shadow-2xl">
              Manage Sports Events{" "}
              <span className="text-[#17f2e3]">Like a Pro</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-10 max-w-2xl mx-auto">
              Create, organize, and manage sports events with ease. 
              Built for teams, leagues, and athletes in Charlotte.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link href="/signup">
                <Button size="lg" className="bg-[#17f2e3] hover:bg-[#13cfc2] text-gray-900 font-bold text-lg px-8 py-6">
                  Start Free Today
                </Button>
              </Link>
              <Link href="/login">
                <Button size="lg" variant="outline" className="border-[#17f2e3]/30 text-white hover:bg-[#17f2e3]/10 text-lg px-8 py-6">
                  View Dashboard Demo
                </Button>
              </Link>
            </div>
          </div>
        </section>

        {/* Features Section */}
        <section className="py-20">
          <h2 className="text-4xl font-black text-center text-white mb-12">
            Everything You Need
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {/* Feature 1 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-[#17f2e3]/20 hover:border-[#17f2e3]/50 transition-all">
              <div className="bg-[#17f2e3]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Calendar className="w-8 h-8 text-[#17f2e3]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Easy Scheduling
              </h3>
              <p className="text-gray-300">
                Create and manage sports events with intuitive date and time selection. Never miss a game day.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-[#17f2e3]/20 hover:border-[#17f2e3]/50 transition-all">
              <div className="bg-[#17f2e3]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <MapPin className="w-8 h-8 text-[#17f2e3]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Venue Management
              </h3>
              <p className="text-gray-300">
                Add multiple venues, track capacity, and manage locations all in one place.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-[#17f2e3]/20 hover:border-[#17f2e3]/50 transition-all">
              <div className="bg-[#17f2e3]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Users className="w-8 h-8 text-[#17f2e3]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Team Collaboration
              </h3>
              <p className="text-gray-300">
                Share events, coordinate with teammates, and keep everyone in the loop effortlessly.
              </p>
            </div>

            {/* Feature 4 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-[#17f2e3]/20 hover:border-[#17f2e3]/50 transition-all">
              <div className="bg-[#17f2e3]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Zap className="w-8 h-8 text-[#17f2e3]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Lightning Fast
              </h3>
              <p className="text-gray-300">
                Built with modern technology for speed and reliability. Access your events anywhere, anytime.
              </p>
            </div>

            {/* Feature 5 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-[#17f2e3]/20 hover:border-[#17f2e3]/50 transition-all">
              <div className="bg-[#17f2e3]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Trophy className="w-8 h-8 text-[#17f2e3]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Multi-Sport Support
              </h3>
              <p className="text-gray-300">
                Basketball, tennis, soccer, and more. Manage all your sports in one unified platform.
              </p>
            </div>

            {/* Feature 6 */}
            <div className="bg-white/5 backdrop-blur-md p-8 rounded-xl border border-[#17f2e3]/20 hover:border-[#17f2e3]/50 transition-all">
              <div className="bg-[#17f2e3]/20 w-16 h-16 rounded-full flex items-center justify-center mb-6">
                <Star className="w-8 h-8 text-[#17f2e3]" />
              </div>
              <h3 className="text-2xl font-bold text-white mb-4">
                Custom Branding
              </h3>
              <p className="text-gray-300">
                Upload event posters, customize details, and make each event uniquely yours.
              </p>
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 text-center">
          <div className="bg-white/5 backdrop-blur-md p-12 rounded-2xl border border-[#17f2e3]/20 max-w-4xl mx-auto">
            <h2 className="text-4xl md:text-5xl font-black text-white mb-6">
              Ready to Get Started?
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Join hundreds of sports organizers in Charlotte already using Fastbreak AI
            </p>
            <Link href="/signup">
              <Button size="lg" className="bg-[#17f2e3] hover:bg-[#13cfc2] text-gray-900 font-bold text-xl px-12 py-7">
                Create Your Free Account
              </Button>
            </Link>
          </div>
        </section>
      </main>

      {/* Footer */}
      <footer className="border-t border-white/10 py-8 mt-20">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center space-x-2">
              <Image
                src="/FastbreakAI.svg"
                alt="Fastbreak AI"
                width={30}
                height={30}
              />
              <span className="text-sm text-gray-400">
                © 2025 Fastbreak AI. All rights reserved.
              </span>
            </div>
            
            <div className="flex gap-6">
              <Link href="/dashboard" className="text-sm text-gray-400 hover:text-[#17f2e3] transition-colors">
                Dashboard
              </Link>
              <Link href="/login" className="text-sm text-gray-400 hover:text-[#17f2e3] transition-colors">
                Sign In
              </Link>
              <Link href="/signup" className="text-sm text-gray-400 hover:text-[#17f2e3] transition-colors">
                Sign Up
              </Link>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}