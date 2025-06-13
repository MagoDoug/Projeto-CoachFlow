// Página de configuração do sistema

function renderSetupPage() {
  const appContainer = document.getElementById("app")

  appContainer.innerHTML = `
    <div class="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-4xl mx-auto">
        <div class="text-center mb-8">
          <h1 class="text-3xl font-extrabold text-gray-900 mb-2">Configuração do CoachFlow</h1>
          <p class="text-lg text-gray-600">Configure os serviços externos para funcionalidade completa</p>
        </div>

        <!-- Status dos Serviços -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Status dos Serviços</h2>
          
          <div class="space-y-4">
            <!-- Supabase -->
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center">
                <div class="w-3 h-3 rounded-full bg-green-500 mr-3"></div>
                <div>
                  <h3 class="font-medium">Supabase Database</h3>
                  <p class="text-sm text-gray-600">Banco de dados e autenticação</p>
                </div>
              </div>
              <span class="text-green-600 font-medium">Conectado</span>
            </div>

            <!-- EmailJS -->
            <div class="flex items-center justify-between p-4 border rounded-lg">
              <div class="flex items-center">
                <div id="emailjs-status" class="w-3 h-3 rounded-full bg-yellow-500 mr-3"></div>
                <div>
                  <h3 class="font-medium">EmailJS</h3>
                  <p class="text-sm text-gray-600">Envio de notificações por email</p>
                </div>
              </div>
              <span id="emailjs-status-text" class="text-yellow-600 font-medium">Não Configurado</span>
            </div>
          </div>
        </div>

        <!-- Configuração EmailJS -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Configurar EmailJS</h2>
          
          <div class="prose max-w-none mb-6">
            <p class="text-gray-600">Para habilitar o envio de notificações por email, configure o EmailJS:</p>
            
            <ol class="list-decimal list-inside space-y-2 text-sm text-gray-600">
              <li>Acesse <a href="https://dashboard.emailjs.com/" target="_blank" class="text-indigo-600 hover:text-indigo-800">dashboard.emailjs.com</a></li>
              <li>Crie uma conta ou faça login</li>
              <li>Crie um novo serviço de email (Gmail, Outlook, etc.)</li>
              <li>Vá em "Account" > "General" e copie sua chave pública</li>
              <li>Crie templates de email para as notificações</li>
              <li>Atualize o arquivo <code>js/config/emailjs.js</code> com suas configurações</li>
            </ol>
          </div>

          <div class="bg-gray-50 rounded-lg p-4">
            <h3 class="font-medium mb-2">Configuração Atual:</h3>
            <pre id="emailjs-config" class="text-sm text-gray-600 overflow-x-auto"></pre>
          </div>

          <div class="mt-4">
            <button id="test-emailjs" class="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">
              Testar Configuração
            </button>
            <button id="reload-config" class="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 ml-2">
              Recarregar Configuração
            </button>
          </div>
        </div>

        <!-- Templates de Email -->
        <div class="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 class="text-xl font-semibold text-gray-800 mb-4">Templates de Email Sugeridos</h2>
          
          <div class="space-y-4">
            <div class="border rounded-lg p-4">
              <h3 class="font-medium mb-2">Template: Nova Sessão</h3>
              <div class="bg-gray-50 rounded p-3 text-sm">
                <p><strong>Subject:</strong> Nova sessão agendada - {{from_name}}</p>
                <p><strong>Variáveis:</strong> {{to_name}}, {{titulo}}, {{data}}, {{hora}}</p>
              </div>
            </div>

            <div class="border rounded-lg p-4">
              <h3 class="font-medium mb-2">Template: Solicitar Feedback</h3>
              <div class="bg-gray-50 rounded p-3 text-sm">
                <p><strong>Subject:</strong> Solicitação de feedback - {{from_name}}</p>
                <p><strong>Variáveis:</strong> {{to_name}}, {{titulo}}, {{feedback_link}}</p>
              </div>
            </div>
          </div>
        </div>

        <!-- Botões de Ação -->
        <div class="text-center">
          <button id="continue-setup" class="bg-indigo-600 text-white px-6 py-3 rounded-lg hover:bg-indigo-700 mr-4">
            Continuar para Dashboard
          </button>
          <button id="skip-setup" class="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700">
            Pular Configuração
          </button>
        </div>
      </div>
    </div>
  `

  // Atualizar status do EmailJS
  updateEmailJSStatus()

  // Event listeners
  document.getElementById("test-emailjs").addEventListener("click", testEmailJSConfiguration)
  document.getElementById("reload-config").addEventListener("click", reloadEmailJSConfig)
  document.getElementById("continue-setup").addEventListener("click", () => window.navigateTo("dashboard"))
  document.getElementById("skip-setup").addEventListener("click", () => window.navigateTo("dashboard"))
}

function updateEmailJSStatus() {
  const isConfigured = window.checkEmailJSConfiguration ? window.checkEmailJSConfiguration() : false
  const statusDot = document.getElementById("emailjs-status")
  const statusText = document.getElementById("emailjs-status-text")
  const configPre = document.getElementById("emailjs-config")

  if (isConfigured) {
    statusDot.className = "w-3 h-3 rounded-full bg-green-500 mr-3"
    statusText.textContent = "Configurado"
    statusText.className = "text-green-600 font-medium"
  } else {
    statusDot.className = "w-3 h-3 rounded-full bg-yellow-500 mr-3"
    statusText.textContent = "Não Configurado"
    statusText.className = "text-yellow-600 font-medium"
  }

  // Mostrar configuração atual
  if (window.EMAILJS_CONFIG) {
    configPre.textContent = JSON.stringify(
      {
        SERVICE_ID: window.EMAILJS_CONFIG.SERVICE_ID,
        PUBLIC_KEY: window.EMAILJS_CONFIG.PUBLIC_KEY ? "***configurado***" : "não configurado",
        ENABLED: window.EMAILJS_CONFIG.ENABLED,
      },
      null,
      2,
    )
  }
}

function testEmailJSConfiguration() {
  const button = document.getElementById("test-emailjs")
  button.disabled = true
  button.textContent = "Testando..."

  // Simular teste
  setTimeout(() => {
    const isConfigured = window.checkEmailJSConfiguration ? window.checkEmailJSConfiguration() : false

    if (isConfigured) {
      window.showNotification("Configuração do EmailJS está correta!", "success")
    } else {
      window.showNotification(
        "EmailJS não está configurado corretamente. Verifique o arquivo de configuração.",
        "error",
      )
    }

    button.disabled = false
    button.textContent = "Testar Configuração"
  }, 2000)
}

function reloadEmailJSConfig() {
  // Recarregar a página para aplicar novas configurações
  location.reload()
}

// Exportar para o escopo global
if (typeof window !== "undefined") {
  window.renderSetupPage = renderSetupPage
}
