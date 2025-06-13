// Página de dashboard

function renderDashboard() {
  const appContainer = document.getElementById("app")

  // Verificar se o usuário está autenticado
  window.getCurrentSession().then(async (result) => {
    if (!result.success || !result.user) {
      window.navigateTo("login")
      return
    }

    const currentUser = result.user

    // Obter estatísticas do coach
    const statsResult = await window.getCoachStats(currentUser.id)
    const stats = statsResult.success
      ? statsResult.stats
      : {
          clientCount: 0,
          sessionCount: 0,
          feedbackCount: 0,
          averageRating: 0,
        }

    // Obter próximas sessões
    const sessionsResult = await window.getSessions(currentUser.id)
    const allSessions = sessionsResult.success ? sessionsResult.sessions : []

    // Filtrar próximas sessões (futuras)
    const now = new Date()
    const upcomingSessions = allSessions
      .filter((session) => new Date(session.data) > now)
      .sort((a, b) => new Date(a.data) - new Date(b.data))
      .slice(0, 5)

    // Obter clientes recentes
    const clientsResult = await window.getClients(currentUser.id)
    const recentClients = clientsResult.success
      ? clientsResult.clients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at)).slice(0, 5)
      : []

    // Verificar limites do plano
    const planLimits = await window.checkPlanLimits(currentUser.id)
    const showUpgradeWarning = planLimits.limitReached

    // Renderizar a página
    appContainer.innerHTML = `
      <div class="flex flex-col min-h-screen bg-gray-50">
        <!-- Navbar -->
        <div id="navbar-container"></div>
        
        <div class="flex flex-1">
          <!-- Sidebar -->
          <div id="sidebar-container"></div>
          
          <!-- Conteúdo principal -->
          <div class="flex-1 p-6 md:ml-64">
            <h1 class="text-2xl font-bold text-gray-800 mb-6">Dashboard</h1>
            
            ${
              showUpgradeWarning
                ? `
                <div class="upgrade-banner mb-6 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-bold text-white text-lg">Limite do plano atingido!</h3>
                      <p class="text-white opacity-90">${planLimits.message}</p>
                    </div>
                    <button id="upgrade-now-btn" class="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100">
                      Fazer Upgrade
                    </button>
                  </div>
                </div>
              `
                : ""
            }
            
            <!-- Cards de estatísticas -->
            <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-6">
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-indigo-100 text-indigo-600">
                    <i class="fas fa-users text-xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-gray-500 text-sm">Clientes</p>
                    <p class="text-2xl font-semibold">${stats.clientCount}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-green-100 text-green-600">
                    <i class="fas fa-calendar-alt text-xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-gray-500 text-sm">Sessões</p>
                    <p class="text-2xl font-semibold">${stats.sessionCount}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-yellow-100 text-yellow-600">
                    <i class="fas fa-star text-xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-gray-500 text-sm">Feedbacks</p>
                    <p class="text-2xl font-semibold">${stats.feedbackCount}</p>
                  </div>
                </div>
              </div>
              
              <div class="bg-white rounded-lg shadow-md p-6">
                <div class="flex items-center">
                  <div class="p-3 rounded-full bg-blue-100 text-blue-600">
                    <i class="fas fa-chart-line text-xl"></i>
                  </div>
                  <div class="ml-4">
                    <p class="text-gray-500 text-sm">Avaliação Média</p>
                    <p class="text-2xl font-semibold">${stats.averageRating.toFixed(1)}</p>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Próximas sessões e clientes recentes -->
            <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <!-- Próximas sessões -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Próximas Sessões</h2>
                <div id="upcoming-sessions" class="space-y-4">
                  ${
                    upcomingSessions.length > 0
                      ? ""
                      : '<p class="text-gray-500 text-center py-4">Nenhuma sessão agendada.</p>'
                  }
                </div>
                <div class="mt-4 text-center">
                  <button id="view-all-sessions" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Ver todas as sessões
                  </button>
                </div>
              </div>
              
              <!-- Clientes recentes -->
              <div class="bg-white rounded-lg shadow-md p-6">
                <h2 class="text-lg font-semibold text-gray-800 mb-4">Clientes Recentes</h2>
                <div id="recent-clients" class="space-y-4">
                  ${
                    recentClients.length > 0
                      ? ""
                      : '<p class="text-gray-500 text-center py-4">Nenhum cliente cadastrado.</p>'
                  }
                </div>
                <div class="mt-4 text-center">
                  <button id="view-all-clients" class="text-indigo-600 hover:text-indigo-800 text-sm font-medium">
                    Ver todos os clientes
                  </button>
                </div>
              </div>
            </div>
            
            <!-- Botão de adicionar -->
            <div class="fixed bottom-6 right-6">
              <div class="relative group">
                <button id="add-button" class="bg-indigo-600 text-white rounded-full w-14 h-14 flex items-center justify-center shadow-lg hover:bg-indigo-700 focus:outline-none">
                  <i class="fas fa-plus text-xl"></i>
                </button>
                <div class="absolute bottom-full right-0 mb-3 hidden group-hover:block">
                  <div class="bg-white rounded-lg shadow-lg overflow-hidden">
                    <button id="add-client-btn" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      <i class="fas fa-user-plus mr-2"></i> Novo Cliente
                    </button>
                    <button id="add-session-btn" class="block w-full text-left px-4 py-2 hover:bg-gray-100">
                      <i class="fas fa-calendar-plus mr-2"></i> Nova Sessão
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `

    // Renderizar navbar e sidebar
    const navbarContainer = document.getElementById("navbar-container")
    navbarContainer.appendChild(
      window.createNavbar(currentUser, window.navigateTo, window.logoutCoach, window.getUnreadNotifications),
    )

    const sidebarContainer = document.getElementById("sidebar-container")
    sidebarContainer.appendChild(window.createSidebar(currentUser))

    // Renderizar próximas sessões
    const upcomingSessionsContainer = document.getElementById("upcoming-sessions")
    upcomingSessions.forEach((session) => {
      upcomingSessionsContainer.appendChild(window.createSessionCard(session, false))
    })

    // Renderizar clientes recentes
    const recentClientsContainer = document.getElementById("recent-clients")
    recentClients.forEach((client) => {
      recentClientsContainer.appendChild(window.createClientCard(client, false))
    })

    // Adicionar event listeners
    document.getElementById("view-all-sessions")?.addEventListener("click", () => {
      window.navigateTo("sessions")
    })

    document.getElementById("view-all-clients")?.addEventListener("click", () => {
      window.navigateTo("clients")
    })

    document.getElementById("add-client-btn")?.addEventListener("click", () => {
      window.showAddClientModal()
    })

    document.getElementById("add-session-btn")?.addEventListener("click", () => {
      window.showAddSessionModal()
    })

    document.getElementById("upgrade-now-btn")?.addEventListener("click", () => {
      window.showUpgradeModal()
    })
  })
}

// Exportar função para o escopo global
window.renderDashboard = renderDashboard
