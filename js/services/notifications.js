// Serviço para gerenciamento de notificações

// Enviar notificação por email
async function sendSessionNotification(email, name, type, data) {
  try {
    // Verificar se o emailjs está disponível e configurado
    if (typeof window.emailjs === "undefined" || !window.emailjs.send) {
      console.log("EmailJS não está disponível. Simulando envio de email:", {
        to: email,
        name: name,
        type: type,
        data: data,
      })
      return { success: true, simulated: true }
    }

    const templateParams = {
      to_email: email,
      to_name: name,
      ...data,
    }

    let templateId = ""
    let subject = ""

    switch (type) {
      case "nova_sessao":
        templateId = "template_nova_sessao"
        subject = "Nova sessão agendada"
        break
      case "sessao_atualizada":
        templateId = "template_sessao_atualizada"
        subject = "Sessão atualizada"
        break
      case "sessao_cancelada":
        templateId = "template_sessao_cancelada"
        subject = "Sessão cancelada"
        break
      case "solicitar_feedback":
        templateId = "template_solicitar_feedback"
        subject = "Solicitação de feedback"
        break
      default:
        templateId = "template_padrao"
        subject = "Notificação CoachFlow"
    }

    templateParams.subject = subject

    // Verificar se as configurações do EmailJS estão definidas
    const EMAILJS_SERVICE_ID = "seu_service_id_emailjs" // Substitua pela sua configuração

    if (EMAILJS_SERVICE_ID === "seu_service_id_emailjs") {
      console.log("EmailJS não configurado. Simulando envio de email:", {
        service: EMAILJS_SERVICE_ID,
        template: templateId,
        params: templateParams,
      })
      return { success: true, simulated: true }
    }

    // Tentar enviar o email
    await window.emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams)
    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar notificação por email:", error)
    // Não falhar a operação por causa do email
    return { success: true, error: error.message, simulated: true }
  }
}

// Obter notificações não lidas
async function getUnreadNotifications(userId, userType) {
  try {
    const { data, error } = await window.supabaseInstance
      .from("notificacoes")
      .select("*")
      .eq("destinatario_id", userId)
      .eq("destinatario_tipo", userType)
      .eq("lida", false)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, notifications: data }
  } catch (error) {
    console.error("Erro ao obter notificações não lidas:", error)
    return { success: false, error: error.message }
  }
}

// Obter todas as notificações
async function getAllNotifications(userId, userType) {
  try {
    const { data, error } = await window.supabaseInstance
      .from("notificacoes")
      .select("*")
      .eq("destinatario_id", userId)
      .eq("destinatario_tipo", userType)
      .order("created_at", { ascending: false })

    if (error) throw error

    return { success: true, notifications: data }
  } catch (error) {
    console.error("Erro ao obter todas as notificações:", error)
    return { success: false, error: error.message }
  }
}

// Marcar notificação como lida
async function markNotificationAsRead(notificationId) {
  try {
    const { error } = await window.supabaseInstance.from("notificacoes").update({ lida: true }).eq("id", notificationId)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao marcar notificação como lida:", error)
    return { success: false, error: error.message }
  }
}

// Marcar todas as notificações como lidas
async function markAllNotificationsAsRead(userId, userType) {
  try {
    const { error } = await window.supabaseInstance
      .from("notificacoes")
      .update({ lida: true })
      .eq("destinatario_id", userId)
      .eq("destinatario_tipo", userType)
      .eq("lida", false)

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao marcar todas as notificações como lidas:", error)
    return { success: false, error: error.message }
  }
}

// Exportar funções para o escopo global
window.sendSessionNotification = sendSessionNotification
window.getUnreadNotifications = getUnreadNotifications
window.getAllNotifications = getAllNotifications
window.markNotificationAsRead = markNotificationAsRead
window.markAllNotificationsAsRead = markAllNotificationsAsRead
