// Arquivo principal da aplicação

// Aguardar o carregamento completo
document.addEventListener("DOMContentLoaded", () => {
  // Aguardar um pouco para garantir que o Supabase foi inicializado
  setTimeout(() => {
    // Verificar se o usuário está autenticado
    if (typeof window.getCurrentSession === "function") {
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
    } else {
      console.error("getCurrentSession não está disponível")
      window.navigateTo("login")
    }
  }, 1000)
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
    const { data: clients, error: clientsError } = await window.supabaseInstance
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
      const { data: sessions, error: sessionsError } = await window.supabaseInstance
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

// Função global para mostrar notificações
window.showNotification = (message, type = "info") => {
  const notification = document.createElement("div")
  notification.className = `notification ${type}`
  notification.innerHTML = `
    <div class="flex items-center">
      <div class="mr-3">
        ${
          type === "success"
            ? '<i class="fas fa-check-circle text-green-500"></i>'
            : type === "error"
              ? '<i class="fas fa-exclamation-circle text-red-500"></i>'
              : '<i class="fas fa-info-circle text-blue-500"></i>'
        }
      </div>
      <div>
        <p>${message}</p>
      </div>
      <div class="ml-auto cursor-pointer" onclick="this.parentElement.parentElement.remove()">
        <i class="fas fa-times"></i>
      </div>
    </div>
  `
  document.body.appendChild(notification)

  // Remover após 5 segundos
  setTimeout(() => {
    notification.remove()
  }, 5000)
}

// Função global para navegação
window.navigateTo = (page) => {
  const appContainer = document.getElementById("app")
  appContainer.innerHTML =
    '<div id="loading" class="flex items-center justify-center h-screen"><div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>'

  setTimeout(() => {
    switch (page) {
      case "login":
        window.renderLoginPage()
        break
      case "register":
        window.renderRegisterPage()
        break
      case "dashboard":
        window.renderDashboard()
        break
      case "clients":
        window.renderClientsPage()
        break
      case "sessions":
        window.renderSessionsPage()
        break
      case "feedback":
        window.renderFeedbackPage()
        break
      case "profile":
        window.renderProfilePage()
        break
      default:
        window.renderLoginPage()
    }
  }, 300)
}
