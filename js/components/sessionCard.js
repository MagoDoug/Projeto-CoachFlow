// Componente de card de sessão

function createSessionCard(session, showActions = true) {
  const card = document.createElement("div")
  card.className = "bg-white rounded-lg shadow-md overflow-hidden card"
  card.id = `session-card-${session.id}`

  // Formatar data e hora
  const sessionDate = new Date(session.data)
  const formattedDate = sessionDate.toLocaleDateString("pt-BR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  })
  const formattedTime = sessionDate.toLocaleTimeString("pt-BR", {
    hour: "2-digit",
    minute: "2-digit",
  })

  // Verificar se a sessão já aconteceu
  const isPast = sessionDate < new Date()
  const statusClass = isPast ? "bg-gray-500" : "bg-green-500"
  const statusText = isPast ? "Concluída" : "Agendada"

  // Verificar se tem feedback
  const hasFeedback = session.feedback && session.feedback.id

  card.innerHTML = `
    <div class="p-5">
      <div class="flex justify-between items-start">
        <div>
          <h3 class="text-lg font-semibold text-gray-800">${session.titulo}</h3>
          <p class="text-sm text-gray-600">
            <i class="fas fa-user mr-1"></i> 
            ${session.clientes ? session.clientes.nome : "Cliente"}
          </p>
          <p class="text-sm text-gray-600">
            <i class="fas fa-calendar-alt mr-1"></i> 
            ${formattedDate} às ${formattedTime}
          </p>
          <p class="text-sm text-gray-600">
            <i class="fas fa-clock mr-1"></i> 
            ${session.duracao} minutos
          </p>
        </div>
        <div>
          <span class="inline-block px-2 py-1 text-xs text-white rounded-full ${statusClass}">
            ${statusText}
          </span>
        </div>
      </div>
      
      ${
        session.notas
          ? `
        <div class="mt-3 pt-3 border-t border-gray-100">
          <p class="text-sm text-gray-700"><strong>Notas:</strong> ${session.notas}</p>
        </div>
      `
          : ""
      }
      
      ${
        hasFeedback
          ? `
        <div class="mt-3 pt-3 border-t border-gray-100">
          <div class="flex items-center">
            <p class="text-sm font-medium text-gray-700">Feedback: </p>
            <div class="ml-2">
              ${Array(5)
                .fill()
                .map((_, i) => {
                  return `<i class="fas fa-star ${
                    i < session.feedback.rating ? "text-yellow-400" : "text-gray-300"
                  }"></i>`
                })
                .join("")}
            </div>
          </div>
        </div>
      `
          : ""
      }
      
      ${
        showActions && !hasFeedback && isPast
          ? `
        <div class="mt-3 pt-3 border-t border-gray-100">
          <button class="request-feedback-btn text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700">
            Solicitar Feedback
          </button>
        </div>
      `
          : ""
      }
      
      ${
        showActions
          ? `
        <div class="mt-3 pt-3 border-t border-gray-100 flex justify-end space-x-2">
          ${
            !isPast
              ? `
            <button class="edit-session-btn text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
              <i class="fas fa-edit"></i>
            </button>
          `
              : ""
          }
          <button class="delete-session-btn text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600">
            <i class="fas fa-trash"></i>
          </button>
        </div>
      `
          : ""
      }
    </div>
  `

  // Adicionar event listeners se showActions for true
  if (showActions) {
    // Botão de editar sessão
    const editBtn = card.querySelector(".edit-session-btn")
    if (editBtn) {
      editBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        window.editSession(session.id) // Assuming editSession is a global function
      })
    }

    // Botão de excluir sessão
    const deleteBtn = card.querySelector(".delete-session-btn")
    if (deleteBtn) {
      deleteBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        if (confirm("Tem certeza que deseja excluir esta sessão?")) {
          window.deleteSession(session.id) // Assuming deleteSession is a global function
        }
      })
    }

    // Botão de solicitar feedback
    const requestFeedbackBtn = card.querySelector(".request-feedback-btn")
    if (requestFeedbackBtn) {
      requestFeedbackBtn.addEventListener("click", (e) => {
        e.stopPropagation()
        window.requestSessionFeedback(session.id) // Assuming requestSessionFeedback is a global function
      })
    }

    // Clicar no card para ver detalhes
    card.addEventListener("click", () => {
      window.viewSessionDetails(session.id) // Assuming viewSessionDetails is a global function
    })
  }

  return card
}
