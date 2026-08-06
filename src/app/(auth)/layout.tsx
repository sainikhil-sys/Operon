import { OperonLogo } from '@/components/brand/operon-logo'
import Link from 'next/link'

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="relative min-h-screen flex items-center justify-center bg-background">
      {/* Background decorations */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-primary/5 rounded-full blur-3xl" />
        <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-chart-2/5 rounded-full blur-3xl" />
      </div>

      <div className="relative z-10 w-full max-w-md mx-auto px-4 py-12">
        {/* Logo */}
        <Link
          href="/"
          className="flex flex-col items-center justify-center gap-1 mb-8 group"
        >
          <OperonLogo className="h-9 w-auto" />
          <span className="text-xs font-mono text-[rgba(255,255,255,0.65)] tracking-wider">
            Powered by CogniQA Systems
          </span>
        </Link>

        {children}
      </div>
    </div>
  )
}
