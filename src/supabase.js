import { createClient } from '@supabase/supabase-js'

// 1. Raw backend server setup
const rawUrl = 'http://187.127.136.249:8000'

// 2. Check if we are live on Vercel (HTTPS production environment)
const isProduction = typeof window !== 'undefined' && window.location.protocol === 'https:'

/* 3. If production, route requests through an allorigins HTTPS proxy.
      This satisfies Vercel's strict HTTPS rules while still letting your app 
      talk to your raw HTTP server.
*/
const supabaseUrl = isProduction 
  ? `https://api.allorigins.win/raw?url=${encodeURIComponent(rawUrl)}`
  : rawUrl

// Your unchanged global anon key
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgwMzk0NDk4LCJleHAiOjE5MzgwNzQ0OTh9.IcpCz0KGtKLeevKQ83SkaWMnPfJHIy_E66zU__7pn4w'

export const supabase = createClient(supabaseUrl, supabaseKey)