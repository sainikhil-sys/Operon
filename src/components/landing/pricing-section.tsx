'use client'

import { useState } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Check, ArrowRight } from '@phosphor-icons/react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

const plans = [
  {
    name: 'Starter',
    priceMonthly: '₹0',
    priceAnnual: '₹0',
    desc: 'For early startups and individual founders.',
    features: [
      'Up to 3 repositories',
      '500 AI agent actions/mo',
      'Basic sales telemetry',
      'Community support',
    ],
    cta: 'Start free',
    popular: false,
  },
  {
    name: 'Pro',
    priceMonthly: '₹4,999',
    priceAnnual: '₹3,999',
    desc: 'For growing companies scaling multi-department operations.',
    features: [
      'Unlimited repositories',
      '50,000 AI agent actions/mo',
      'Full 6-pillar neural OS',
      'pgvector semantic search',
      'Stripe automated reconciliation',
      'Priority support',
    ],
    cta: 'Get started',
    popular: true,
  },
  {
    name: 'Enterprise',
    priceMonthly: 'Custom',
    priceAnnual: 'Custom',
    desc: 'For organizations requiring dedicated infrastructure.',
    features: [
      'Dedicated VPC deployment',
      'Unlimited AI actions',
      'SSO / SAML & RBAC',
      'Dedicated solutions architect',
      'Custom LLM fine-tuning',
    ],
    cta: 'Contact sales',
    popular: false,
  },
]

export function PricingSection() {
  const [annual, setAnnual] = useState(true)

  return (
    <section id="pricing" className="py-32 bg-[#11161B] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-caption font-mono text-[#46D296] uppercase tracking-widest block mb-3">
            Pricing
          </span>
          <h2 className="heading-section text-[#FFFFFF]">
            Transparent Pricing{' '}
            <span className="text-[rgba(255,255,255,0.45)]">For Ambitious Teams</span>
          </h2>

          {/* Billing Toggle */}
          <div className="mt-8 flex items-center justify-center gap-3">
            <span className={`text-sm font-body ${!annual ? 'text-[#FFFFFF] font-medium' : 'text-[rgba(255,255,255,0.45)]'}`}>Monthly</span>
            <button
              onClick={() => setAnnual(!annual)}
              className="w-12 h-6 rounded-full bg-[#090909] p-1 relative transition-colors border border-[rgba(255,255,255,0.06)]"
            >
              <div className={`w-4 h-4 rounded-full bg-[#46D296] transition-transform ${annual ? 'translate-x-6' : 'translate-x-0'}`} />
            </button>
            <span className={`text-sm font-body ${annual ? 'text-[#FFFFFF] font-medium' : 'text-[rgba(255,255,255,0.45)]'}`}>
              Annual{' '}
              <Badge variant="outline" className="ml-1 border-[#46D296]/30 bg-[#46D296]/10 text-[#46D296] text-caption font-mono">
                Save 20%
              </Badge>
            </span>
          </div>
        </div>

        {/* Pricing Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto">
          {plans.map((plan, i) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.08, duration: 0.4 }}
              className={`p-8 rounded-2xl flex flex-col justify-between relative ${
                plan.popular
                  ? 'bg-[#000000] border border-[#46D296]/40'
                  : 'bg-[#000000] border border-[rgba(255,255,255,0.06)]'
              }`}
            >
              {plan.popular && (
                <Badge className="absolute -top-3 left-1/2 -translate-x-1/2 bg-[#46D296] text-[#FFFFFF] font-medium px-3 py-1 text-caption font-body">
                  Most Popular
                </Badge>
              )}

              <div>
                <h3 className="text-lg font-semibold text-[#FFFFFF] font-body">{plan.name}</h3>
                <p className="text-sm text-[rgba(255,255,255,0.45)] font-body mt-2 min-h-[40px]">{plan.desc}</p>

                <div className="my-8">
                  <span className="text-4xl font-bold text-[#FFFFFF] font-mono">
                    {annual ? plan.priceAnnual : plan.priceMonthly}
                  </span>
                  {plan.priceMonthly !== 'Custom' && (
                    <span className="text-sm text-[rgba(255,255,255,0.45)] font-body ml-1">/ month</span>
                  )}
                </div>

                <div className="space-y-3 pt-6 border-t border-[rgba(255,255,255,0.06)] text-sm font-body text-[rgba(255,255,255,0.72)]">
                  {plan.features.map((feat, idx) => (
                    <div key={idx} className="flex items-start gap-2.5">
                      <Check size={16} className="text-[#46D296] shrink-0 mt-0.5" weight="bold" />
                      <span>{feat}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Link href="/auth/signup" className="w-full block">
                  <Button
                    className={`w-full h-11 text-sm font-medium font-body rounded-xl gap-2 ${
                      plan.popular
                        ? 'bg-[#46D296] hover:bg-[#5BE3A8] text-[#FFFFFF]'
                        : 'bg-[#090909] hover:bg-[#111111] text-[#FFFFFF] border border-[rgba(255,255,255,0.06)]'
                    }`}
                  >
                    {plan.cta} <ArrowRight size={14} />
                  </Button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  )
}
