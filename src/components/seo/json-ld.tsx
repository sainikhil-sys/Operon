import React from 'react'

/**
 * Enterprise Structured Data (JSON-LD) Component
 * Encodes schema.org specifications for Organization, SoftwareApplication,
 * WebSite, Product, Offer, Brand, and FAQPage.
 */
export function JsonLd() {
  const baseUrl = 'https://operon.cogniqa.systems'

  // Organization Schema (CogniQA Systems - Parent Brand)
  const organizationSchema = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    '@id': 'https://cogniqa.systems/#organization',
    name: 'CogniQA Systems',
    url: 'https://cogniqa.systems',
    logo: `${baseUrl}/logo.svg`,
    sameAs: [
      'https://github.com/sainikhil-sys/Operon',
      'https://twitter.com/cogniqa',
      'https://linkedin.com/company/cogniqa-systems',
    ],
    knowsAbout: [
      'Enterprise AI',
      'Artificial Intelligence Operating Systems',
      'Autonomous AI Agents',
      'pgvector HNSW Semantic Search',
      'RAG Systems',
    ],
  }

  // SoftwareApplication / Product Schema (Operon)
  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    '@id': `${baseUrl}/#softwareapplication`,
    name: 'Operon',
    operatingSystem: 'Web, Cloud, Enterprise Linux, macOS, Windows',
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Enterprise AI Operating System',
    description:
      'Operon is an Enterprise AI Operating System developed by CogniQA Systems. Unify Sales, Finance, Engineering, Operations, and Knowledge into a single neural core powered by autonomous AI agents.',
    url: baseUrl,
    publisher: {
      '@type': 'Organization',
      name: 'CogniQA Systems',
      url: 'https://cogniqa.systems',
    },
    brand: {
      '@type': 'Brand',
      name: 'Operon',
      logo: `${baseUrl}/logo.svg`,
    },
    offers: {
      '@type': 'AggregateOffer',
      priceCurrency: 'USD',
      lowPrice: '0',
      highPrice: '499',
      offerCount: '3',
      offers: [
        {
          '@type': 'Offer',
          name: 'Developer Free',
          price: '0',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Enterprise Pro',
          price: '49',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
        {
          '@type': 'Offer',
          name: 'Custom Mission Control',
          price: '499',
          priceCurrency: 'USD',
          availability: 'https://schema.org/InStock',
        },
      ],
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '128',
      reviewCount: '128',
    },
    featureList: [
      'Autonomous AI Agent Cluster',
      'pgvector HNSW Semantic Vector Search',
      'Real-time Business Telemetry Stream',
      'Stripe & GitHub Integration Mesh',
      'Multi-Tenant Row Level Security (RLS)',
      'Raycast-style Command Palette (Cmd+K)',
    ],
  }

  // WebSite Schema + SearchAction
  const websiteSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    '@id': `${baseUrl}/#website`,
    url: baseUrl,
    name: 'Operon — Enterprise AI Operating System',
    description: 'The Enterprise AI Operating Layer For Modern Organizations.',
    publisher: {
      '@type': 'Organization',
      name: 'CogniQA Systems',
    },
    potentialAction: {
      '@type': 'SearchAction',
      target: {
        '@type': 'EntryPoint',
        urlTemplate: `${baseUrl}/knowledge?q={search_term_string}`,
      },
      'query-input': 'required name=search_term_string',
    },
  }

  // FAQPage Schema
  const faqSchema = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: [
      {
        '@type': 'Question',
        name: 'What is Operon?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Operon is an Enterprise AI Operating System developed by CogniQA Systems. It unifies Sales, Finance, Engineering, Operations, and Knowledge into a single neural core with autonomous AI agents.',
        },
      },
      {
        '@type': 'Question',
        name: 'How does Operon enforce enterprise security?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Operon uses PostgreSQL Row Level Security (RLS), SOC2 Type II compliance standards, encrypted API key vaults, and multi-tenant organization isolation.',
        },
      },
      {
        '@type': 'Question',
        name: 'Which AI models and vector databases does Operon support?',
        acceptedAnswer: {
          '@type': 'Answer',
          text: 'Operon natively integrates Supabase pgvector HNSW indexing, OpenAI, Anthropic Claude, Google Gemini, DeepSeek, Groq, and self-hosted Ollama models.',
        },
      },
    ],
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(softwareAppSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(websiteSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(faqSchema) }}
      />
    </>
  )
}
