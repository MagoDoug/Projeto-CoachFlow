// Página de feedbacks

function renderFeedbackPage() {
  const appContainer = document.getElementById("app")

  // Verificar se o usuário está autenticado
  window.getCurrentSession().then(async (result) => {
    if (!result.success || !result.user) {
      window.navigateTo("login")
      return
    }

    const currentUser = result.user

    // Obter feedbacks do coach
    const feedbacksResult = await window.getFeedbacks(currentUser.id)
    const feedbacks = feedbacksResult.success ? feedbacksResult.feedbacks : []

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
            <h1 class="text-2xl font-bold text-gray-800 mb-6">Feedbacks</h1>
            
            <!-- Filtro -->
            <div class="bg-white rounded-lg shadow-md p-4 mb-6">
              <div class="flex flex-col md:flex-row md:items-center md:justify-between">
                <div class="mb-4 md:mb-0">
                  <label for="filter" class="block text-sm font-medium text-gray-700 mb-1">Filtrar por:</label>
                  <select id="filter" class="border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                    <option value="all">Todos os feedbacks</option>
                    <option value="recent">Mais recentes</option>
                    <option value="rating-high">Maior avaliação</option>
                    <option value="rating-low">Menor avaliação</option>
                    <option value="responded">Com resposta</option>
                    <option value="not-responded">Sem resposta</option>
                  </select>
                </div>
                <div class="relative">
                  <input type="text" id="search" placeholder="Buscar feedback..." class="border border-gray-300 rounded-md pl-10 pr-3 py-2 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 w-full md:w-64">
                  <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i class="fas fa-search text-gray-400"></i>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Lista de feedbacks -->
            <div id="feedbacks-container" class="space-y-4">
              ${
                feedbacks.length > 0
                  ? ""
                  : '<div class="text-center py-12"><p class="text-gray-500">Nenhum feedback recebido.</p></div>'
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

    // Renderizar feedbacks
    const feedbacksContainer = document.getElementById("feedbacks-container")
    feedbacks.forEach((feedback) => {
      feedbacksContainer.appendChild(createFeedbackCard(feedback))
    })

    // Adicionar event listeners para filtro e pesquisa
    const filterSelect = document.getElementById("filter")
    const searchInput = document.getElementById("search")

    filterSelect.addEventListener("change", filterAndSearchFeedbacks)
    searchInput.addEventListener("input", filterAndSearchFeedbacks)

    function filterAndSearchFeedbacks() {
      const filterValue = filterSelect.value
      const searchValue = searchInput.value.toLowerCase()

      // Limpar container
      feedbacksContainer.innerHTML = ""

      // Filtrar feedbacks
      let filteredFeedbacks = [...feedbacks]

      // Aplicar filtro de pesquisa
      if (searchValue) {
        filteredFeedbacks = filteredFeedbacks.filter(
          (feedback) =>
            feedback.comentario?.toLowerCase().includes(searchValue) ||
            feedback.clientes?.nome?.toLowerCase().includes(searchValue) ||
            feedback.sessoes?.titulo?.toLowerCase().includes(searchValue),
        )
      }

      // Aplicar filtro de tipo
      switch (filterValue) {
        case "recent":
          filteredFeedbacks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
          break
        case "rating-high":
          filteredFeedbacks.sort((a, b) => b.rating - a.rating)
          break
        case "rating-low":
          filteredFeedbacks.sort((a, b) => a.rating - b.rating)
          break
        case "responded":
          filteredFeedbacks = filteredFeedbacks.filter((feedback) => feedback.resposta)
          break
        case "not-responded":
          filteredFeedbacks = filteredFeedbacks.filter((feedback) => !feedback.resposta)
          break
        default:
          filteredFeedbacks.sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
      }

      // Renderizar feedbacks filtrados
      if (filteredFeedbacks.length > 0) {
        filteredFeedbacks.forEach((feedback) => {
          feedbacksContainer.appendChild(createFeedbackCard(feedback))
        })
      } else {
        feedbacksContainer.innerHTML =
          '<div class="text-center py-12"><p class="text-gray-500">Nenhum feedback encontrado.</p></div>'
      }
    }
  })
}

// Função para criar card de feedback
function createFeedbackCard(feedback) {
  const card = document.createElement("div")
  card.className = "bg-white rounded-lg shadow-md p-6"

  const createdDate = new Date(feedback.created_at).toLocaleDateString("pt-BR")
  const hasResponse = feedback.resposta && feedback.resposta.trim() !== ""

  card.innerHTML = `
    <div class="flex justify-between items-start mb-4">
      <div>
        <h3 class="text-lg font-semibold text-gray-800">${feedback.sessoes?.titulo || "Sessão"}</h3>
        <p class="text-sm text-gray-600">Cliente: ${feedback.clientes?.nome || "N/A"}</p>
        <p class="text-xs text-gray-400">Recebido em: ${createdDate}</p>
      </div>
      <div class="flex items-center">
        ${Array(5)
          .fill()
          .map((_, i) => {
            return `<i class="fas fa-star ${i < feedback.rating ? "text-yellow-400" : "text-gray-300"}"></i>`
          })
          .join("")}
        <span class="ml-2 text-sm text-gray-600">${feedback.rating}/5</span>
      </div>
    </div>
    
    <div class="mb-4">
      <p class="text-sm text-gray-700"><strong>Progresso:</strong> ${feedback.progress_rating}/5</p>
    </div>
    
    ${
      feedback.comentario
        ? `
      <div class="mb-4 p-3 bg-gray-50 rounded-md">
        <p class="text-sm text-gray-700">${feedback.comentario}</p>
      </div>
    `
        : ""
    }
    
    ${
      hasResponse
        ? `
      <div class="mb-4 p-3 bg-indigo-50 rounded-md border-l-4 border-indigo-500">
        <p class="text-sm font-medium text-indigo-800 mb-1">Sua resposta:</p>
        <p class="text-sm text-indigo-700">${feedback.resposta}</p>
        <p class="text-xs text-indigo-600 mt-1">Respondido em: ${new Date(feedback.resposta_data).toLocaleDateString("pt-BR")}</p>
      </div>
    `
        : `
      <div class="border-t pt-4">
        <button class="respond-btn bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700 text-sm" data-feedback-id="${feedback.id}">
          Responder Feedback
        </button>
      </div>
    `
    }
  `

  // Adicionar event listener para responder
  if (!hasResponse) {
    const respondBtn = card.querySelector(".respond-btn")
    respondBtn.addEventListener("click", () => {
      showRespondModal(feedback.id)
    })
  }

  return card
}

// Função para mostrar modal de resposta
function showRespondModal(feedbackId) {
  // Criar modal
  const modal = document.createElement("div")
  modal.className = "fixed inset-0 z-50 flex items-center justify-center"
  modal.innerHTML = `
    <div class="modal-overlay absolute inset-0 bg-black opacity-50"></div>
    <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50">
      <div class="modal-content py-4 text-left px-6">
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold text-gray-800">Responder Feedback</p>
          <div class="modal-close cursor-pointer">
            <i class="fas fa-times text-gray-500 hover:text-gray-800"></i>
          </div>
        </div>
        <form id="respond-form">
          <div class="mb-4">
            <label for="response" class="block text-sm font-medium text-gray-700 mb-1">Sua resposta</label>
            <textarea id="response" name="resposta" rows="4" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
          </div>
          <div class="flex justify-end">
            <button type="button" class="modal-close-btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
              Cancelar
            </button>
            <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
              Enviar Resposta
            </button>
          </div>
        </form>
      </div>
    </div>
  `

  document.body.appendChild(modal)

  // Event listeners
  modal.querySelector(".modal-close").addEventListener("click", () => modal.remove())
  modal.querySelector(".modal-close-btn").addEventListener("click", () => modal.remove())
  modal.querySelector(".modal-overlay").addEventListener("click", () => modal.remove())

  modal.querySelector("#respond-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const resposta = document.getElementById("response").value

    const result = await window.respondToFeedback(feedbackId, resposta)

    if (result.success) {
      window.showNotification("Resposta enviada com sucesso!", "success")
      modal.remove()
      window.renderFeedbackPage() // Recarregar a página
    } else {
      window.showNotification("Erro ao enviar resposta: " + result.error, "error")
    }
  })
}

// Exportar função para o escopo global
window.renderFeedbackPage = renderFeedbackPage
