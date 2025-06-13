// Página de autenticação

// Renderizar página de login
function renderLoginPage() {
  const appContainer = document.getElementById("app")

  appContainer.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">CoachFlow</h1>
          <p class="text-sm text-gray-600">Plataforma para coaches autônomos</p>
        </div>
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">Login</h2>
          <form id="login-form" class="space-y-6">
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
              <input id="password" name="password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div class="flex items-center justify-between">
              <div class="flex items-center">
                <input id="remember-me" name="remember-me" type="checkbox" class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded">
                <label for="remember-me" class="ml-2 block text-sm text-gray-900">Lembrar-me</label>
              </div>
              <div class="text-sm">
                <a href="#" id="forgot-password" class="font-medium text-indigo-600 hover:text-indigo-500">Esqueceu a senha?</a>
              </div>
            </div>
            <div>
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Entrar
              </button>
            </div>
            <div id="login-error" class="text-red-500 text-sm text-center hidden"></div>
          </form>
          <div class="mt-6">
            <div class="relative">
              <div class="absolute inset-0 flex items-center">
                <div class="w-full border-t border-gray-300"></div>
              </div>
              <div class="relative flex justify-center text-sm">
                <span class="px-2 bg-white text-gray-500">Ou</span>
              </div>
            </div>
            <div class="mt-6">
              <p class="text-center text-sm text-gray-600">
                Não tem uma conta?
                <a href="#" id="register-link" class="font-medium text-indigo-600 hover:text-indigo-500">
                  Registre-se
                </a>
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  `

  // Adicionar event listeners
  document.getElementById("login-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const errorElement = document.getElementById("login-error")

    // Mostrar loading
    const submitButton = e.target.querySelector("button[type='submit']")
    const originalButtonText = submitButton.innerHTML
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Entrando...'
    submitButton.disabled = true
    errorElement.classList.add("hidden")

    try {
      const result = await window.loginCoach(email, password)

      if (result.success) {
        // Login bem-sucedido, redirecionar para o dashboard
        window.navigateTo("dashboard")
      } else {
        // Exibir mensagem de erro
        errorElement.textContent = result.error || "Erro ao fazer login. Verifique suas credenciais."
        errorElement.classList.remove("hidden")
        submitButton.innerHTML = originalButtonText
        submitButton.disabled = false
      }
    } catch (error) {
      console.error("Erro ao fazer login:", error)
      errorElement.textContent = "Ocorreu um erro ao tentar fazer login. Tente novamente."
      errorElement.classList.remove("hidden")
      submitButton.innerHTML = originalButtonText
      submitButton.disabled = false
    }
  })

  document.getElementById("register-link").addEventListener("click", (e) => {
    e.preventDefault()
    window.navigateTo("register")
  })

  document.getElementById("forgot-password").addEventListener("click", (e) => {
    e.preventDefault()
    const email = document.getElementById("email").value
    if (email) {
      if (confirm(`Enviar email de recuperação de senha para ${email}?`)) {
        window.resetPassword(email).then((result) => {
          if (result.success) {
            alert("Email de recuperação enviado. Verifique sua caixa de entrada.")
          } else {
            alert("Erro ao enviar email de recuperação: " + (result.error || "Erro desconhecido"))
          }
        })
      }
    } else {
      alert("Por favor, informe seu email no campo acima.")
    }
  })
}

// Renderizar página de registro
function renderRegisterPage() {
  const appContainer = document.getElementById("app")

  appContainer.innerHTML = `
    <div class="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-md w-full space-y-8">
        <div class="text-center">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">CoachFlow</h1>
          <p class="text-sm text-gray-600">Plataforma para coaches autônomos</p>
        </div>
        <div class="bg-white p-8 rounded-lg shadow-md">
          <h2 class="text-center text-2xl font-bold text-gray-800 mb-6">Criar Conta</h2>
          <form id="register-form" class="space-y-6">
            <div>
              <label for="name" class="block text-sm font-medium text-gray-700">Nome</label>
              <input id="name" name="name" type="text" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="email" class="block text-sm font-medium text-gray-700">Email</label>
              <input id="email" name="email" type="email" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="password" class="block text-sm font-medium text-gray-700">Senha</label>
              <input id="password" name="password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <label for="confirm-password" class="block text-sm font-medium text-gray-700">Confirmar Senha</label>
              <input id="confirm-password" name="confirm-password" type="password" required class="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500">
            </div>
            <div>
              <button type="submit" class="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                Registrar
              </button>
            </div>
            <div id="register-error" class="text-red-500 text-sm text-center hidden"></div>
          </form>
          <div class="mt-6">
            <p class="text-center text-sm text-gray-600">
              Já tem uma conta?
              <a href="#" id="login-link" class="font-medium text-indigo-600 hover:text-indigo-500">
                Faça login
              </a>
            </p>
          </div>
        </div>
      </div>
    </div>
  `

  // Adicionar event listeners
  document.getElementById("register-form").addEventListener("submit", async (e) => {
    e.preventDefault()

    const name = document.getElementById("name").value
    const email = document.getElementById("email").value
    const password = document.getElementById("password").value
    const confirmPassword = document.getElementById("confirm-password").value
    const errorElement = document.getElementById("register-error")

    // Validar senhas
    if (password !== confirmPassword) {
      errorElement.textContent = "As senhas não coincidem."
      errorElement.classList.remove("hidden")
      return
    }

    // Mostrar loading
    const submitButton = e.target.querySelector("button[type='submit']")
    const originalButtonText = submitButton.innerHTML
    submitButton.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Registrando...'
    submitButton.disabled = true
    errorElement.classList.add("hidden")

    try {
      const result = await window.registerCoach(email, password, name)

      if (result.success) {
        // Registro bem-sucedido, redirecionar para o dashboard
        window.navigateTo("dashboard")
      } else {
        // Exibir mensagem de erro
        errorElement.textContent = result.error || "Erro ao registrar. Verifique os dados informados."
        errorElement.classList.remove("hidden")
        submitButton.innerHTML = originalButtonText
        submitButton.disabled = false
      }
    } catch (error) {
      console.error("Erro ao registrar:", error)
      errorElement.textContent = "Ocorreu um erro ao tentar registrar. Tente novamente."
      errorElement.classList.remove("hidden")
      submitButton.innerHTML = originalButtonText
      submitButton.disabled = false
    }
  })

  document.getElementById("login-link").addEventListener("click", (e) => {
    e.preventDefault()
    window.navigateTo("login")
  })
}

// Exportar funções para o escopo global
window.renderLoginPage = renderLoginPage
window.renderRegisterPage = renderRegisterPage
