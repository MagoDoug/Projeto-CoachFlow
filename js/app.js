// Arquivo principal da aplicação

// Função para verificar se todos os serviços estão prontos
function checkServicesReady() {
  return (
    typeof window.supabaseInstance !== "undefined" &&
    typeof window.getCurrentSession === "function" &&
    typeof window.navigateTo === "function"
  )
}

// Aguardar o carregamento completo
document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM carregado, iniciando aplicação...")

  // Função para inicializar a aplicação
  function initializeApp() {
    if (!checkServicesReady()) {
      console.log("Serviços ainda não estão prontos, aguardando...")
      return false
    }

    console.log("Todos os serviços prontos, verificando autenticação...")

    // Verificar se o usuário está autenticado
    window
      .getCurrentSession()
      .then((result) => {
        if (result.success && result.user) {
          console.log("Usuário autenticado, redirecionando para dashboard")
          window.navigateTo("dashboard")
        } else {
          console.log("Usuário não autenticado, redirecionando para login")
          window.navigateTo("login")
        }
      })
      .catch((error) => {
        console.error("Erro ao verificar sessão:", error)
        window.navigateTo("login")
      })

    return true
  }

  // Tentar inicializar imediatamente
  if (!initializeApp()) {
    // Se falhar, tentar novamente com intervalos
    let attempts = 0
    const maxAttempts = 10

    const initInterval = setInterval(() => {
      attempts++
      console.log(`Tentativa ${attempts} de inicialização...`)

      if (initializeApp() || attempts >= maxAttempts) {
        clearInterval(initInterval)
        if (attempts >= maxAttempts) {
          console.error("Falha ao inicializar aplicação após múltiplas tentativas")
          // Mostrar página de erro ou fallback
          document.getElementById("app").innerHTML = `
            <div class="flex items-center justify-center h-screen">
              <div class="text-center">
                <h1 class="text-2xl font-bold text-red-600 mb-4">Erro ao carregar aplicação</h1>
                <p class="text-gray-600 mb-4">Houve um problema ao inicializar a aplicação.</p>
                <button onclick="location.reload()" class="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
                  Tentar novamente
                </button>
              </div>
            </div>
          `
        }
      }
    }, 500)
  }
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

// Garantir que as funções estão disponíveis globalmente
window.formatDate =
  window.formatDate ||
  ((dateString) => {
    const options = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString("pt-BR", options)
  })

window.formatTime =
  window.formatTime ||
  ((dateString) => {
    const options = { hour: "2-digit", minute: "2-digit" }
    return new Date(dateString).toLocaleTimeString("pt-BR", options)
  })
