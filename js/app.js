// Arquivo principal da aplicação

// Inicializar a aplicação quando o DOM estiver carregado
document.addEventListener("DOMContentLoaded", () => {
  // Verificar se o usuário está autenticado
  window
    .getCurrentSession()
    .then((result) => {
      if (result.success && result.user) {
        // Usuário autenticado, redirecionar para o dashboard
        window.navigateTo("dashboard")
      } else {
        // Usuário não autenticado, redirecionar para o login
        window.navigateTo("login")
      }
    })
    .catch((error) => {
      console.error("Erro ao verificar sessão:", error)
      window.navigateTo("login")
    })
})

// Definir limites do plano gratuito no escopo global
window.FREE_PLAN_LIMITS = {
  MAX_CLIENTS: 5,
  MAX_SESSIONS_PER_CLIENT: 2,
}

// Função global para verificar limites do plano
window.checkPlanLimits = async (coachId) => {
  try {
    // Verificar número de clientes
    const { data: clients, error: clientsError } = await window.supabase
      .from("clientes")
      .select("id")
      .eq("coach_id", coachId)

    if (clientsError) throw clientsError

    const clientCount = clients.length

    if (clientCount >= window.FREE_PLAN_LIMITS.MAX_CLIENTS) {
      return {
        limitReached: true,
        type: "clients",
        message: `Você atingiu o limite de ${window.FREE_PLAN_LIMITS.MAX_CLIENTS} clientes do plano gratuito.`,
      }
    }

    // Verificar sessões por cliente
    for (const client of clients) {
      const { data: sessions, error: sessionsError } = await window.supabase
        .from("sessoes")
        .select("id")
        .eq("cliente_id", client.id)

      if (sessionsError) throw sessionsError

      if (sessions.length >= window.FREE_PLAN_LIMITS.MAX_SESSIONS_PER_CLIENT) {
        return {
          limitReached: true,
          type: "sessions",
          clientId: client.id,
          message: `Você atingiu o limite de ${window.FREE_PLAN_LIMITS.MAX_SESSIONS_PER_CLIENT} sessões por cliente do plano gratuito.`,
        }
      }
    }

    return { limitReached: false }
  } catch (error) {
    console.error("Erro ao verificar limites do plano:", error)
    return { limitReached: false }
  }
}
