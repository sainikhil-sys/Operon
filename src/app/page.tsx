'use client'

import { useState } from 'react'
import { LandingNavbar } from '@/components/landing/landing-navbar'
import { HeroSection } from '@/components/landing/hero-section'
import { TrustedBy } from '@/components/landing/trusted-by'
import { ProblemSection } from '@/components/landing/problem-section'
import { SolutionSection } from '@/components/landing/solution-section'
import { AIAgentsSection } from '@/components/landing/ai-agents-section'
import { MissionControlPreview } from '@/components/landing/mission-control-preview'
import { AutomationBuilderSection } from '@/components/landing/automation-builder-section'
import { KnowledgeEngineSection } from '@/components/landing/knowledge-engine-section'
import { EnterpriseSecuritySection } from '@/components/landing/enterprise-security'
import { IntegrationMesh } from '@/components/landing/integration-mesh'
import { TestimonialsSection } from '@/components/landing/testimonials-section'
import { PricingSection } from '@/components/landing/pricing-section'
import { FAQSection } from '@/components/landing/faq-section'
import { LandingFooter } from '@/components/landing/landing-footer'
import { CommandPalette } from '@/components/dashboard/command-palette'

export default function LandingPage() {
  const [commandOpen, setCommandOpen] = useState(false)

  return (
    <div className="min-h-screen bg-[#050608] text-[#F8FAFC] antialiased font-body selection:bg-[#3FA37C]/25 selection:text-[#F8FAFC]">
      {/* Raycast Command Palette Modal */}
      <CommandPalette open={commandOpen} onOpenChange={setCommandOpen} />

      {/* 1. Navbar */}
      <LandingNavbar onOpenCommand={() => setCommandOpen(true)} />

      {/* 2. Hero Section with GSAP Text Reveal & Interactive Preview */}
      <HeroSection />

      {/* 3. Trusted By Logo Marquee */}
      <TrustedBy />

      {/* 4. Problem Section: Disconnected SaaS Chaos vs Operon AI OS */}
      <ProblemSection />

      {/* 5. Solution Section: 6 Core OS Pillars */}
      <SolutionSection />

      {/* 6. Autonomous AI Specialist Workforce with CEO Agent Header */}
      <AIAgentsSection />

      {/* 7. Interactive Mission Control Preview */}
      <MissionControlPreview />

      {/* 8. Visual Automation Workflow Builder */}
      <AutomationBuilderSection />

      {/* 9. pgvector HNSW Knowledge Engine */}
      <KnowledgeEngineSection />

      {/* 10. Enterprise Compliance & Security */}
      <EnterpriseSecuritySection />

      {/* 11. Integration Mesh */}
      <IntegrationMesh />

      {/* 12. Executive Testimonials */}
      <TestimonialsSection />

      {/* 13. Transparent Pricing Matrix */}
      <PricingSection />

      {/* 14. Accordion FAQ */}
      <FAQSection />

      {/* 15. Executive Brand Footer */}
      <LandingFooter />
    </div>
  )
}
