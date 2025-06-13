// Serviço para gerenciamento de notificações

// Configuração do EmailJS
const EMAILJS_CONFIG = {
  SERVICE_ID: "service_coachflow", // Substitua pelo seu service ID
  PUBLIC_KEY: "mH4Lr2yeMa_QJpkRa", // Substitua pela sua chave pública
  TEMPLATES: {
    nova_sessao: "template_nova_sessao",
    sessao_atualizada: "template_sessao_atualizada",
    sessao_cancelada: "template_sessao_cancelada",
    solicitar_feedback: "template_solicitar_feedback",
    padrao: "template_padrao",
  },
}

// Inicializar EmailJS se disponível
function initializeEmailJS() {
  try {
    if (typeof window.emailjs !== "undefined" && window.emailjs.init) {
      window.emailjs.init(EMAILJS_CONFIG.PUBLIC_KEY)
      console.log("EmailJS inicializado com sucesso")
      return true
    } else {
      console.log("EmailJS não está disponível")
      return false
    }
  } catch (error) {
    console.warn("Erro ao inicializar EmailJS:", error)
    return false
  }
}

// Verificar se EmailJS está configurado corretamente
function isEmailJSConfigured() {
  return (
    typeof window.emailjs !== "undefined" &&
    EMAILJS_CONFIG.PUBLIC_KEY !== "mH4Lr2yeMa_QJpkRa" && // Chave padrão não configurada
    EMAILJS_CONFIG.SERVICE_ID !== "service_coachflow" // Service ID padrão não configurado
  )
}

// Enviar notificação por email
async function sendSessionNotification(email, name, type, data) {
  console.log("Tentando enviar notificação por email:", { email, name, type, data })

  try {
    // Verificar se o EmailJS está disponível e configurado
    if (!isEmailJSConfigured()) {
      console.log("EmailJS não está configurado corretamente. Simulando envio de email:", {
        to: email,
        name: name,
        type: type,
        data: data,
        reason: "Configuração incompleta - chaves padrão detectadas",
      })
      return { success: true, simulated: true, reason: "EmailJS não configurado" }
    }

    // Inicializar EmailJS se necessário
    if (!initializeEmailJS()) {
      console.log("Falha ao inicializar EmailJS. Simulando envio.")
      return { success: true, simulated: true, reason: "Falha na inicialização" }
    }

    const templateParams = {
      to_email: email,
      to_name: name,
      from_name: "CoachFlow",
      ...data,
    }

    const templateId = EMAILJS_CONFIG.TEMPLATES[type] || EMAILJS_CONFIG.TEMPLATES.padrao
    let subject = ""

    switch (type) {
      case "nova_sessao":
        subject = "Nova sessão agendada - CoachFlow"
        templateParams.message = `Olá ${name}, uma nova sessão foi agendada para ${data.data} às ${data.hora}. Título: ${data.titulo}`
        break
      case "sessao_atualizada":
        subject = "Sessão atualizada - CoachFlow"
        templateParams.message = `Olá ${name}, sua sessão foi atualizada para ${data.data} às ${data.hora}. Título: ${data.titulo}`
        break
      case "sessao_cancelada":
        subject = "Sessão cancelada - CoachFlow"
        templateParams.message = `Olá ${name}, a sessão "${data.titulo}" agendada para ${data.data} às ${data.hora} foi cancelada.`
        break
      case "solicitar_feedback":
        subject = "Solicitação de feedback - CoachFlow"
        templateParams.message = `Olá ${name}, gostaríamos de receber seu feedback sobre a sessão "${data.titulo}". Acesse: ${data.feedback_link}`
        break
      default:
        subject = "Notificação CoachFlow"
        templateParams.message = `Olá ${name}, você tem uma nova notificação do CoachFlow.`
    }

    templateParams.subject = subject

    console.log("Enviando email com parâmetros:", templateParams)

    // Tentar enviar o email
    const response = await window.emailjs.send(EMAILJS_CONFIG.SERVICE_ID, templateId, templateParams)

    console.log("Email enviado com sucesso:", response)
    return { success: true, response }
  } catch (error) {
    console.warn("Erro ao enviar notificação por email:", error)

    // Simular envio bem-sucedido para não quebrar o fluxo
    console.log("Simulando envio de email devido ao erro:", {
      to: email,
      name: name,
      type: type,
      data: data,
      error: error.message,
    })

    return {
      success: true,
      simulated: true,
      error: error.message,
      reason: "Erro no envio, operação simulada",
    }
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

// Inicializar EmailJS quando o documento carregar
document.addEventListener("DOMContentLoaded", () => {
  setTimeout(() => {
    initializeEmailJS()
  }, 1000)
})

// Exportar funções para o escopo global
if (typeof window !== "undefined") {
  window.sendSessionNotification = sendSessionNotification
  window.getUnreadNotifications = getUnreadNotifications
  window.getAllNotifications = getAllNotifications
  window.markNotificationAsRead = markNotificationAsRead
  window.markAllNotificationsAsRead = markAllNotificationsAsRead
  window.initializeEmailJS = initializeEmailJS
  window.isEmailJSConfigured = isEmailJSConfigured
}
