// Página de clientes

function renderClientsPage() {
  const appContainer = document.getElementById("app")

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

    // Verificar limites do plano
    const planLimits = await window.checkPlanLimits(currentUser.id)
    const reachedClientLimit = planLimits.limitReached && planLimits.type === "clients"

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
              <h1 class="text-2xl font-bold text-gray-800">Clientes</h1>
              <button id="add-client-btn" class="bg-indigo-600 text-white px-4 py-2 rounded-md flex items-center hover:bg-indigo-700 ${reachedClientLimit ? "opacity-50 cursor-not-allowed" : ""}">
                <i class="fas fa-plus mr-2"></i> Novo Cliente
              </button>
            </div>
            
            ${
              reachedClientLimit
                ? `
                <div class="upgrade-banner mb-6 p-4 rounded-lg">
                  <div class="flex items-center justify-between">
                    <div>
                      <h3 class="font-bold text-white text-lg">Limite de clientes atingido!</h3>
                      <p class="text-white opacity-90">Você atingiu o limite de ${window.FREE_PLAN_LIMITS.MAX_CLIENTS} clientes do plano gratuito.</p>
                    </div>
                    <button id="upgrade-now-btn" class="bg-white text-indigo-600 px-4 py-2 rounded-md font-medium hover:bg-gray-100">
                      Fazer Upgrade
                    </button>
                  </div>
                </div>
              `
                : ""
            }
            
            <!-- Filtro e pesquisa -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="mb-4 md:mb-0">
                  <label for="filter" class="block text-sm font-medium text-gray-700 mb-1">Filtrar por:</label>
                  <select id="filter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">Todos os clientes</option>
                    <option value="recent">Adicionados recentemente</option>
                    <option value="progress">Maior progresso</option>
                    <option value="sessions">Mais sessões</option>
                  </select>
                </div>
                <div class="relative">
                  <input type="text" id="search" placeholder="Buscar cliente..." class="border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Lista de clientes -->
            <div id="clients-container" class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              ${
                clients.length > 0
                  ? ""
                  : '<div class="col-span-full text-center py-12"><p class="text-gray-500">Nenhum cliente cadastrado.</p></div>'
              }
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

    // Renderizar clientes
    const clientsContainer = document.getElementById("clients-container")
    clients.forEach((client) => {
      clientsContainer.appendChild(window.createClientCard(client))
    })

    // Adicionar event listeners
    document.getElementById("add-client-btn")?.addEventListener("click", () => {
      if (!reachedClientLimit) {
        window.showAddClientModal()
      } else {
        window.showUpgradeModal()
      }
    })

    document.getElementById("upgrade-now-btn")?.addEventListener("click", () => {
      window.showUpgradeModal()
    })

    // Filtro e pesquisa
    const filterSelect = document.getElementById("filter")
    const searchInput = document.getElementById("search")

    filterSelect.addEventListener("change", filterAndSearchClients)
    searchInput.addEventListener("input", filterAndSearchClients)

    function filterAndSearchClients() {
      const filterValue = filterSelect.value
      const searchValue = searchInput.value.toLowerCase()

      // Limpar container
      clientsContainer.innerHTML = ""

      // Filtrar e ordenar clientes
      let filteredClients = [...clients]

      // Aplicar filtro de pesquisa
      if (searchValue) {
        filteredClients = filteredClients.filter(
          (client) =>
            client.nome.toLowerCase().includes(searchValue) || client.email.toLowerCase().includes(searchValue),
        )
      }

      // Aplicar filtro de ordenação
      switch (filterValue) {
        case "recent":
          filteredClients.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          break
        case "progress":
          // Aqui precisaríamos ter os dados de progresso
          // Por enquanto, mantemos a ordem original
          break
        case "sessions":
          // Aqui precisaríamos ter os dados de sessões
          // Por enquanto, mantemos a ordem original
          break
      }

      // Renderizar clientes filtrados
      if (filteredClients.length > 0) {
        filteredClients.forEach((client) => {
          clientsContainer.appendChild(window.createClientCard(client))
        })
      } else {
        clientsContainer.innerHTML =
          '<div class="col-span-full text-center py-12"><p class="text-gray-500">Nenhum cliente encontrado.</p></div>'
      }
    }
  })
}

// Função para mostrar modal de adicionar cliente
function showAddClientModal() {
  // Verificar se o modal já existe
  let modal = document.getElementById("add-client-modal")
  if (modal) {
    modal.classList.remove("hidden")
    return
  }

  // Criar o modal
  modal = document.createElement("div")
  modal.id = "add-client-modal"
  modal.className = "fixed inset-0 z-50 flex items-center justify-center"
  modal.innerHTML = `
    <div class="modal-overlay absolute inset-0 bg-black opacity-50"></div>
    <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">
      <div class="modal-content py-4 text-left px-6">
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold text-gray-800">Novo Cliente</p>
          <div class="modal-close cursor-pointer z-50">
            <i class="fas fa-times text-gray-500 hover:text-gray-800"></i>
          </div>
        </div>
        <form id="add-client-form">
          <div class="mb-4">
            <label for="client-name" class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
            <input type="text" id="client-name" name="nome" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div class="mb-4">
            <label for="client-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
            <input type="email" id="client-email" name="email" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div class="mb-4">
            <label for="client-phone" class="block text-sm font-medium text-gray-700 mb-1">Telefone</label>
            <input type="tel" id="client-phone" name="telefone" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
          </div>
          <div class="mb-4">
            <label for="client-notes" class="block text-sm font-medium text-gray-700 mb-1">Observações</label>
            <textarea id="client-notes" name="observacoes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
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

  // Formulário de adicionar cliente
  document.getElementById("add-client-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const formData = {
      nome: document.getElementById("client-name").value,
      email: document.getElementById("client-email").value,
      telefone: document.getElementById("client-phone").value,
      observacoes: document.getElementById("client-notes").value,
    }

    // Obter o ID do coach atual
    const sessionResult = await window.getCurrentSession()
    if (!sessionResult.success || !sessionResult.user) {
      window.showNotification("Erro ao obter sessão atual.", "error")
      return
    }

    const coachId = sessionResult.user.id

    // Adicionar cliente
    const result = await window.createClient(coachId, formData)

    if (result.success) {
      window.showNotification("Cliente adicionado com sucesso!", "success")
      modal.classList.add("hidden")
      window.renderClientsPage() // Recarregar a página
    } else {
      if (result.limitReached) {
        window.showNotification(result.error, "error")
        modal.classList.add("hidden")
        window.showUpgradeModal()
      } else {
        window.showNotification("Erro ao adicionar cliente: " + result.error, "error")
      }
    }
  })
}

// Exportar funções para o escopo global
window.renderClientsPage = renderClientsPage
window.showAddClientModal = showAddClientModal
