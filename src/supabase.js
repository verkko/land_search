import { createClient } from '@supabase/supabase-js'

// Your raw backend setup
const rawUrl = 'http://187.127.136.249:8000'

// Detect production Vercel environment
const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:'

/* Using a proxy server that handles custom headers (like apikey) correctly 
  to satisfy both browser HTTPS requirements and CORS constraints.
*/
const supabaseUrl = isProduction 
  ? `https://corsproxy.io/?${encodeURIComponent(rawUrl)}`
  : rawUrl

// Your global project anon key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgwMzk0NDk4LCJleHAiOjE5MzgwNzQ0OTh9.IcpCz0KGtKLeevKQ83SkaWMnPfJHIy_E66zU__7pn4w'

export const supabase = createClient(supabaseUrl, supabaseKey)