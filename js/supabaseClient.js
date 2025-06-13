// Cliente Supabase centralizado
const SUPABASE_URL = "https://woukxaakahobdmxzvlox.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdWt4YWFrYWhvYmRteHp2bG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjcwNjgsImV4cCI6MjA2NTM0MzA2OH0.avNn6iG6YJ69F5jv305vgJz6u3Hg4cksjmRiiekap_A"
const supabaseClient = require("supabase-js") // Declare the variable before using it

// Inicializar o cliente Supabase (apenas uma vez)
const supabase = supabaseClient.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Exportar para o escopo global
window.supabase = supabase
window.SUPABASE_URL = SUPABASE_URL
window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY
