'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { toast } from 'sonner'
import { createClient } from '@/lib/supabase/client'

import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'

import { signInSchema, SignInFormData } from '@/lib/validations/auth'

export default function LoginPage() {
  const [isLoading, setIsLoading] = useState(false)
  const router = useRouter()

  const form = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: SignInFormData) {
    setIsLoading(true)

    try {
      const supabase = createClient()

      const { data: authData, error } = await supabase.auth.signInWithPassword({
        email: data.email,
        password: data.password,
      })

      if (error) {
        toast.error(error.message)
        return
      }

      if (!authData.user) {
        toast.error('Invalid credentials')
        return
      }

      toast.success('Signed in successfully!')
      router.push('/dashboard')
      router.refresh()
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Something went wrong. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center p-4">
      <div className="fixed inset-0 -z-10 bg-gradient-to-br from-gray-900 via-slate-900 to-gray-800" />

      <Card className="relative z-10 w-full max-w-md shadow-2xl backdrop-blur-md bg-white/10 border-white/20">
        <CardHeader className="space-y-4">
          <div className="flex justify-center mb-2">
            <Image
              src="/FastbreakAI.svg"
              alt="Fastbreak AI Logo"
              width={150}
              height={150}
              className="drop-shadow-lg"
              priority
            />
          </div>
          
          <CardTitle className="text-4xl font-black text-white text-center drop-shadow-lg">
            Welcome Back
          </CardTitle>
          <CardDescription className="text-center text-base font-semibold text-white/90 drop-shadow">
            Sign in to manage your sports events
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="name@example.com"
                        disabled={isLoading}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white">Password</FormLabel>
                    <FormControl>
                      <Input
                        type="password"
                        placeholder="Enter your password"
                        disabled={isLoading}
                        className="bg-white/20 border-white/30 text-white placeholder:text-white/60"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-300" />
                  </FormItem>
                )}
              />

              <Button 
                type="submit" 
                className="w-full bg-blue-600 hover:bg-blue-700 text-white" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </Button>
            </form>
          </Form>
        </CardContent>
        <CardFooter className="flex justify-center">
          <p className="text-sm text-white/80">
            Don't have an account?{' '}
            <Link href="/signup" className="underline hover:text-blue-300 font-semibold text-white">
              Sign up
            </Link>
          </p>
        </CardFooter>
      </Card>
    </div>
  )
}