import { createClient } from '@supabase/supabase-js'

// Base IP setup
const baseIP = '187.127.136.249:8000'

/* Vercel enforces HTTPS. Browsers block unencrypted HTTP requests from HTTPS sites.
  This checks if the app is live on Vercel and automatically updates the protocol.
*/
const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:'
const supabaseUrl = isProduction ? `https://${baseIP}` : `http://${baseIP}`

// Your global project anon key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgwMzk0NDk4LCJleHAiOjE5MzgwNzQ0OTh9.IcpCz0KGtKLeevKQ83SkaWMnPfJHIy_E66zU__7pn4w'

export const supabase = createClient(supabaseUrl, supabaseKey)