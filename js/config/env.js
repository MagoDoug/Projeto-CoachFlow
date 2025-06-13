// Carregamento de variáveis de ambiente para o cliente

// Função para carregar variáveis de ambiente
function loadEnvironmentVariables() {
  try {
    console.log("🔧 Carregando variáveis de ambiente...")

    // As variáveis já foram injetadas no HTML via script inline
    // Apenas verificar se estão disponíveis

    console.log("📧 Variáveis EmailJS:")
    console.log("- Service ID:", window.EMAILJS_SERVICE_ID ? "✅ Configurado" : "❌ Não encontrado")
    console.log("- Public Key:", window.EMAILJS_PUBLIC_KEY ? "✅ Configurado" : "❌ Não encontrado")

    console.log("🗄️ Variáveis Supabase:")
    console.log("- URL:", window.SUPABASE_URL ? "✅ Configurado" : "❌ Não encontrado")
    console.log("- Anon Key:", window.SUPABASE_ANON_KEY ? "✅ Configurado" : "❌ Não encontrado")

    return true
  } catch (error) {
    console.warn("⚠️ Erro ao verificar variáveis de ambiente:", error)
    return false
  }
}

// Carregar variáveis imediatamente
loadEnvironmentVariables()

// Exportar função para uso global
window.loadEnvironmentVariables = loadEnvironmentVariables
