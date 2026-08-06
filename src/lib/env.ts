import { z } from 'zod';

const envSchema = z.object({
  // Core Application
  NEXT_PUBLIC_SITE_URL: z.string().url('NEXT_PUBLIC_SITE_URL must be a valid URL').optional().default('https://operon.cogniqa.systems'),
  NEXT_PUBLIC_APP_URL: z.string().url('NEXT_PUBLIC_APP_URL must be a valid URL').optional().default('https://operon.cogniqa.systems'),

  // Supabase (Database & Authentication)
  NEXT_PUBLIC_SUPABASE_URL: z.string().url('NEXT_PUBLIC_SUPABASE_URL must be a valid URL').optional(),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z.string().optional(),
  NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY: z.string().optional(),
  SUPABASE_SERVICE_ROLE_KEY: z.string().optional(),


  // Razorpay Payment Integration
  NEXT_PUBLIC_RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_ID: z.string().optional(),
  RAZORPAY_KEY_SECRET: z.string().optional(),
  RAZORPAY_WEBHOOK_SECRET: z.string().optional(),

  // Groq AI Integration
  GROQ_API_KEY: z.string().optional(),

});

function parseEnv() {
  const result = envSchema.safeParse(process.env);

  if (!result.success) {
    const formattedErrors = result.error.format();
    const missingKeys = Object.entries(formattedErrors)
      .filter(([key, value]) => key !== '_errors' && Array.isArray((value as { _errors?: string[] })._errors) && (value as { _errors: string[] })._errors.length > 0)
      .map(([key, value]) => `  - ${key}: ${(value as { _errors: string[] })._errors.join(', ')}`);

    const errorMessage = `❌ Invalid environment variables:\n${missingKeys.join('\n')}\n\nPlease check your .env.local file against .env.example.`;

    if (process.env.NODE_ENV === 'production') {
      console.error(errorMessage);
    } else {
      console.warn(errorMessage);
    }
    return process.env as unknown as z.infer<typeof envSchema>;
  }

  return result.data;
}

export const env = parseEnv();
