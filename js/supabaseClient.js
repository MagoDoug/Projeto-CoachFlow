// Cliente Supabase centralizado
const SUPABASE_URL = "https://woukxaakahobdmxzvlox.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdWt4YWFrYWhvYmRteHp2bG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjcwNjgsImV4cCI6MjA2NTM0MzA2OH0.avNn6iG6YJ69F5jv305vgJz6u3Hg4cksjmRiiekap_A"

// Aguardar o carregamento do Supabase
document.addEventListener("DOMContentLoaded", () => {
  // Verificar se o Supabase está disponível
  if (typeof window.supabase !== "undefined" && window.supabase.createClient) {
    // Inicializar o cliente Supabase
    window.supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

    // Disponibilizar globalmente
    window.SUPABASE_URL = SUPABASE_URL
    window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY

    console.log("Supabase inicializado com sucesso")
  } else {
    console.error("Supabase não está disponível")
  }
})
