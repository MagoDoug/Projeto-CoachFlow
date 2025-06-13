// Serviço para gerenciamento de sessões

// Obter todas as sessões de um coach
async function getSessions(coachId) {
  try {
    const { data, error } = await window.supabase
      .from("sessoes")
      .select(`
        *,
        clientes (
          id,
          nome,
          email
        )
      `)
      .eq("coach_id", coachId)
      .order("data", { ascending: false })

    if (error) throw error

    return { success: true, sessions: data }
  } catch (error) {
    console.error("Erro ao obter sessões:", error)
    return { success: false, error: error.message }
  }
}

// Obter sessões de um cliente específico
async function getClientSessions(clientId) {
  try {
    const { data, error } = await window.supabase
      .from("sessoes")
      .select("*")
      .eq("cliente_id", clientId)
      .order("data", { ascending: false })

    if (error) throw error

    return { success: true, sessions: data }
  } catch (error) {
    console.error("Erro ao obter sessões do cliente:", error)
    return { success: false, error: error.message }
  }
}

// Obter uma sessão específica
async function getSession(sessionId) {
  try {
    const { data, error } = await window.supabase
      .from("sessoes")
      .select(`
        *,
        clientes (
          id,
          nome,
          email
        )
      `)
      .eq("id", sessionId)
      .single()

    if (error) throw error

    return { success: true, session: data }
  } catch (error) {
    console.error("Erro ao obter sessão:", error)
    return { success: false, error: error.message }
  }
}

// Criar nova sessão
async function createSession(coachId, sessionData) {
  try {
    // Verificar limite do plano gratuito
    const { data: existingSessions, error: countError } = await window.supabase
      .from("sessoes")
      .select("id")
      .eq("cliente_id", sessionData.cliente_id)

    if (countError) throw countError

    if (existingSessions.length >= window.FREE_PLAN_LIMITS.MAX_SESSIONS_PER_CLIENT) {
      return {
        success: false,
        limitReached: true,
        error: `Você atingiu o limite de ${window.FREE_PLAN_LIMITS.MAX_SESSIONS_PER_CLIENT} sessões por cliente do plano gratuito.`,
      }
    }

    const { data, error } = await window.supabase
      .from("sessoes")
      .insert([
        {
          ...sessionData,
          coach_id: coachId,
          created_at: new Date(),
        },
      ])
      .select()

    if (error) throw error

    // Enviar notificação ao cliente sobre a nova sessão
    const { data: clientData, error: clientError } = await window.supabase
      .from("clientes")
      .select("nome, email")
      .eq("id", sessionData.cliente_id)
      .single()

    if (!clientError && clientData) {
      await window.sendSessionNotification(clientData.email, clientData.nome, "nova_sessao", {
        data: window.formatDate(sessionData.data),
        hora: window.formatTime(sessionData.data),
        titulo: sessionData.titulo,
      })

      // Registrar notificação no banco de dados
      await window.supabase.from("notificacoes").insert([
        {
          tipo: "nova_sessao",
          destinatario_id: sessionData.cliente_id,
          destinatario_tipo: "cliente",
          conteudo: `Nova sessão agendada: ${sessionData.titulo} para ${window.formatDate(sessionData.data)} às ${window.formatTime(sessionData.data)}`,
          lida: false,
          created_at: new Date(),
        },
      ])
    }

    return { success: true, session: data[0] }
  } catch (error) {
    console.error("Erro ao criar sessão:", error)
    return { success: false, error: error.message }
  }
}

// Atualizar sessão
async function updateSession(sessionId, sessionData) {
  try {
    const { data, error } = await window.supabase.from("sessoes").update(sessionData).eq("id", sessionId).select()

    if (error) throw error

    // Enviar notificação ao cliente sobre a atualização da sessão
    const { data: sessionInfo, error: sessionError } = await window.supabase
      .from("sessoes")
      .select(`
        cliente_id,
        clientes (
          nome,
          email
        )
      `)
      .eq("id", sessionId)
      .single()

    if (!sessionError && sessionInfo) {
      await window.sendSessionNotification(sessionInfo.clientes.email, sessionInfo.clientes.nome, "sessao_atualizada", {
        data: window.formatDate(sessionData.data),
        hora: window.formatTime(sessionData.data),
        titulo: sessionData.titulo,
      })

      // Registrar notificação no banco de dados
      await window.supabase.from("notificacoes").insert([
        {
          tipo: "sessao_atualizada",
          destinatario_id: sessionInfo.cliente_id,
          destinatario_tipo: "cliente",
          conteudo: `Sessão atualizada: ${sessionData.titulo} para ${window.formatDate(sessionData.data)} às ${window.formatTime(sessionData.data)}`,
          lida: false,
          created_at: new Date(),
        },
      ])
    }

    return { success: true, session: data[0] }
  } catch (error) {
    console.error("Erro ao atualizar sessão:", error)
    return { success: false, error: error.message }
  }
}

