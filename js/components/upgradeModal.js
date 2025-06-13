// Componente de modal de upgrade

function createUpgradeModal() {
  // Verificar se o modal já existe
  let modal = document.getElementById("upgrade-modal")
  if (modal) {
    return modal
  }

  // Criar o modal
  modal = document.createElement("div")
  modal.id = "upgrade-modal"
  modal.className = "fixed inset-0 z-50 flex items-center justify-center hidden"
  modal.innerHTML = `
    <div class="modal-overlay absolute inset-0 bg-black opacity-50"></div>
    <div class="modal-container bg-white w-11/12 md:max-w-md mx-auto rounded-lg shadow-lg z-50 overflow-y-auto">
      <div class="modal-content py-4 text-left px-6">
        <div class="flex justify-between items-center pb-3">
          <p class="text-2xl font-bold text-gray-800">Upgrade para Premium</p>
          <div class="modal-close cursor-pointer z-50">
            <i class="fas fa-times text-gray-500 hover:text-gray-800"></i>
          </div>
        </div>
        <div class="my-5">
          <p class="text-gray-700 mb-4">Atualize para o plano Premium e aproveite todos os recursos do CoachFlow sem limitações!</p>
          
          <div class="bg-gray-50 p-4 rounded-lg mb-4">
            <h3 class="font-semibold text-lg mb-2">Plano Gratuito (Atual)</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li><i class="fas fa-check text-green-500 mr-2"></i> Até 5 clientes</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i> Até 2 sessões por cliente</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i> Notificações por email</li>
              <li><i class="fas fa-times text-red-500 mr-2"></i> Recursos avançados</li>
            </ul>
          </div>
          
          <div class="bg-indigo-50 p-4 rounded-lg border-2 border-indigo-500">
            <h3 class="font-semibold text-lg mb-2 text-indigo-700">Plano Premium</h3>
            <ul class="text-sm text-gray-600 space-y-1">
              <li><i class="fas fa-check text-green-500 mr-2"></i> Clientes ilimitados</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i> Sessões ilimitadas</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i> Notificações por email</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i> Relatórios avançados</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i> Integração com calendário</li>
              <li><i class="fas fa-check text-green-500 mr-2"></i> Suporte prioritário</li>
            </ul>
            <p class="mt-3 font-semibold text-indigo-700">R$ 49,90/mês</p>
          </div>
        </div>
        <div class="mt-5 flex justify-end">
          <button class="modal-close-btn bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mr-2">
            Cancelar
          </button>
          <button class="upgrade-btn bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2 px-4 rounded">
            Fazer Upgrade
          </button>
        </div>
      </div>
    </div>
  `

  // Adicionar o modal ao body
  document.body.appendChild(modal)

  // Função para abrir o modal
  function openModal() {
    modal.classList.remove("hidden")
  }

  // Função para fechar o modal
  function closeModal() {
    modal.classList.add("hidden")
  }

  // Adicionar event listeners
  modal.querySelector(".modal-close").addEventListener("click", closeModal)
  modal.querySelector(".modal-close-btn").addEventListener("click", closeModal)
  modal.querySelector(".modal-overlay").addEventListener("click", closeModal)

  // Botão de upgrade
  modal.querySelector(".upgrade-btn").addEventListener("click", async () => {
    // Aqui você implementaria a integração com um gateway de pagamento
    alert("Funcionalidade de pagamento em desenvolvimento. Em breve você poderá fazer upgrade para o plano Premium!")
    closeModal()
  })

  // Retornar o objeto do modal com métodos para abrir e fechar
  return {
    open: openModal,
    close: closeModal,
    element: modal,
  }
}

// Função para mostrar o modal de upgrade
function showUpgradeModal() {
  const upgradeModal = createUpgradeModal()
  upgradeModal.open()
}

// Exportar a função para o escopo global
window.showUpgradeModal = showUpgradeModal
