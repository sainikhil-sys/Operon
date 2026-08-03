'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { toast } from 'sonner'
import {
  Brain, ArrowRight, Users, Bot, CheckSquare, TrendingUp, IndianRupee,
  BarChart3, ChevronDown, Star, Sparkles, Zap, Shield, Send, Loader2,
  Menu, X,
} from 'lucide-react'

const fadeUp = {
  initial: { opacity: 0, y: 30 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true, margin: '-50px' },
  transition: { duration: 0.6 },
}

const stagger = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
}

const features = [
  { icon: Users, title: 'Lead Generation', description: 'Capture, track, and nurture leads through your entire sales pipeline with smart automation.' },
  { icon: TrendingUp, title: 'Smart CRM', description: 'Manage customer relationships with detailed profiles, revenue tracking, and interaction history.' },
  { icon: CheckSquare, title: 'Task Management', description: 'Organize your workflow with priorities, due dates, and status tracking across your team.' },
  { icon: Bot, title: 'AI Assistant', description: 'Get intelligent business insights, follow-up drafts, and data-driven recommendations instantly.' },
  { icon: BarChart3, title: 'Revenue Analytics', description: 'Track monthly revenue, conversion rates, and growth trends with beautiful visual dashboards.' },
  { icon: Zap, title: 'Automation', description: 'Automate repetitive follow-ups, status updates, and notifications to save hours every week.' },
]

const testimonials = [
  { name: 'Priya Sharma', role: 'CEO, TechVista Solutions', content: 'Operon transformed how we manage our sales pipeline. Our conversion rate improved by 35% in the first quarter.', rating: 5 },
  { name: 'Rajesh Agarwal', role: 'Founder, ScaleWorks', content: 'The AI assistant alone saves us 10+ hours per week on follow-up emails and client communication.', rating: 5 },
  { name: 'Anita Desai', role: 'COO, CloudPeak', content: 'Finally a CRM that feels like it was built for Indian businesses. The INR dashboard and local integrations are perfect.', rating: 5 },
]

const faqs = [
  { q: 'What is Operon?', a: 'Operon is an AI-powered business growth platform that helps you generate leads, manage customers, automate follow-ups, and grow revenue — all from a single dashboard.' },
  { q: 'Is there a free trial?', a: 'Yes! You can sign up and explore all features with our free starter plan. No credit card required.' },
  { q: 'How does the AI Assistant work?', a: 'Our AI analyzes your business data to provide actionable insights, draft follow-up messages, suggest pipeline optimizations, and generate revenue forecasts.' },
  { q: 'Can I use Operon for my Indian business?', a: 'Absolutely. Operon is designed with Indian businesses in mind — INR currency support, local payment integrations via Razorpay, and Indian number formatting.' },
  { q: 'Is my data secure?', a: 'Yes. We use Supabase with Row Level Security, encrypted connections, and follow industry-standard security practices to protect your data.' },
]

