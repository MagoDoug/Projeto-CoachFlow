// Cliente Supabase centralizado
const SUPABASE_URL = "https://woukxaakahobdmxzvlox.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdWt4YWFrYWhvYmRteHp2bG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjcwNjgsImV4cCI6MjA2NTM0MzA2OH0.avNn6iG6YJ69F5jv305vgJz6u3Hg4cksjmRiiekap_A"

// Função para inicializar o Supabase
function initializeSupabase() {
  try {
    if (typeof window.supabase !== "undefined" && window.supabase.createClient) {
      // Inicializar o cliente Supabase
      window.supabaseInstance = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

      // Disponibilizar globalmente
      window.SUPABASE_URL = SUPABASE_URL
      window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY

      console.log("Supabase inicializado com sucesso")

      // Adicionar uma função de verificação
      window.checkSupabaseConnection = async () => {
        try {
          const { data, error } = await window.supabaseInstance
            .from("coaches")
            .select("count", { count: "exact", head: true })
          console.log("Conexão com Supabase OK")
          return true
        } catch (error) {
          console.error("Erro na conexão com Supabase:", error)
          return false
        }
      }

      return true
    } else {
      console.error("Supabase não está disponível")
      return false
    }
  } catch (error) {
    console.error("Erro ao inicializar Supabase:", error)
    return false
  }
}

// Aguardar o carregamento completo
document.addEventListener("DOMContentLoaded", () => {
  // Tentar inicializar imediatamente
  if (!initializeSupabase()) {
    // Se falhar, tentar novamente após um delay
    setTimeout(() => {
      initializeSupabase()
    }, 1000)
  }
})
