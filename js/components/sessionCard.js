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
          <button class="request-feedback-btn text-sm bg-indigo-600 text-white px-3 py-1 rounded hover:bg-indigo-700" data-session-id="${session.id}">
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
            <button class="edit-session-btn text-sm bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600" data-session-id="${session.id}">
              <i class="fas fa-edit"></i>
            </button>
          `
              : ""
          }
          <button class="delete-session-btn text-sm bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600" data-session-id="${session.id}">
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
      editBtn.addEventListener("click", function (e) {
        e.stopPropagation()
        const sessionId = this.getAttribute("data-session-id")
        if (typeof window.editSession === "function") {
          window.editSession(sessionId)
        }
      })
    }

    // Botão de excluir sessão
    const deleteBtn = card.querySelector(".delete-session-btn")
    if (deleteBtn) {
      deleteBtn.addEventListener("click", function (e) {
        e.stopPropagation()
        const sessionId = this.getAttribute("data-session-id")
        if (confirm("Tem certeza que deseja excluir esta sessão?")) {
          if (typeof window.deleteSession === "function") {
            window.deleteSession(sessionId)
          }
        }
      })
    }

    // Botão de solicitar feedback - COM PROTEÇÃO CONTRA MÚLTIPLOS CLIQUES
    const requestFeedbackBtn = card.querySelector(".request-feedback-btn")
    if (requestFeedbackBtn) {
      requestFeedbackBtn.addEventListener("click", function (e) {
        e.stopPropagation()

        // Verificar se o botão já está processando
        if (this.disabled || this.classList.contains("processing")) {
          return
        }

        const sessionId = this.getAttribute("data-session-id")

        // Desabilitar o botão temporariamente
        this.disabled = true
        this.classList.add("processing")
        const originalText = this.innerHTML
        this.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Enviando...'

        if (typeof window.requestSessionFeedback === "function") {
          window
            .requestSessionFeedback(sessionId)
            .then((result) => {
              if (result && result.success) {
                window.showNotification("Solicitação de feedback enviada com sucesso!", "success")
              } else {
                window.showNotification(
                  "Erro ao solicitar feedback: " + (result?.error || "Erro desconhecido"),
                  "error",
                )
              }
            })
            .catch((error) => {
              console.error("Erro ao solicitar feedback:", error)
              window.showNotification("Ocorreu um erro ao solicitar feedback.", "error")
            })
            .finally(() => {
              // Reabilitar o botão após 3 segundos
              setTimeout(() => {
                this.disabled = false
                this.classList.remove("processing")
                this.innerHTML = originalText
              }, 3000)
            })
        }
      })
    }

    // Clicar no card para ver detalhes
    card.addEventListener("click", () => {
      if (typeof window.viewSessionDetails === "function") {
        window.viewSessionDetails(session.id)
      }
    })
  }

  return card
}

// Exportar para o escopo global
if (typeof window !== "undefined") {
  window.createSessionCard = createSessionCard
}
