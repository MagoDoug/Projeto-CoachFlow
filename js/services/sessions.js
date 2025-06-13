// Serviço para gerenciamento de sessões

// Obter todas as sessões de um coach
async function getSessions(coachId) {
  try {
    const { data, error } = await window.supabaseInstance
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
    const { data, error } = await window.supabaseInstance
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
    const { data, error } = await window.supabaseInstance
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
    const { data: existingSessions, error: countError } = await window.supabaseInstance
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

    const { data, error } = await window.supabaseInstance
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
    try {
      const { data: clientData, error: clientError } = await window.supabaseInstance
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
        await window.supabaseInstance.from("notificacoes").insert([
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
    } catch (notificationError) {
      console.warn("Erro ao enviar notificação:", notificationError)
      // Não falhar a criação da sessão por causa da notificação
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
    const { data, error } = await window.supabaseInstance
      .from("sessoes")
      .update(sessionData)
      .eq("id", sessionId)
      .select()

    if (error) throw error

    // Enviar notificação ao cliente sobre a atualização da sessão
    try {
      const { data: sessionInfo, error: sessionError } = await window.supabaseInstance
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
        await window.sendSessionNotification(
          sessionInfo.clientes.email,
          sessionInfo.clientes.nome,
          "sessao_atualizada",
          {
            data: window.formatDate(sessionData.data),
            hora: window.formatTime(sessionData.data),
            titulo: sessionData.titulo,
          },
        )

        // Registrar notificação no banco de dados
        await window.supabaseInstance.from("notificacoes").insert([
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
    } catch (notificationError) {
      console.warn("Erro ao enviar notificação:", notificationError)
      // Não falhar a atualização da sessão por causa da notificação
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
    const { data: sessionInfo, error: sessionError } = await window.supabaseInstance
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
    const { error: feedbacksError } = await window.supabaseInstance
      .from("feedbacks")
      .delete()
      .eq("sessao_id", sessionId)

    if (feedbacksError) throw feedbacksError

    // Agora excluir a sessão
    const { error } = await window.supabaseInstance.from("sessoes").delete().eq("id", sessionId)

    if (error) throw error

    // Enviar notificação ao cliente sobre o cancelamento da sessão
    try {
      if (!sessionError && sessionInfo) {
        await window.sendSessionNotification(
          sessionInfo.clientes.email,
          sessionInfo.clientes.nome,
          "sessao_cancelada",
          {
            titulo: sessionInfo.titulo,
            data: window.formatDate(sessionInfo.data),
            hora: window.formatTime(sessionInfo.data),
          },
        )

        // Registrar notificação no banco de dados
        await window.supabaseInstance.from("notificacoes").insert([
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
    } catch (notificationError) {
      console.warn("Erro ao enviar notificação:", notificationError)
      // Não falhar a exclusão da sessão por causa da notificação
    }

    return { success: true }
  } catch (error) {
    console.error("Erro ao excluir sessão:", error)
    return { success: false, error: error.message }
  }
}

// Solicitar feedback de uma sessão - VERSÃO COMPLETAMENTE REESCRITA
async function requestSessionFeedback(sessionId) {
  console.log("Iniciando solicitação de feedback para sessão:", sessionId)

  // Verificar se já está processando esta sessão
  if (window.processingFeedbackRequest && window.processingFeedbackRequest[sessionId]) {
    console.log("Já está processando feedback para esta sessão")
    return { success: false, error: "Solicitação já em andamento" }
  }

  // Marcar como processando
  if (!window.processingFeedbackRequest) {
    window.processingFeedbackRequest = {}
  }
  window.processingFeedbackRequest[sessionId] = true

  try {
    // Obter informações da sessão
    const { data: sessionInfo, error: sessionError } = await window.supabaseInstance
      .from("sessoes")
      .select(`
        id,
        titulo,
        cliente_id,
        feedback_token,
        clientes (
          nome,
          email
        )
      `)
      .eq("id", sessionId)
      .single()

    if (sessionError) {
      console.error("Erro ao obter informações da sessão:", sessionError)
      throw sessionError
    }

    if (!sessionInfo) {
      throw new Error("Sessão não encontrada")
    }

    console.log("Informações da sessão obtidas:", sessionInfo)

    // Gerar um token único para o feedback se não existir
    let feedbackToken = sessionInfo.feedback_token
    if (!feedbackToken) {
      feedbackToken = `feedback_${Date.now()}_${Math.random().toString(36).substring(2, 15)}`

      // Salvar o token no banco de dados
      const { error: tokenError } = await window.supabaseInstance
        .from("sessoes")
        .update({ feedback_token: feedbackToken })
        .eq("id", sessionId)

      if (tokenError) {
        console.error("Erro ao salvar token de feedback:", tokenError)
        throw tokenError
      }
    }

    console.log("Token de feedback gerado/obtido:", feedbackToken)

    // Enviar email solicitando feedback
    try {
      await window.sendSessionNotification(
        sessionInfo.clientes.email,
        sessionInfo.clientes.nome,
        "solicitar_feedback",
        {
          titulo: sessionInfo.titulo,
          feedback_link: `${window.location.origin}/feedback?token=${feedbackToken}&session=${sessionId}`,
        },
      )
      console.log("Email de solicitação de feedback enviado")
    } catch (emailError) {
      console.warn("Erro ao enviar email:", emailError)
      // Continuar mesmo se o email falhar
    }

    // Registrar notificação no banco de dados
    try {
      await window.supabaseInstance.from("notificacoes").insert([
        {
          tipo: "solicitar_feedback",
          destinatario_id: sessionInfo.cliente_id,
          destinatario_tipo: "cliente",
          conteudo: `Solicitação de feedback para a sessão: ${sessionInfo.titulo}`,
          lida: false,
          created_at: new Date(),
        },
      ])
      console.log("Notificação registrada no banco de dados")
    } catch (notificationError) {
      console.warn("Erro ao registrar notificação:", notificationError)
      // Continuar mesmo se a notificação falhar
    }

    console.log("Solicitação de feedback concluída com sucesso")
    return { success: true }
  } catch (error) {
    console.error("Erro ao solicitar feedback:", error)
    return { success: false, error: error.message }
  } finally {
    // Limpar o flag de processamento
    if (window.processingFeedbackRequest) {
      delete window.processingFeedbackRequest[sessionId]
    }
  }
}

// Exportar funções para o escopo global - SEM RECURSÃO
if (typeof window !== "undefined") {
  window.getSessions = getSessions
  window.getClientSessions = getClientSessions
  window.getSession = getSession
  window.createSession = createSession
  window.updateSession = updateSession
  window.deleteSession = deleteSession
  window.requestSessionFeedback = requestSessionFeedback
}
