// Componente de barra lateral

function createSidebar(currentUser) {
  const sidebar = document.createElement("div")
  sidebar.className = "hidden md:block w-64 bg-white shadow-md h-screen fixed left-0 top-16 overflow-y-auto"

  const sidebarContent = document.createElement("div")
  sidebarContent.className = "py-6"

  // Perfil do usuário
  const userProfile = document.createElement("div")
  userProfile.className = "px-6 mb-6"
  userProfile.innerHTML = `
    <div class="flex items-center space-x-3">
      <div class="w-12 h-12 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold text-xl">
        ${currentUser?.email?.charAt(0).toUpperCase() || "U"}
      </div>
      <div>
        <p class="text-sm font-medium text-gray-900">${currentUser?.email?.split("@")[0] || "Usuário"}</p>
        <p class="text-xs text-gray-500">Coach</p>
      </div>
    </div>
  `

  // Links de navegação
  const navLinks = document.createElement("div")
  navLinks.className = "mt-6 px-3"

  const links = [
    { id: "sidebar-dashboard", text: "Dashboard", icon: "fa-tachometer-alt", page: "dashboard" },
    { id: "sidebar-clients", text: "Clientes", icon: "fa-users", page: "clients" },
    { id: "sidebar-sessions", text: "Sessões", icon: "fa-calendar-alt", page: "sessions" },
    { id: "sidebar-feedback", text: "Feedbacks", icon: "fa-star", page: "feedback" },
    { id: "sidebar-profile", text: "Meu Perfil", icon: "fa-user", page: "profile" },
  ]

  links.forEach((link) => {
    const navLink = document.createElement("a")
    navLink.href = "#"
    navLink.id = link.id
    navLink.className =
      "flex items-center space-x-3 px-3 py-2 rounded-md mb-1 text-gray-700 hover:bg-indigo-50 hover:text-indigo-600"
    navLink.innerHTML = `
      <i class="fas ${link.icon} w-5 text-center"></i>
      <span>${link.text}</span>
    `
    navLink.addEventListener("click", (e) => {
      e.preventDefault()
      window.navigateTo(link.page) // Assuming navigateTo is a global function
    })
    navLinks.appendChild(navLink)
  })

  // Plano atual
  const currentPlan = document.createElement("div")
  currentPlan.className = "mt-6 px-6"
  currentPlan.innerHTML = `
    <p class="text-xs uppercase font-semibold text-gray-500 mb-2">Plano atual</p>
    <div class="bg-gray-50 rounded-md p-3">
      <div class="flex justify-between items-center">
        <div>
          <p class="text-sm font-medium">Plano Gratuito</p>
          <p class="text-xs text-gray-500">Limite: 5 clientes</p>
        </div>
        <button id="upgrade-button" class="text-xs bg-indigo-600 text-white px-3 py-1 rounded-md hover:bg-indigo-700">Upgrade</button>
      </div>
    </div>
  `

  // Estatísticas
  const stats = document.createElement("div")
  stats.className = "mt-6 px-6"
  stats.innerHTML = `
    <p class="text-xs uppercase font-semibold text-gray-500 mb-2">Estatísticas</p>
    <div class="space-y-2">
      <div class="bg-gray-50 rounded-md p-3">
        <p class="text-xs text-gray-500">Clientes</p>
        <p id="client-count" class="text-lg font-semibold">0</p>
      </div>
      <div class="bg-gray-50 rounded-md p-3">
        <p class="text-xs text-gray-500">Sessões</p>
        <p id="session-count" class="text-lg font-semibold">0</p>
      </div>
      <div class="bg-gray-50 rounded-md p-3">
        <p class="text-xs text-gray-500">Avaliação média</p>
        <p id="average-rating" class="text-lg font-semibold">0.0</p>
      </div>
    </div>
  `

  // Botão de logout
  const logoutButton = document.createElement("div")
  logoutButton.className = "mt-6 px-6"
  logoutButton.innerHTML = `
    <button id="sidebar-logout" class="w-full flex items-center justify-center space-x-2 bg-gray-100 text-gray-700 py-2 rounded-md hover:bg-gray-200">
      <i class="fas fa-sign-out-alt"></i>
      <span>Sair</span>
    </button>
  `

  // Adicionar elementos ao sidebar
  sidebarContent.appendChild(userProfile)
  sidebarContent.appendChild(navLinks)
  sidebarContent.appendChild(currentPlan)
  sidebarContent.appendChild(stats)
  sidebarContent.appendChild(logoutButton)
  sidebar.appendChild(sidebarContent)

  // Adicionar event listeners
  document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("sidebar-logout")?.addEventListener("click", () => {
      window.logoutCoach().then(() => window.navigateTo("login")) // Assuming logoutCoach is a global function
    })

    document.getElementById("upgrade-button")?.addEventListener("click", () => {
      window.showUpgradeModal() // Assuming showUpgradeModal is a global function
    })
  })

  // Carregar estatísticas
  if (currentUser) {
    window.getCoachStats(currentUser.id).then((result) => {
      // Assuming getCoachStats is a global function
      if (result.success) {
        document.getElementById("client-count").textContent = result.stats.clientCount
        document.getElementById("session-count").textContent = result.stats.sessionCount
        document.getElementById("average-rating").textContent = result.stats.averageRating.toFixed(1)
      }
    })
  }

  return sidebar
}