// Excluir sessão
async function deleteSession(sessionId) {
  try {
    // Primeiro obter informações da sessão para notificação
    const { data: sessionInfo, error: sessionError } = await window.supabase
      .from("sessoes")
      .select(`
        titulo,
        data,
        cliente_id,
        clientes (
          nome,
          email
        )
      `)
      .eq("id", sessionId)
      .single()

    // Excluir feedbacks relacionados
    const { error: feedbacksError } = await window.supabase.from("feedbacks").delete().eq("sessao_id", sessionId)

    if (feedbacksError) throw feedbacksError

    // Agora excluir a sessão
    const { error } = await window.supabase.from("sessoes").delete().eq("id", sessionId)

    if (error) throw error

    // Enviar notificação ao cliente sobre o cancelamento da sessão
    if (!sessionError && sessionInfo) {
      await window.sendSessionNotification(sessionInfo.clientes.email, sessionInfo.clientes.nome, "sessao_cancelada", {
        titulo: sessionInfo.titulo,
        data: window.formatDate(sessionInfo.data),
        hora: window.formatTime(sessionInfo.data),
      })

      // Registrar notificação no banco de dados
      await window.supabase.from("notificacoes").insert([
        {
          tipo: "sessao_cancelada",
          destinatario_id: sessionInfo.cliente_id,
          destinatario_tipo: "cliente",
          conteudo: `Sessão cancelada: ${sessionInfo.titulo} que estava agendada para ${window.formatDate(sessionInfo.data)} às ${window.formatTime(sessionInfo.data)}`,
          lida: false,
          created_at: new Date(),
        },
      ])
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir sessão:", error)
    return { success: false, error: error.message }
  }
}

// Solicitar feedback de uma sessão
async function requestSessionFeedback(sessionId) {
  try {
    const { data: sessionInfo, error: sessionError } = await window.supabase
      .from("sessoes")
      .select(`
        titulo,
        cliente_id,
        clientes (
          nome,
          email
        )
      `)
      .eq("id", sessionId)
      .single()

    if (sessionError) throw sessionError

    // Gerar um token único para o feedback
    const feedbackToken = Math.random().toString(36).substring(2, 15)

    // Salvar o token no banco de dados
    const { error: tokenError } = await window.supabase
      .from("sessoes")
      .update({ feedback_token: feedbackToken })
      .eq("id", sessionId)

    if (tokenError) throw tokenError

    // Enviar email solicitando feedback
    await window.sendSessionNotification(sessionInfo.clientes.email, sessionInfo.clientes.nome, "solicitar_feedback", {
      titulo: sessionInfo.titulo,
      feedback_link: `${window.location.origin}/feedback?token=${feedbackToken}&session=${sessionId}`,
    })

    // Registrar notificação no banco de dados
    await window.supabase.from("notificacoes").insert([
      {
        tipo: "solicitar_feedback",
        destinatario_id: sessionInfo.cliente_id,
        destinatario_tipo: "cliente",
        conteudo: `Solicitação de feedback para a sessão: ${sessionInfo.titulo}`,
        lida: false,
        created_at: new Date(),
      },
    ])

    return { success: true }
  } catch (error) {
    console.error("Erro ao solicitar feedback:", error)
    return { success: false, error: error.message }
  }
}

// Exportar funções para o escopo global
window.getSessions = getSessions
window.getClientSessions = getClientSessions
window.getSession = getSession
window.createSession = createSession
window.updateSession = updateSession
window.deleteSession = deleteSession
window.requestSessionFeedback = requestSessionFeedback
