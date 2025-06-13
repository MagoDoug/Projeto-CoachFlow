// Serviço para gerenciamento de feedbacks

// Obter todos os feedbacks de um coach
async function getFeedbacks(coachId) {
  try {
    const { data, error } = await window.supabase
      .from("feedbacks")
      .select(`
        *,
        sessoes (
          titulo
        ),
        clientes (
          nome
        )
      `)
      .eq("coach_id", coachId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, feedbacks: data }
  } catch (error) {
    console.error("Erro ao obter feedbacks:", error)
    return { success: false, error: error.message }
  }
}

// Obter feedbacks de um cliente específico
async function getClientFeedbacks(clientId) {
  try {
    const { data, error } = await window.supabase
      .from("feedbacks")
      .select(`
        *,
        sessoes (
          titulo,
          data
        )
      `)
      .eq("cliente_id", clientId)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, feedbacks: data }
  } catch (error) {
    console.error("Erro ao obter feedbacks do cliente:", error)
    return { success: false, error: error.message }
  }
}

// Obter feedback de uma sessão específica
async function getSessionFeedback(sessionId) {
  try {
    const { data, error } = await window.supabase.from("feedbacks").select("*").eq("sessao_id", sessionId).single()

    if (error && error.code !== "PGRST116") throw error // PGRST116 é o código para "nenhum resultado encontrado"

    return { success: true, feedback: data || null }
  } catch (error) {
    console.error("Erro ao obter feedback da sessão:", error)
    return { success: false, error: error.message }
  }
}

// Criar novo feedback
async function createFeedback(feedbackData) {
  try {
    // Verificar se o token de feedback é válido
    const { data: sessionData, error: sessionError } = await window.supabase
      .from("sessoes")
      .select("id, coach_id, cliente_id, feedback_token")
      .eq("id", feedbackData.sessao_id)
      .single()

    if (sessionError) throw sessionError

    if (sessionData.feedback_token !== feedbackData.token) {
      return { success: false, error: "Token de feedback inválido" }
    }

    // Verificar se já existe um feedback para esta sessão
    const { data: existingFeedback, error: existingError } = await window.supabase
      .from("feedbacks")
      .select("id")
      .eq("sessao_id", feedbackData.sessao_id)

    if (existingError) throw existingError

    if (existingFeedback && existingFeedback.length > 0) {
      return { success: false, error: "Já existe um feedback para esta sessão" }
    }

    // Criar o feedback
    const { data, error } = await window.supabase
      .from("feedbacks")
      .insert([
        {
          sessao_id: feedbackData.sessao_id,
          coach_id: sessionData.coach_id,
          cliente_id: sessionData.cliente_id,
          rating: feedbackData.rating,
          progress_rating: feedbackData.progress_rating,
          comentario: feedbackData.comentario,
          created_at: new Date(),
        },
      ])
      .select()

    if (error) throw error

    // Limpar o token de feedback
    await window.supabase.from("sessoes").update({ feedback_token: null }).eq("id", feedbackData.sessao_id)

    // Notificar o coach sobre o novo feedback
    const { data: coachData, error: coachError } = await window.supabase
      .from("coaches")
      .select("email")
      .eq("id", sessionData.coach_id)
      .single()

    if (!coachError && coachData) {
      // Registrar notificação no banco de dados
      await window.supabase.from("notificacoes").insert([
        {
          tipo: "novo_feedback",
          destinatario_id: sessionData.coach_id,
          destinatario_tipo: "coach",
          conteudo: `Novo feedback recebido para a sessão #${feedbackData.sessao_id} com avaliação ${feedbackData.rating}/5`,
          lida: false,
          created_at: new Date(),
        },
      ])
    }

    return { success: true, feedback: data[0] }
  } catch (error) {
    console.error("Erro ao criar feedback:", error)
    return { success: false, error: error.message }
  }
}

// Responder a um feedback
async function respondToFeedback(feedbackId, resposta) {
  try {
    const { data, error } = await window.supabase
      .from("feedbacks")
      .update({ resposta, resposta_data: new Date() })
      .eq("id", feedbackId)
      .select()

    if (error) throw error

    // Notificar o cliente sobre a resposta
    const { data: feedbackData, error: feedbackError } = await window.supabase
      .from("feedbacks")
      .select(`
        cliente_id,
        clientes (
          nome,
          email
        ),
        sessoes (
          titulo
        )
      `)
      .eq("id", feedbackId)
      .single()

    if (!feedbackError && feedbackData) {
      // Registrar notificação no banco de dados
      await window.supabase.from("notificacoes").insert([
        {
          tipo: "resposta_feedback",
          destinatario_id: feedbackData.cliente_id,
          destinatario_tipo: "cliente",
          conteudo: `O coach respondeu ao seu feedback para a sessão "${feedbackData.sessoes.titulo}"`,
          lida: false,
          created_at: new Date(),
        },
      ])
    }

    return { success: true, feedback: data[0] }
  } catch (error) {
    console.error("Erro ao responder feedback:", error)
    return { success: false, error: error.message }
  }
}

// Exportar funções para o escopo global
window.getFeedbacks = getFeedbacks
window.getClientFeedbacks = getClientFeedbacks
window.getSessionFeedback = getSessionFeedback
window.createFeedback = createFeedback
window.respondToFeedback = respondToFeedback
