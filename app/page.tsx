'use client';

import Link from 'next/link';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import {
  ArrowRight,
  Sparkles,
  Users,
  Camera,
  MapPin,
  Plane,
  Globe,
  Sun,
  Moon,
} from 'lucide-react';
import { ScrollReveal } from '@/components/landing/scroll-reveal';
import { AnimatedCounter } from '@/components/landing/animated-counter';
import { useInView } from '@/lib/use-in-view';
import { useEffect, useState } from 'react';

export default function LandingPage() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const { ref: statsRef, isInView: statsInView } = useInView<HTMLDivElement>();

  useEffect(() => setMounted(true), []);

  return (
    <main className="min-h-screen bg-gradient-to-br from-[#faf8f5] via-[#f5f0e8] to-[#efe9e0] dark:from-[#1a1917] dark:via-[#252320] dark:to-[#2d2b28]">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 glass border-b border-white/20 dark:border-white/10 shadow-layered">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2">
            <img src="/tripdrip.png" alt="Memora" className="w-10 h-10" />
            <span className="text-xl font-semibold text-slate-900 dark:text-white tracking-tight">
              Memora
            </span>
          </Link>
          <div className="flex items-center gap-6">
            <Link
              href="/dashboard"
              className="nav-link-underline text-sm font-medium text-slate-700 hover:text-slate-900 dark:text-slate-300 dark:hover:text-white transition-colors"
            >
              Dashboard
            </Link>
            {mounted && (
              <button
                type="button"
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="p-2 rounded-xl hover:bg-white/50 dark:hover:bg-white/10 transition-colors"
                aria-label="Toggle theme"
              >
                <Sun className="w-5 h-5 text-slate-600 dark:hidden" />
                <Moon className="w-5 h-5 text-slate-400 hidden dark:block" />
              </button>
            )}
            <Button size="sm" className="rounded-full" asChild>
              <Link href="/dashboard">Get Started</Link>
            </Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative pt-36 pb-28 px-4 overflow-hidden">
        {/* Background glow */}
        <div
          className="absolute inset-0 pointer-events-none"
          aria-hidden
        >
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[400px] bg-gradient-to-br from-orange-200/40 to-amber-100/30 dark:from-orange-500/20 dark:to-amber-600/10 rounded-full blur-3xl animate-pulse-glow" />
          <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-orange-100/30 dark:bg-orange-600/10 rounded-full blur-3xl animate-float-slow" />
        </div>

        <div className="relative max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <div className="inline-flex items-center gap-2 mb-8 px-4 py-2 rounded-full glass border border-orange-200/50 dark:border-orange-800/50 shadow-layered animate-scale-in">
              <Sparkles className="w-4 h-4 text-orange-500 dark:text-orange-400 animate-pulse-glow" />
              <span className="text-sm font-medium text-slate-700 dark:text-slate-300">
                AI-Powered Travel Planning
              </span>
            </div>
          </ScrollReveal>

          <ScrollReveal delay={80}>
            <h1 className="text-5xl sm:text-6xl lg:text-7xl font-extrabold text-slate-900 dark:text-white mb-6 leading-[1.1] tracking-tight text-balance">
              Your Personal{' '}
              <span className="gradient-text">AI Travel Concierge</span>
            </h1>
          </ScrollReveal>

          <ScrollReveal delay={160}>
            <p className="text-xl sm:text-2xl text-slate-600 dark:text-slate-400 mb-10 max-w-2xl mx-auto text-balance leading-relaxed">
              Generate beautiful itineraries, collaborate with friends, and capture
              memories from every trip. All powered by AI.
            </p>
          </ScrollReveal>

          <ScrollReveal delay={240}>
            <div className="flex flex-wrap gap-4 justify-center">
              <Button size="lg" className="gap-2 rounded-full px-8" asChild>
                <Link href="/dashboard">
                  Get Started <ArrowRight className="w-4 h-4" />
                </Link>
              </Button>
            </div>
          </ScrollReveal>

          {/* Floating decorative element */}
          <ScrollReveal delay={320}>
            <div className="mt-16 flex justify-center gap-8 opacity-90">
              <div className="animate-float p-4 rounded-2xl glass border border-white/40 dark:border-white/10 shadow-layered">
                <Globe className="w-10 h-10 text-orange-500 dark:text-orange-400" />
              </div>
              <div className="animate-float-slow p-4 rounded-2xl glass border border-white/40 dark:border-white/10 shadow-layered" style={{ animationDelay: '1s' }}>
                <Plane className="w-10 h-10 text-amber-600 dark:text-amber-400" />
              </div>
              <div className="animate-float p-4 rounded-2xl glass border border-white/40 dark:border-white/10 shadow-layered" style={{ animationDelay: '2s' }}>
                <MapPin className="w-10 h-10 text-orange-600 dark:text-orange-300" />
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-4" ref={statsRef}>
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
              <div className="text-center p-8 rounded-2xl glass border border-white/40 dark:border-white/10 shadow-layered hover-lift group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Plane className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-4xl sm:text-5xl font-bold gradient-text mb-1">
                  <AnimatedCounter end={50} suffix="+" isInView={statsInView} />
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Trips Planned
                </p>
              </div>
              <div className="text-center p-8 rounded-2xl glass border border-white/40 dark:border-white/10 shadow-layered hover-lift group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Users className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-4xl sm:text-5xl font-bold gradient-text mb-1">
                  <AnimatedCounter end={10} suffix="k+" isInView={statsInView} />
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Happy Travelers
                </p>
              </div>
              <div className="text-center p-8 rounded-2xl glass border border-white/40 dark:border-white/10 shadow-layered hover-lift group">
                <div className="inline-flex items-center justify-center w-14 h-14 rounded-xl bg-orange-100 dark:bg-orange-500/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <Camera className="w-7 h-7 text-orange-600 dark:text-orange-400" />
                </div>
                <p className="text-4xl sm:text-5xl font-bold gradient-text mb-1">
                  <AnimatedCounter end={100} suffix="k+" isInView={statsInView} />
                </p>
                <p className="text-slate-600 dark:text-slate-400 font-medium">
                  Memories Captured
                </p>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <ScrollReveal>
            <h2 className="text-3xl sm:text-4xl font-bold text-slate-900 dark:text-white text-center mb-4 tracking-tight">
              Everything you need for perfect trips
            </h2>
            <p className="text-slate-600 dark:text-slate-400 text-center max-w-2xl mx-auto mb-16">
              One platform to plan, collaborate, and remember every adventure.
            </p>
          </ScrollReveal>

          <div className="grid md:grid-cols-3 gap-8">
            <ScrollReveal delay={0}>
              <Card className="glass border-white/40 dark:border-white/10 rounded-2xl overflow-hidden hover-tilt group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-blue-100 dark:bg-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Sparkles className="w-7 h-7 text-blue-600 dark:text-blue-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">
                    AI Itineraries
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Get personalized itineraries generated by AI based on your
                    travel style and preferences.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={100}>
              <Card className="glass border-white/40 dark:border-white/10 rounded-2xl overflow-hidden hover-tilt group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-green-100 dark:bg-green-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Users className="w-7 h-7 text-green-600 dark:text-green-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">
                    Collaborate
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Invite friends and family to plan trips together with
                    real-time collaboration.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
            <ScrollReveal delay={200}>
              <Card className="glass border-white/40 dark:border-white/10 rounded-2xl overflow-hidden hover-tilt group">
                <CardContent className="p-8">
                  <div className="w-14 h-14 rounded-xl bg-purple-100 dark:bg-purple-500/20 flex items-center justify-center mb-5 group-hover:scale-110 transition-transform duration-300">
                    <Camera className="w-7 h-7 text-purple-600 dark:text-purple-400" />
                  </div>
                  <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-2 tracking-tight">
                    Memory Capture
                  </h3>
                  <p className="text-slate-600 dark:text-slate-400 leading-relaxed">
                    Upload and organize photos from your trips in one beautiful
                    gallery.
                  </p>
                </CardContent>
              </Card>
            </ScrollReveal>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-28 px-4 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 dark:from-slate-950 dark:via-slate-900 dark:to-slate-950" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_50%_50%,rgba(234,88,12,0.12)_0%,transparent_60%)]" />
        <div className="relative max-w-4xl mx-auto text-center">
          <ScrollReveal>
            <h2 className="text-4xl sm:text-5xl font-bold text-white mb-6 tracking-tight">
              Ready to plan your next adventure?
            </h2>
            <p className="text-xl text-slate-300 mb-10 max-w-2xl mx-auto">
              Create your first trip in seconds and let AI handle the planning.
            </p>
            <Button
              size="lg"
              variant="outline"
              className="gap-2 rounded-full border-2 border-orange-400/60 bg-white/5 text-white hover:bg-orange-500/20 hover:border-orange-400 hover:text-white px-8"
              asChild
            >
              <Link href="/dashboard">
                Start Planning <ArrowRight className="w-4 h-4" />
              </Link>
            </Button>
          </ScrollReveal>
        </div>
      </section>
    </main>
  );
}
