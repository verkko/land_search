import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
'http://187.127.136.249:8000'

const supabaseKey =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJyb2xlIjoiYW5vbiIsImlzcyI6InN1cGFiYXNlIiwiaWF0IjoxNzgwMzk0NDk4LCJleHAiOjE5MzgwNzQ0OTh9.IcpCz0KGtKLeevKQ83SkaWMnPfJHIy_E66zU__7pn4w'

export const supabase =
createClient(
  supabaseUrl,
  supabaseKey
)