export default function LandingPage() {
  const [mobileNav, setMobileNav] = useState(false)
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [contactEmail, setContactEmail] = useState('')
  const [submitting, setSubmitting] = useState(false)

  const handleContact = (e: React.FormEvent) => {
    e.preventDefault()
    if (!contactEmail.trim()) return
    setSubmitting(true)
    setTimeout(() => {
      setSubmitting(false)
      setContactEmail('')
      toast.success('Thanks! We\'ll be in touch soon.')
    }, 1000)
  }

  return (
    <div className="min-h-screen bg-background text-foreground antialiased">
      {/* ═══════ NAV ═══════ */}
      <header className="sticky top-0 z-50 border-b border-border/50 bg-background/80 backdrop-blur-xl">
        <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
              <Brain className="h-4.5 w-4.5" />
            </div>
            <span className="text-lg font-bold tracking-tight">Operon</span>
          </Link>

          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <a href="#features" className="hover:text-foreground transition-colors">Features</a>
            <a href="#preview" className="hover:text-foreground transition-colors">Preview</a>
            <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
            <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
          </nav>

          <div className="flex items-center gap-3">
            <Link href="/auth/login" className="hidden md:block">
              <Button variant="ghost" size="sm">Sign in</Button>
            </Link>
            <Link href="/auth/signup">
              <Button size="sm">Get Started</Button>
            </Link>
            <button
              className="md:hidden"
              onClick={() => setMobileNav(!mobileNav)}
              aria-expanded={mobileNav}
              aria-label={mobileNav ? "Close menu" : "Open menu"}
            >
              {mobileNav ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        {/* Mobile nav */}
        {mobileNav && (
          <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="md:hidden border-t border-border">
            <div className="px-4 py-4 space-y-3">
              <a href="#features" onClick={() => setMobileNav(false)} className="block text-sm py-2 text-muted-foreground hover:text-foreground">Features</a>
              <a href="#preview" onClick={() => setMobileNav(false)} className="block text-sm py-2 text-muted-foreground hover:text-foreground">Preview</a>
              <a href="#testimonials" onClick={() => setMobileNav(false)} className="block text-sm py-2 text-muted-foreground hover:text-foreground">Testimonials</a>
              <a href="#faq" onClick={() => setMobileNav(false)} className="block text-sm py-2 text-muted-foreground hover:text-foreground">FAQ</a>
              <Link href="/auth/login" className="block"><Button variant="outline" className="w-full">Sign in</Button></Link>
            </div>
          </motion.div>
        )}
      </header>

      {/* ═══════ HERO ═══════ */}
      <section className="relative overflow-hidden pt-20 pb-24 md:pt-32 md:pb-36">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-chart-2/5 rounded-full blur-3xl" />
        </div>

        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div {...fadeUp}>
            <Badge variant="secondary" className="mb-6 px-4 py-1.5 text-xs font-medium">
              <Sparkles className="h-3.5 w-3.5 mr-1.5" /> Now in Beta — Start for Free
            </Badge>
          </motion.div>

          <motion.h1 {...fadeUp} transition={{ duration: 0.6, delay: 0.1 }} className="mx-auto max-w-4xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl lg:text-7xl">
            Your AI-Powered{' '}
            <span className="bg-gradient-to-r from-primary via-chart-2 to-chart-3 bg-clip-text text-transparent">
              Growth Engine
            </span>
          </motion.h1>

          <motion.p {...fadeUp} transition={{ duration: 0.6, delay: 0.2 }} className="mx-auto mt-6 max-w-2xl text-lg text-muted-foreground leading-relaxed">
            Generate leads, automate sales, and grow your business with Operon.
            The complete platform for modern businesses to manage customers, track revenue, and make smarter decisions.
          </motion.p>

          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.3 }} className="mt-10 flex flex-wrap items-center justify-center gap-4">
            <Link href="/auth/signup">
              <Button size="lg" className="text-base px-8 h-12 rounded-xl gap-2">
                Get Started Free <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/dashboard">
              <Button variant="outline" size="lg" className="text-base px-8 h-12 rounded-xl">
                View Demo Dashboard
              </Button>
            </Link>
          </motion.div>

          {/* Trust indicators */}
          <motion.div {...fadeUp} transition={{ duration: 0.6, delay: 0.4 }} className="mt-12 flex flex-wrap items-center justify-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5"><Shield className="h-4 w-4" /> Secure by default</span>
            <span className="flex items-center gap-1.5"><IndianRupee className="h-4 w-4" /> Built for India</span>
            <span className="flex items-center gap-1.5"><Zap className="h-4 w-4" /> Setup in 2 minutes</span>
          </motion.div>
        </div>
      </section>

      {/* ═══════ PRODUCT OVERVIEW ═══════ */}
      <section className="py-20 border-t border-border/50">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 text-center max-w-3xl">
          <motion.div {...fadeUp}>
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">What is Operon</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Everything your business needs, in one place</h2>
            <p className="mt-4 text-muted-foreground leading-relaxed">
              Stop juggling between spreadsheets, CRMs, and communication tools. Operon unifies your entire business workflow into a single intelligent platform.
            </p>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FEATURES ═══════ */}
      <section id="features" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-16">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Features</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Powerful tools for ambitious teams</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {features.map((feature, i) => {
              const Icon = feature.icon
              return (
                <motion.div
                  key={feature.title}
                  {...stagger}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="p-6 h-full hover:shadow-lg hover:border-primary/20 transition-all duration-300 group">
                    <div className="rounded-lg bg-primary/10 w-10 h-10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <h3 className="font-semibold text-lg mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* ═══════ DASHBOARD PREVIEW ═══════ */}
      <section id="preview" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Dashboard Preview</p>
            <h2 className="text-3xl font-bold sm:text-4xl">A dashboard that works for you</h2>
            <p className="mt-4 text-muted-foreground max-w-2xl mx-auto">
              Beautiful analytics, real-time metrics, and actionable insights — all in a clean, modern interface.
            </p>
          </motion.div>

          <motion.div {...fadeUp} transition={{ duration: 0.7, delay: 0.2 }}>
            <div className="max-w-5xl mx-auto rounded-2xl border border-border bg-card overflow-hidden shadow-2xl shadow-black/10">
              {/* Mock browser chrome */}
              <div className="flex items-center gap-2 px-4 py-3 border-b border-border bg-muted/50">
                <div className="flex gap-1.5">
                  <div className="h-3 w-3 rounded-full bg-red-500/50" />
                  <div className="h-3 w-3 rounded-full bg-amber-500/50" />
                  <div className="h-3 w-3 rounded-full bg-emerald-500/50" />
                </div>
                <div className="flex-1 text-center text-xs text-muted-foreground font-mono">app.operon.ai/dashboard</div>
              </div>

              {/* Dashboard mockup */}
              <div className="p-6 space-y-4">
                {/* Stat cards row */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                  {[
                    { label: 'Total Leads', value: '10', color: 'text-blue-500' },
                    { label: 'Active Customers', value: '5', color: 'text-emerald-500' },
                    { label: 'Conversion Rate', value: '20%', color: 'text-purple-500' },
                    { label: 'Monthly Revenue', value: '₹7,80,000', color: 'text-amber-500' },
                  ].map((stat) => (
                    <div key={stat.label} className="rounded-lg border border-border p-3">
                      <p className="text-[10px] text-muted-foreground">{stat.label}</p>
                      <p className={`text-lg font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                    </div>
                  ))}
                </div>

                {/* Chart placeholder */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="rounded-lg border border-border p-4 h-32 flex items-end gap-2">
                    {[40, 55, 45, 65, 75, 95].map((h, i) => (
                      <div key={i} className="flex-1 bg-primary/30 rounded-t" style={{ height: `${h}%` }} />
                    ))}
                  </div>
                  <div className="rounded-lg border border-border p-4 h-32 flex items-end gap-2">
                    {[30, 50, 35, 60, 70, 55].map((h, i) => (
                      <div key={i} className="flex-1 rounded-t" style={{ height: `${h}%`, backgroundColor: i % 3 === 0 ? 'oklch(0.65 0.2 160 / 30%)' : i % 3 === 1 ? 'oklch(0.7 0.2 230 / 30%)' : 'oklch(0.7 0.2 25 / 30%)' }} />
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* ═══════ TESTIMONIALS ═══════ */}
      <section id="testimonials" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">Testimonials</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Loved by growing businesses</h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {testimonials.map((t, i) => (
              <motion.div key={t.name} {...stagger} transition={{ duration: 0.5, delay: i * 0.1 }}>
                <Card className="p-6 h-full">
                  <div className="flex gap-0.5 mb-4">
                    {Array.from({ length: t.rating }).map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-amber-500 text-amber-500" />
                    ))}
                  </div>
                  <p className="text-sm leading-relaxed text-muted-foreground mb-4">&ldquo;{t.content}&rdquo;</p>
                  <div className="border-t border-border pt-4">
                    <p className="font-semibold text-sm">{t.name}</p>
                    <p className="text-xs text-muted-foreground">{t.role}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ FAQ ═══════ */}
      <section id="faq" className="py-20">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-3xl">
          <motion.div {...fadeUp} className="text-center mb-12">
            <p className="text-xs font-semibold text-primary uppercase tracking-widest mb-4">FAQ</p>
            <h2 className="text-3xl font-bold sm:text-4xl">Frequently asked questions</h2>
          </motion.div>

          <div className="space-y-3">
            {faqs.map((faq, i) => (
              <motion.div key={i} {...stagger} transition={{ duration: 0.4, delay: i * 0.08 }}>
                <button
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full text-left rounded-xl border border-border bg-card p-4 hover:bg-accent/50 transition-colors"
                >
                  <div className="flex items-center justify-between gap-4">
                    <span className="font-medium">{faq.q}</span>
                    <ChevronDown className={`h-4 w-4 shrink-0 text-muted-foreground transition-transform ${openFaq === i ? 'rotate-180' : ''}`} />
                  </div>
                  {openFaq === i && (
                    <motion.p
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      className="mt-3 text-sm text-muted-foreground leading-relaxed"
                    >
                      {faq.a}
                    </motion.p>
                  )}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* ═══════ CONTACT / CTA ═══════ */}
      <section id="contact" className="py-20 bg-muted/30">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8 max-w-2xl text-center">
          <motion.div {...fadeUp} className="space-y-6">
            <h2 className="text-3xl font-bold sm:text-4xl">Ready to grow your business?</h2>
            <p className="text-muted-foreground leading-relaxed">
              Join hundreds of businesses already using Operon to streamline operations and boost revenue.
            </p>

            <form onSubmit={handleContact} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
              <Input
                id="contact-email"
                type="email"
                placeholder="Enter your email"
                value={contactEmail}
                onChange={(e) => setContactEmail(e.target.value)}
                required
                className="h-12"
              />
              <Button type="submit" disabled={submitting} className="h-12 px-6 shrink-0 gap-2">
                {submitting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
                Get Started
              </Button>
            </form>
          </motion.div>
        </div>
      </section>

      {/* ═══════ FOOTER ═══════ */}
      <footer className="border-t border-border py-12">
        <div className="container mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div className="flex items-center gap-2.5">
              <div className="flex h-7 w-7 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                <Brain className="h-4 w-4" />
              </div>
              <span className="font-bold">Operon</span>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground">
              <a href="#features" className="hover:text-foreground transition-colors">Features</a>
              <a href="#testimonials" className="hover:text-foreground transition-colors">Testimonials</a>
              <a href="#faq" className="hover:text-foreground transition-colors">FAQ</a>
              <a href="#contact" className="hover:text-foreground transition-colors">Contact</a>
            </div>

            <p className="text-xs text-muted-foreground">© 2026 Operon. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  )
}
