// Componente de barra de navegação

function createNavbar(currentUser, navigateTo, logoutCoach, getUnreadNotifications) {
  const navbar = document.createElement("nav")
  navbar.className = "bg-white shadow-md"

  const container = document.createElement("div")
  container.className = "container mx-auto px-4"

  const navContent = document.createElement("div")
  navContent.className = "flex justify-between items-center py-4"

  // Logo
  const logo = document.createElement("div")
  logo.className = "flex items-center space-x-2"
  logo.innerHTML = `
    <i class="fas fa-chart-line text-indigo-600 text-2xl"></i>
    <span class="text-xl font-bold text-gray-800">CoachFlow</span>
  `
  logo.addEventListener("click", () => navigateTo("dashboard"))
  logo.style.cursor = "pointer"

  // Menu para desktop
  const desktopMenu = document.createElement("div")
  desktopMenu.className = "hidden md:flex items-center space-x-6"

  // Notificações
  const notificationsButton = document.createElement("div")
  notificationsButton.className = "relative"
  notificationsButton.innerHTML = `
    <button class="text-gray-600 hover:text-indigo-600 focus:outline-none">
      <i class="fas fa-bell"></i>
    </button>
    <span id="notification-badge" class="hidden absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full h-4 w-4 flex items-center justify-center">0</span>
  `

  // Dropdown do usuário
  const userDropdown = document.createElement("div")
  userDropdown.className = "relative"

  const userButton = document.createElement("button")
  userButton.className = "flex items-center space-x-2 focus:outline-none"
  userButton.innerHTML = `
    <div class="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-semibold">
      ${currentUser?.email?.charAt(0).toUpperCase() || "U"}
    </div>
    <span class="text-gray-700">${currentUser?.email?.split("@")[0] || "Usuário"}</span>
    <i class="fas fa-chevron-down text-gray-500 text-xs"></i>
  `

  const dropdownMenu = document.createElement("div")
  dropdownMenu.className = "absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg py-1 z-10 hidden"
  dropdownMenu.innerHTML = `
    <a href="#" id="profile-link" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Meu Perfil</a>
    <a href="#" id="logout-link" class="block px-4 py-2 text-sm text-gray-700 hover:bg-indigo-50">Sair</a>
  `

  userButton.addEventListener("click", () => {
    dropdownMenu.classList.toggle("hidden")
  })

  // Fechar dropdown ao clicar fora
  document.addEventListener("click", (event) => {
    if (!userDropdown.contains(event.target)) {
      dropdownMenu.classList.add("hidden")
    }
  })

  userDropdown.appendChild(userButton)
  userDropdown.appendChild(dropdownMenu)

  // Menu para mobile
  const mobileMenuButton = document.createElement("button")
  mobileMenuButton.className = "md:hidden focus:outline-none"
  mobileMenuButton.innerHTML = '<i class="fas fa-bars text-gray-600"></i>'

  const mobileMenu = document.createElement("div")
  mobileMenu.className = "md:hidden absolute top-16 left-0 right-0 bg-white shadow-md z-10 hidden"
  mobileMenu.innerHTML = `
    <a href="#" id="mobile-dashboard" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Dashboard</a>
    <a href="#" id="mobile-clients" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Clientes</a>
    <a href="#" id="mobile-sessions" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Sessões</a>
    <a href="#" id="mobile-feedback" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Feedbacks</a>
    <a href="#" id="mobile-profile" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Meu Perfil</a>
    <a href="#" id="mobile-logout" class="block px-4 py-2 text-gray-700 hover:bg-indigo-50">Sair</a>
  `

  mobileMenuButton.addEventListener("click", () => {
    mobileMenu.classList.toggle("hidden")
  })

  // Adicionar links de navegação para desktop
  const navLinks = [
    { id: "dashboard-link", text: "Dashboard", icon: "fa-tachometer-alt", page: "dashboard" },
    { id: "clients-link", text: "Clientes", icon: "fa-users", page: "clients" },
    { id: "sessions-link", text: "Sessões", icon: "fa-calendar-alt", page: "sessions" },
    { id: "feedback-link", text: "Feedbacks", icon: "fa-star", page: "feedback" },
  ]

  navLinks.forEach((link) => {
    const navLink = document.createElement("a")
    navLink.href = "#"
    navLink.id = link.id
    navLink.className = "flex items-center space-x-1 text-gray-700 hover:text-indigo-600"
    navLink.innerHTML = `
      <i class="fas ${link.icon}"></i>
      <span>${link.text}</span>
    `
    navLink.addEventListener("click", (e) => {
      e.preventDefault()
      navigateTo(link.page)
    })
    desktopMenu.appendChild(navLink)
  })

  // Adicionar elementos ao navbar
  navContent.appendChild(logo)
  navContent.appendChild(desktopMenu)
  desktopMenu.appendChild(notificationsButton)
  desktopMenu.appendChild(userDropdown)
  navContent.appendChild(mobileMenuButton)

  container.appendChild(navContent)
  navbar.appendChild(container)
  navbar.appendChild(mobileMenu)

  // Carregar notificações não lidas
  if (currentUser) {
    getUnreadNotifications(currentUser.id, "coach").then((result) => {
      if (result.success && result.notifications.length > 0) {
        const badge = document.getElementById("notification-badge")
        badge.textContent = result.notifications.length
        badge.classList.remove("hidden")
      }
    })
  }

  return navbar
}
