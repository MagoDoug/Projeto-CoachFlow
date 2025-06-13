// Funções utilitárias

// Formatar data
function formatDate(dateString) {
  const options = { year: "numeric", month: "long", day: "numeric" }
  return new Date(dateString).toLocaleDateString("pt-BR", options)
}

// Formatar hora
function formatTime(dateString) {
  const options = { hour: "2-digit", minute: "2-digit" }
  return new Date(dateString).toLocaleTimeString("pt-BR", options)
}

// Mostrar notificação
function showNotification(message, type = "info") {
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

// Verificar limites do plano gratuito
async function checkPlanLimits(coachId, supabase, FREE_PLAN_LIMITS) {
  try {
    // Verificar número de clientes
    const { data: clients, error: clientsError } = await supabase.from("clientes").select("id").eq("coach_id", coachId)

    if (clientsError) throw clientsError

    const clientCount = clients.length

    if (clientCount >= FREE_PLAN_LIMITS.MAX_CLIENTS) {
      return {
        limitReached: true,
        type: "clients",
        message: `Você atingiu o limite de ${FREE_PLAN_LIMITS.MAX_CLIENTS} clientes do plano gratuito.`,
      }
    }

    // Verificar sessões por cliente
    for (const client of clients) {
      const { data: sessions, error: sessionsError } = await supabase
        .from("sessoes")
        .select("id")
        .eq("cliente_id", client.id)

      if (sessionsError) throw sessionsError

      if (sessions.length >= FREE_PLAN_LIMITS.MAX_SESSIONS_PER_CLIENT) {
        return {
          limitReached: true,
          type: "sessions",
          clientId: client.id,
          message: `Você atingiu o limite de ${FREE_PLAN_LIMITS.MAX_SESSIONS_PER_CLIENT} sessões por cliente do plano gratuito.`,
        }
      }
    }

    return { limitReached: false }
  } catch (error) {
    console.error("Erro ao verificar limites do plano:", error)
    return { limitReached: false }
  }
}

// Navegar para uma página
function navigateTo(
  page,
  renderLoginPage,
  renderRegisterPage,
  renderDashboard,
  renderClientsPage,
  renderSessionsPage,
  renderFeedbackPage,
  renderProfilePage,
) {
  const appContainer = document.getElementById("app")
  appContainer.innerHTML =
    '<div id="loading" class="flex items-center justify-center h-screen"><div class="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-blue-500"></div></div>'

  setTimeout(() => {
    switch (page) {
      case "login":
        renderLoginPage()
        break
      case "register":
        renderRegisterPage()
        break
      case "dashboard":
        renderDashboard()
        break
      case "clients":
        renderClientsPage()
        break
      case "sessions":
        renderSessionsPage()
        break
      case "feedback":
        renderFeedbackPage()
        break
      case "profile":
        renderProfilePage()
        break
      default:
        renderLoginPage()
    }
  }, 300)
}
