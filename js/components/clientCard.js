// Componente de card de cliente

function createClientCard(client, showActions = true) {
  const card = document.createElement("div")
  card.className = "bg-white rounded-lg shadow-md overflow-hidden card"
  card.id = `client-card-${client.id}`

  // Calcular progresso do cliente
  const calculateProgress = async () => {
    const result = await window.getClientProgress(client.id) // Assuming getClientProgress is a global function
    if (result.success) {
      const progressData = result.progress
      const totalSessions = result.totalSessions

      let progressValue = 0
      if (progressData.length > 0) {
        const totalProgress = progressData.reduce((sum, session) => sum + session.progressValue, 0)
        progressValue = Math.round((totalProgress / (progressData.length * 5)) * 100)
      }

      return {
        progressValue,
        totalSessions,
      }
    }
    return {
      progressValue: 0,
      totalSessions: 0,
    }
  }

  // Renderizar o card
  const renderCard = async () => {
    const { progressValue, totalSessions } = await calculateProgress()

    const progressColor = progressValue < 30 ? "bg-red-500" : progressValue < 70 ? "bg-yellow-500" : "bg-green-500"

    card.innerHTML = `
      <div class="p-5">
        <div class="flex justify-between items-start">
          <div>
            <h3 class="text-lg font-semibold text-gray-800">${client.nome}</h3>
            <p class="text-sm text-gray-600">${client.email}</p>
            <p class="text-xs text-gray-400">Progresso: ${progressValue}%</p>
          </div>
          ${showActions ? '<div><button class="bg-blue-500 text-white px-3 py-1 rounded">Ações</button></div>' : ""}
        </div>
        <div class="mt-4">
          <div class="bg-gray-200 rounded-full w-full">
            <div class="bg-blue-500 text-xs leading-none rounded-full text-center p-1" style="width:${progressValue}%"></div>
          </div>
          <p class="text-xs text-gray-600 mt-1">Total de sessões: ${totalSessions}</p>
        </div>
      </div>
    `
  }

  renderCard()

  return card
}
