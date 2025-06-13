// Serviço para gerenciamento de coaches

// Obter perfil do coach
async function getCoachProfile(coachId) {
  try {
    const { data, error } = await window.supabase.from("coaches").select("*").eq("id", coachId).single()

    if (error) throw error

    return { success: true, coach: data }
  } catch (error) {
    console.error("Erro ao obter perfil do coach:", error)
    return { success: false, error: error.message }
  }
}

// Atualizar perfil do coach
async function updateCoachProfile(coachId, profileData) {
  try {
    const { data, error } = await window.supabase.from("coaches").update(profileData).eq("id", coachId)

    if (error) throw error

    return { success: true, coach: data }
  } catch (error) {
    console.error("Erro ao atualizar perfil do coach:", error)
    return { success: false, error: error.message }
  }
}

// Atualizar plano do coach
async function updateCoachPlan(coachId, plan) {
  try {
    const { data, error } = await window.supabase.from("coaches").update({ plan }).eq("id", coachId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar plano do coach:", error)
    return { success: false, error: error.message }
  }
}

// Obter estatísticas do coach
async function getCoachStats(coachId) {
  try {
    // Obter contagem de clientes
    const { data: clients, error: clientsError } = await window.supabase
      .from("clientes")
      .select("id")
      .eq("coach_id", coachId)

    if (clientsError) throw clientsError

    // Obter contagem de sessões
    const { data: sessions, error: sessionsError } = await window.supabase
      .from("sessoes")
      .select("id, cliente_id")
      .eq("coach_id", coachId)

    if (sessionsError) throw sessionsError

    // Obter contagem de feedbacks
    const { data: feedbacks, error: feedbacksError } = await window.supabase
      .from("feedbacks")
      .select("id, rating")
      .eq("coach_id", coachId)

    if (feedbacksError) throw feedbacksError

    // Calcular média de avaliações
    let averageRating = 0
    if (feedbacks.length > 0) {
      const totalRating = feedbacks.reduce((sum, feedback) => sum + feedback.rating, 0)
      averageRating = totalRating / feedbacks.length
    }

    return {
      success: true,
      stats: {
        clientCount: clients.length,
        sessionCount: sessions.length,
        feedbackCount: feedbacks.length,
        averageRating,
      },
    }
  } catch (error) {
    console.error("Erro ao obter estatísticas do coach:", error)
    return { success: false, error: error.message }
  }
}

// Exportar funções para o escopo global
window.getCoachProfile = getCoachProfile
window.updateCoachProfile = updateCoachProfile
window.updateCoachPlan = updateCoachPlan
window.getCoachStats = getCoachStats
