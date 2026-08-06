'use client'

import { motion } from 'framer-motion'
import { ShieldCheck, LockKey, Eye, Key } from '@phosphor-icons/react'
import type { Icon } from '@phosphor-icons/react'

interface SecurityFeature {
  title: string
  desc: string
  icon: Icon
}

const securityFeatures: SecurityFeature[] = [
  { title: 'AES-256-GCM Encryption', desc: 'All user-supplied API keys, OAuth tokens, and database secrets are encrypted at rest with hardware keys.', icon: LockKey },
  { title: 'Row-Level Security', desc: 'Strict Supabase Postgres RLS policies enforce multi-tenant organization boundaries across every query.', icon: ShieldCheck },
  { title: 'Immutable Audit Trail', desc: 'Every mutation, configuration change, and API invocation logs to an immutable security audit trail.', icon: Eye },
  { title: 'Hashed API Keys & RBAC', desc: 'REST API authentication uses hashed keys with granular role-based access control per organization.', icon: Key },
]

export function EnterpriseSecuritySection() {
  return (
    <section id="security" className="py-32 bg-[#090A0C] relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-20">
          <span className="text-caption font-mono text-[#3FA37C] uppercase tracking-widest block mb-3">
            Enterprise Security
          </span>
          <h2 className="text-h2 text-[#F8FAFC] font-heading leading-tight">
            Security Built for Fortune 500.{' '}
            <span className="text-[#94A3B8]">Zero Trust Architecture.</span>
          </h2>
        </div>

        {/* Security Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {securityFeatures.map((item, i) => {
            const Icon = item.icon
            return (
              <motion.div
                key={item.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.08, duration: 0.4 }}
                className="p-6 rounded-2xl bg-[#121519] border border-[rgba(255,255,255,0.08)] hover:border-[#3FA37C]/30 transition-colors duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="p-2.5 rounded-xl bg-[#090A0C] text-[#3FA37C] w-fit mb-5">
                    <Icon size={22} />
                  </div>
                  <h4 className="text-base font-semibold text-[#F8FAFC] font-body mb-2">{item.title}</h4>
                  <p className="text-sm text-[#94A3B8] leading-relaxed font-body">{item.desc}</p>
                </div>

                <div className="mt-6 pt-4 border-t border-[rgba(255,255,255,0.08)] text-caption font-mono text-[#3FA37C]">
                  SOC2 Type II Compliant
                </div>
              </motion.div>
            )
          })}
        </div>
      </div>
    </section>
  )
}
