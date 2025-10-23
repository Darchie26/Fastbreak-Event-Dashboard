import { signOut } from '../../actions/auth'
import { Button } from '@/components/ui/button'
import Image from 'next/image'
import Link from 'next/link'

interface DashboardHeaderProps {
  user: {
    email?: string | null
  }
}

export default function DashboardHeader({ user }: DashboardHeaderProps) {
  return (
    <header className="bg-gray-900/50 backdrop-blur-md border-b border-[#17f2e3]/20 sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link href="/dashboard" className="flex items-center space-x-2">
            <Image
              src="/FastbreakAI.svg"
              alt="Fastbreak AI"
              width={40}
              height={40}
              className="w-10 h-10"
            />
            <span className="text-xl font-black text-[#17f2e3] drop-shadow-lg">
              Fastbreak AI
            </span>
          </Link>

          <div className="flex items-center space-x-4">
            <span className="text-sm text-gray-300 hidden sm:inline">
              {user.email}
            </span>
            
            <Link href="/events/new">
              <Button className="bg-[#17f2e3] hover:bg-[#13cfc2] text-gray-900 font-semibold">
                Create Event
              </Button>
            </Link>

            <form action={async () => {
              'use server'
              await signOut()
            }}>
              <Button type="submit" variant="outline" className="border-[#17f2e3]/30 text-gray-300 hover:bg-[#17f2e3]/10 hover:text-white">
                Sign out
              </Button>
            </form>
          </div>
        </div>
      </div>
    </header>
  )
}