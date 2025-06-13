// Carregamento de variáveis de ambiente para o cliente

// Função para carregar variáveis de ambiente
function loadEnvironmentVariables() {
  try {
    // Tentar carregar as variáveis de ambiente do Vercel/servidor
    // Em produção, essas variáveis serão injetadas pelo servidor

    // EmailJS
    const EMAILJS_SERVICE_ID = process.env.EMAILJS_SERVICE_ID
    const EMAILJS_PUBLIC_KEY = process.env.EMAILJS_PUBLIC_KEY

    if (typeof EMAILJS_SERVICE_ID !== "undefined") {
      window.EMAILJS_SERVICE_ID = EMAILJS_SERVICE_ID
    }

    if (typeof EMAILJS_PUBLIC_KEY !== "undefined") {
      window.EMAILJS_PUBLIC_KEY = EMAILJS_PUBLIC_KEY
    }

    // Supabase (já carregadas em supabaseClient.js)
    const SUPABASE_URL = process.env.SUPABASE_URL
    const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY

    if (typeof SUPABASE_URL !== "undefined") {
      window.SUPABASE_URL = SUPABASE_URL
    }

    if (typeof SUPABASE_ANON_KEY !== "undefined") {
      window.SUPABASE_ANON_KEY = SUPABASE_ANON_KEY
    }

    console.log("🔧 Variáveis de ambiente carregadas:")
    console.log("- EmailJS Service ID:", window.EMAILJS_SERVICE_ID ? "✅ Configurado" : "❌ Não encontrado")
    console.log("- EmailJS Public Key:", window.EMAILJS_PUBLIC_KEY ? "✅ Configurado" : "❌ Não encontrado")
    console.log("- Supabase URL:", window.SUPABASE_URL ? "✅ Configurado" : "❌ Não encontrado")
    console.log("- Supabase Anon Key:", window.SUPABASE_ANON_KEY ? "✅ Configurado" : "❌ Não encontrado")
  } catch (error) {
    console.warn("Erro ao carregar variáveis de ambiente:", error)
  }
}

// Carregar variáveis imediatamente
loadEnvironmentVariables()

// Exportar função para uso global
window.loadEnvironmentVariables = loadEnvironmentVariables
