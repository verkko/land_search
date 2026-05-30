import { createClient } from '@supabase/supabase-js'

const supabaseUrl =
'https://luiyjklelpkogcdhtrzi.supabase.co'

const supabaseKey =
'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imx1aXlqa2xlbHBrb2djZGh0cnppIiwicm9sZSI6ImFub24iLCJpYXQiOjE3MzE5NDY5ODksImV4cCI6MjA0NzUyMjk4OX0.jjM2S0C8mQy0BMTRcS5vIvrWKKmI26X2fpq0fbV7DlE'

export const supabase =
createClient(
  supabaseUrl,
  supabaseKey
)