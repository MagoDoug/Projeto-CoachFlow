// Página de sessões

function renderSessionsPage() {
  const appContainer = document.getElementById("app")
  
  // Verificar se o usuário está autenticado
  window.getCurrentSession().then(async (result) => {
    if (!result.success || !result.user) {
      window.navigateTo("login")
      return
    }
    
    const currentUser = result.user
    
    // Obter sessões do coach
    const sessionsResult = await window.getSessions(currentUser.id)
    const sessions = sessionsResult.success ? sessionsResult.sessions : []
    
    // Obter clientes para o modal de nova sessão
    const clientsResult = await window.getClients(currentUser.id)
    const clients = clientsResult.success ? clientsResult.clients : []
    
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
            <div class="flex justify-between items-center mb-6">
              <h1 class="text-2xl font-bold text-gray-800">Sessões</h1>
              <button id="add-session-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700">
                <i class="fas fa-plus mr-2"></i> Nova Sessão
              </button>
            </div>
            
            <!-- Filtro e pesquisa -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="mb-4 md:mb-0 flex items-center space-x-4">
                  <div>
                    <label for="filter" class="block text-sm font-medium text-gray-700 mb-1">Filtrar por:</label>
                    <select id="filter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="all">Todas as sessões</option>
                      <option value="upcoming">Próximas sessões</option>
                      <option value="past">Sessões passadas</option>
                      <option value="feedback">Com feedback</option>
                      <option value="no-feedback">Sem feedback</option>
                    </select>
                  </div>
                  <div>
                    <label for="client-filter" class="block text-sm font-medium text-gray-700 mb-1">Cliente:</label>
                    <select id="client-filter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                      <option value="all">Todos os clientes</option>
                      ${clients.map(client => `<option value="${client.id}">${client.nome}</option>`).join('')}
                    </select>
                  </div>
                </div>
                <div class="relative">
                  <input type="text" id="search" placeholder="Buscar sessão..." class="border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Lista de sessões -->
            <div id="sessions-container" class="space-y-4">
              ${
                sessions.length > 0
                  ? ""
                  : '<div class="text-center py-12"><p class="text-gray-500">Nenhuma sessão cadastrada.</p></div>'
              }
            </div>
          </div>
        </div>
      </div>
    `
    
    // Renderizar navbar e sidebar
    const navbarContainer = document.getElementById("navbar-container")
    navbarContainer.appendChild(window.createNavbar(currentUser, window.navigateTo, window.logoutCoach, window.getUnreadNotifications))
    
    const sidebarContainer = document.getElementById("sidebar-container")
    sidebarContainer.appendChild(window.createSidebar(currentUser))
    
    // Renderizar sessões
    const sessionsContainer = document.getElementById("sessions-container")
    sessions.forEach(session => {
      sessionsContainer.appendChild(window.createSessionCard(session))
    })
    
    // Adicionar event listeners
    document.getElementById("add-session-btn")?.addEventListener("click", () => {
      window.showAddSessionModal()
    })
    
    // Filtro e pesquisa
    const filterSelect = document.getElementById("filter")
    const clientFilterSelect = document.getElementById("client-filter")
    const searchInput = document.getElementById("search")
    
    filterSelect.addEventListener("change", filterAndSearchSessions)
    clientFilterSelect.addEventListener("change", filterAndSearchSessions)
    searchInput.addEventListener("input", filterAndSearchSessions)
    
    function filterAndSearchSessions() {
      const filterValue = filterSelect.value
      const clientFilterValue = clientFilterSelect.value
      const searchValue = searchInput.value.toLowerCase()
      
      // Limpar container
      sessionsContainer.innerHTML = ""
      
      // Filtrar e ordenar sessões
      let filteredSessions = [...sessions]
      
      // Aplicar filtro de cliente
      if (clientFilterValue !== "all") {
        filteredSessions = filteredSessions.filter(session => session.cliente_id === clientFilterValue)
      }
      
      // Aplicar filtro de pesquisa
      if (searchValue) {
        filteredSessions = filteredSessions.filter(session => 
          session.titulo.toLowerCase().includes(searchValue) || 
          (session.notas && session.notas.toLowerCase().includes(searchValue))
        )
      }
      
      // Aplicar filtro de tipo
      const now = new Date()
      switch (filterValue) {
        case "upcoming":
          filteredSessions = filteredSessions.filter(session => new Date(session.data) > now)
          filteredSessions.sort((a, b) => new Date(a.data) - new Date(b.data))
          break
        case "past":
          filteredSessions = filteredSessions.filter(session => new Date(session.data) <= now)
          filteredSessions.sort((a, b) => new Date(b.data) - new Date(a.data))
          break
        case "feedback":
          filteredSessions = filteredSessions.filter(session => session.feedback && session.feedback.id)
          break
        case "no-feedback":
          filteredSessions = filteredSessions.filter(session => 
            new Date(session.data) <= now && (!session.feedback || !session.feedback.id)
          )
          break
        default:
          filteredSessions.sort((a, b) => new Date(b.data) - new Date(a.data))
      }
      
      // Renderizar sessões filtradas
      if (filteredSessions.length > 0) {
        filteredSessions.forEach(session => {
          sessionsContainer.appendChild(window.createSessionCard(session))
        })
      } else {
        sessionsContainer.innerHTML = '<div class="text-center py-12"><p class="text-gray-500">Nenhuma sessão encontrada.</p></div>'
      }
    }
  })
}

// Função para mostrar modal de adicionar sessão
function showAddSessionModal() {
  // Verificar se o usuário está autenticado
  window.getCurrentSession().then(async (result) => {
    if (!result.success || !result.user) {
      window.navigateTo("login")
      return
    }
    
    const currentUser = result.user
    
    // Obter clientes do coach
    const clientsResult = await window.getClients(currentUser.id)
    const clients = clientsResult.success ? clientsResult.clients : []
    
    // Verificar se há clientes
    if (clients.length === 0) {
      window.showNotification("Você precisa adicionar clientes antes de criar sessões.", "info")
      return
    }
    
    // Verificar se o modal já existe
    let modal = document.getElementById("add-session-modal")
    if (modal) {
      modal.classList.remove("hidden")
      return
    }
    
    // Criar o modal
    modal = document.createElement("div")
    modal.id = "add-session-modal"
    modal.className = "fixed inset-0 z-50 flex items-center justify-center"
    modal.innerHTML = `
      <div class="modal-overlay absolute inset-0 bg-black opacity-50"></div>
      <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">
        <div class="modal-content py-4 text-left px-6">
          <div class="flex justify-between items-center pb-3">
            <p class="text-2xl font-bold text-gray-800">Nova Sessão</p>
            <div class="modal-close cursor-pointer z-50">
              <i class="fas fa-times text-gray-500 hover:text-gray-800"></i>
            </div>
          </div>
          <form id="add-session-form">
            <div class="mb-4">
              <label for="session-title" class="block text-sm font-medium text-gray-700 mb-1">Título</label>
              <input type="text" id="session-title" name="titulo" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="mb-4">
              <label for="session-client" class="block text-sm font-medium text-gray-700 mb-1">Cliente</label>
              <select id="session-client" name="cliente_id" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                <option value="">Selecione um cliente</option>
                ${clients.map(client => `<option value="${client.id}">${client.nome}</option>`).join('')}
              </select>
            </div>
            <div class="mb-4">
              <label for="session-date" class="block text-sm font-medium text-gray-700 mb-1">Data</label>
              <input type="date" id="session-date" name="data_dia" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="mb-4">
              <label for="session-time" class="block text-sm font-medium text-gray-700 mb-1">Hora</label>
              <input type="time" id="session-time" name="data_hora" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="mb-4">
              <label for="session-duration" class="block text-sm font-medium text-gray-700 mb-1">Duração (minutos)</label>
              <input type="number" id="session-duration" name="duracao" min="15" step="15" value="60" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="mb-4">
              <label for="session-notes" class="block text-sm font-medium text-gray-700 mb-1">Notas</label>
              <textarea id="session-notes" name="notas" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
            </div>
            <div class="mt-5 flex justify-end">
              <button type="button" class="modal-close-btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
                Cancelar
              </button>
              <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                Adicionar
              </button>
            </div>
          </form>
        </div>
      </div>
    `
    
    // Adicionar o modal ao body
    document.body.appendChild(modal)
    
    // Adicionar event listeners
    modal.querySelector(".modal-close").addEventListener("click", () => {
      modal.classList.add("hidden")
    })
    
    modal.querySelector(".modal-close-btn").addEventListener("click", () => {
      modal.classList.add("hidden")
    })
    
    modal.querySelector(".modal-overlay").addEventListener("click", () => {
      modal.classList.add("hidden")
    })
    
    // Formulário de adicionar sessão
    document.getElementById("add-session-form").addEventListener("submit", async (e) => {
      e.preventDefault()
      
      const formData = {
        titulo: document.getElementById("session-title").value,
        cliente_id: document.getElementById("session-client").value,
        duracao: parseInt(document.getElementById("session-duration").value),
        notas: document.getElementById("session-notes").value,
      }
      
      // Combinar data e hora
      const dataDia = document.getElementById("session-date").value
      const dataHora = document.getElementById("session-time").value
      formData.data = new Date(`${dataDia}T${dataHora}`)
      
      // Adicionar sessão
      const result = await window.createSession(currentUser.id, formData)
      
      if (result.success) {
        window.showNotification("Sessão adicionada com sucesso!", "success")
        modal.classList.add("hidden")
        window.renderSessionsPage() // Recarregar a página
      } else {
        if (result.limitReached) {
          window.showNotification(result.error, "error")
          modal.classList.add("hidden")
          window.showUpgradeModal()
        } else {
          window.showNotification("Erro ao adicionar sessão: " + result.error, "error")
        }
      }
    })
  })
}

// Função para editar sessão
function editSession(sessionId) {
  // Implementação similar ao showAddSessionModal, mas carregando os dados da sessão existente
  window.showNotification("Funcionalidade de editar sessão em desenvolvimento.", "info")
}

// Função para excluir sessão
async function deleteSession(sessionId) {
  try {
    const result = await window.deleteSession(sessionId)
    
    if (result.success) {
      window.showNotification("Sessão excluída com sucesso!", "success")
      window.renderSessionsPage() // Recarregar a página
    } else {
      window.showNotification("Erro ao excluir sessão: " + result.error, "error")
    }
  } catch (error) {
    console.error("Erro ao excluir sessão:", error)
    window.showNotification("Ocorreu um erro ao excluir a sessão.", "error")
  }
}

// Função para solicitar feedback
async function requestSessionFeedback(sessionId) {
  try {
    const result = await window.requestSessionFeedback(sessionId)
    
    if (result.success) {
      window.showNotification("Solicitação de feedback enviada com sucesso!", "success")
    } else {
      window.showNotification("Erro ao solicitar feedback: " + result.error, "error")
    }
  } catch (error) {
    console.error("Erro ao solicitar feedback:", error)
    window.showNotification("Ocorreu um erro ao solicitar feedback.", "error")
  }
}

// Função para ver detalhes da sessão
function viewSessionDetails(sessionId) {
  // Implementação para mostrar detalhes da sessão
  window.showNotification("Funcionalidade de visualizar detalhes da sessão em desenvolvimento.", "info")
}

// Exportar funções para o escopo global
window.renderSessionsPage = renderSessionsPage
window.showAddSessionModal = showAddSessionModal
window.editSession = editSession
window.deleteSession = deleteSession
window.requestSessionFeedback = requestSessionFeedback
window.viewSessionDetails = viewSessionDetails
