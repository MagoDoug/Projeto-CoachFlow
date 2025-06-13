// Serviço para gerenciamento de clientes

// Obter todos os clientes de um coach
async function getClients(coachId) {
  try {
    const { data, error } = await window.supabase
      .from("clientes")
      .select("*")
      .eq("coach_id", coachId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, clients: data }
  } catch (error) {
    console.error("Erro ao obter clientes:", error)
    return { success: false, error: error.message }
  }
}

// Obter um cliente específico
async function getClient(clientId) {
  try {
    const { data, error } = await window.supabase.from("clientes").select("*").eq("id", clientId).single()

    if (error) throw error

    return { success: true, client: data }
  } catch (error) {
    console.error("Erro ao obter cliente:", error)
    return { success: false, error: error.message }
  }
}

// Criar novo cliente
async function createClient(coachId, clientData) {
  try {
    // Verificar limite do plano gratuito
    const planCheck = await window.checkPlanLimits(coachId)
    if (planCheck.limitReached && planCheck.type === "clients") {
      return {
        success: false,
        limitReached: true,
        error: planCheck.message,
      }
    }

    const { data, error } = await window.supabase
      .from("clientes")
      .insert([
        {
          ...clientData,
          coach_id: coachId,
          created_at: new Date(),
        },
      ])
      .select()

    if (error) throw error

    return { success: true, client: data[0] }
  } catch (error) {
    console.error("Erro ao criar cliente:", error)
    return { success: false, error: error.message }
  }
}

// Atualizar cliente
async function updateClient(clientId, clientData) {
  try {
    const { data, error } = await window.supabase.from("clientes").update(clientData).eq("id", clientId).select()

    if (error) throw error

    return { success: true, client: data[0] }
  } catch (error) {
    console.error("Erro ao atualizar cliente:", error)
    return { success: false, error: error.message }
  }
}

// Excluir cliente
async function deleteClient(clientId) {
  try {
    // Primeiro excluir todas as sessões e feedbacks relacionados
    const { error: sessionsError } = await window.supabase.from("sessoes").delete().eq("cliente_id", clientId)

    if (sessionsError) throw sessionsError

    const { error: feedbacksError } = await window.supabase.from("feedbacks").delete().eq("cliente_id", clientId)

    if (feedbacksError) throw feedbacksError

    // Agora excluir o cliente
    const { error } = await window.supabase.from("clientes").delete().eq("id", clientId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir cliente:", error)
    return { success: false, error: error.message }
  }
}

// Obter progresso do cliente
async function getClientProgress(clientId) {
  try {
    // Obter todas as sessões do cliente
    const { data: sessions, error: sessionsError } = await window.supabase
      .from("sessoes")
      .select("*")
      .eq("cliente_id", clientId)
      .order("data", { ascending: true })

    if (sessionsError) throw sessionsError

    // Obter todos os feedbacks do cliente
    const { data: feedbacks, error: feedbacksError } = await window.supabase
      .from("feedbacks")
      .select("*")
      .eq("cliente_id", clientId)
      .order("created_at", { ascending: true })

    if (feedbacksError) throw feedbacksError

    // Calcular progresso com base nas sessões e feedbacks
    const progressData = sessions.map((session, index) => {
      const sessionFeedback = feedbacks.find((f) => f.sessao_id === session.id)
      const progressValue = sessionFeedback ? sessionFeedback.progress_rating : 0

      return {
        sessionNumber: index + 1,
        date: session.data,
        progressValue,
        notes: session.notas,
      }
    })

    return {
      success: true,
      progress: progressData,
      totalSessions: sessions.length,
    }
  } catch (error) {
    console.error("Erro ao obter progresso do cliente:", error)
    return { success: false, error: error.message }
  }
}

// Exportar funções para o escopo global
window.getClients = getClients
window.getClient = getClient
window.createClient = createClient
window.updateClient = updateClient
window.deleteClient = deleteClient
window.getClientProgress = getClientProgress
