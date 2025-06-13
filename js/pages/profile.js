// Página de perfil

function renderProfilePage() {
  const appContainer = document.getElementById("app")

  // Verificar se o usuário está autenticado
  window.getCurrentSession().then(async (result) => {
    if (!result.success || !result.user) {
      window.navigateTo("login")
      return
    }

    const currentUser = result.user

    // Obter perfil do coach
    const profileResult = await window.getCoachProfile(currentUser.id)
    const profile = profileResult.success ? profileResult.coach : null

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
            <h1 class="text-2xl font-bold text-gray-800 mb-6">Meu Perfil</h1>
            
            <!-- Formulário de perfil -->
            <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl">
              <form id="profile-form">
                <div class="mb-4">
                  <label for="profile-name" class="block text-sm font-medium text-gray-700 mb-1">Nome</label>
                  <input type="text" id="profile-name" name="name" value="${profile?.name || ""}" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div class="mb-4">
                  <label for="profile-email" class="block text-sm font-medium text-gray-700 mb-1">Email</label>
                  <input type="email" id="profile-email" name="email" value="${profile?.email || currentUser.email}" disabled class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed">
                  <p class="text-xs text-gray-500 mt-1">O email não pode ser alterado</p>
                </div>
                <div class="mb-4">
                  <label for="profile-plan" class="block text-sm font-medium text-gray-700 mb-1">Plano Atual</label>
                  <input type="text" id="profile-plan" value="${profile?.plan || "Gratuito"}" disabled class="w-full px-3 py-2 border border-gray-300 rounded-md bg-gray-100 cursor-not-allowed">
                </div>
                <div class="flex justify-end">
                  <button type="submit" class="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
                    Salvar Alterações
                  </button>
                </div>
              </form>
            </div>
            
            <!-- Seção de alteração de senha -->
            <div class="bg-white rounded-lg shadow-md p-6 max-w-2xl mt-6">
              <h2 class="text-lg font-semibold text-gray-800 mb-4">Alterar Senha</h2>
              <form id="password-form">
                <div class="mb-4">
                  <label for="new-password" class="block text-sm font-medium text-gray-700 mb-1">Nova Senha</label>
                  <input type="password" id="new-password" name="password" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div class="mb-4">
                  <label for="confirm-password" class="block text-sm font-medium text-gray-700 mb-1">Confirmar Nova Senha</label>
                  <input type="password" id="confirm-password" name="confirmPassword" required class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
                </div>
                <div class="flex justify-end">
                  <button type="submit" class="bg-red-600 hover:bg-red-700 text-white font-bold py-2 px-4 rounded">
                    Alterar Senha
                  </button>
                </div>
              </form>
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

    // Adicionar event listeners
    document.getElementById("profile-form").addEventListener("submit", async (e) => {
      e.preventDefault()

      const formData = {
        name: document.getElementById("profile-name").value,
      }

      const result = await window.updateCoachProfile(currentUser.id, formData)

      if (result.success) {
        window.showNotification("Perfil atualizado com sucesso!", "success")
      } else {
        window.showNotification("Erro ao atualizar perfil: " + result.error, "error")
      }
    })

    document.getElementById("password-form").addEventListener("submit", async (e) => {
      e.preventDefault()

      const newPassword = document.getElementById("new-password").value
      const confirmPassword = document.getElementById("confirm-password").value

      if (newPassword !== confirmPassword) {
        window.showNotification("As senhas não coincidem.", "error")
        return
      }

      const result = await window.updatePassword(newPassword)

      if (result.success) {
        window.showNotification("Senha alterada com sucesso!", "success")
        document.getElementById("password-form").reset()
      } else {
        window.showNotification("Erro ao alterar senha: " + result.error, "error")
      }
    })
  })
}

// Exportar função para o escopo global
window.renderProfilePage = renderProfilePage
