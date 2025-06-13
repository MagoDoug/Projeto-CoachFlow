// Serviço para gerenciamento de notificações

// Verificar se EmailJS está configurado corretamente - VERSÃO MAIS PERMISSIVA
function isEmailJSConfigured() {
  const config = window.EMAILJS_CONFIG || {}

  // Verificar se EmailJS está disponível e tem configurações básicas
  const emailJSAvailable = typeof window.emailjs !== "undefined"
  const hasServiceId = config.SERVICE_ID && config.SERVICE_ID.length > 0
  const hasPublicKey = config.PUBLIC_KEY && config.PUBLIC_KEY.length > 0

  const isConfigured = emailJSAvailable && config.ENABLED === true && hasServiceId && hasPublicKey

  console.log("🔍 Verificação detalhada do EmailJS:")
  console.log("- EmailJS carregado:", emailJSAvailable)
  console.log("- Configuração habilitada:", config.ENABLED)
  console.log("- Service ID presente:", hasServiceId, "(" + config.SERVICE_ID + ")")
  console.log("- Public Key presente:", hasPublicKey)
  console.log("- Resultado final:", isConfigured ? "✅ CONFIGURADO" : "❌ NÃO CONFIGURADO")

  return isConfigured
}

// Inicializar EmailJS se disponível
function initializeEmailJS() {
  try {
    const config = window.EMAILJS_CONFIG || {}

    if (typeof window.emailjs !== "undefined" && window.emailjs.init && config.PUBLIC_KEY) {
      window.emailjs.init(config.PUBLIC_KEY)
      console.log("✅ EmailJS inicializado com sucesso com a chave:", config.PUBLIC_KEY)
      return true
    } else {
      console.log("❌ EmailJS não pode ser inicializado:")
      console.log("- EmailJS disponível:", typeof window.emailjs !== "undefined")
      console.log("- Método init disponível:", !!(window.emailjs && window.emailjs.init))
      console.log("- Public Key disponível:", !!config.PUBLIC_KEY)
      return false
    }
  } catch (error) {
    console.warn("❌ Erro ao inicializar EmailJS:", error)
    return false
  }
}

// Enviar notificação por email - VERSÃO CORRIGIDA COM MÚLTIPLOS CAMPOS
async function sendSessionNotification(email, name, type, data) {
  console.log("📧 === INICIANDO ENVIO DE EMAIL ===")
  console.log("Parâmetros recebidos:", { email, name, type, data })

  // VALIDAÇÃO DOS PARÂMETROS DE ENTRADA
  if (!email || email.trim() === "") {
    console.error("❌ ERRO: Email do destinatário está vazio!")
    console.log("Parâmetros recebidos:", { email, name, type, data })
    return {
      success: false,
      error: "Email do destinatário é obrigatório",
      simulated: true,
    }
  }

  if (!name || name.trim() === "") {
    console.warn("⚠️ AVISO: Nome do destinatário está vazio, usando 'Cliente'")
    name = "Cliente"
  }

  // Validar formato do email
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  if (!emailRegex.test(email.trim())) {
    console.error("❌ ERRO: Formato de email inválido:", email)
    return {
      success: false,
      error: "Formato de email inválido",
      simulated: true,
    }
  }

  try {
    const config = window.EMAILJS_CONFIG || {}

    // Verificar se o EmailJS está disponível e configurado
    const isConfigured = isEmailJSConfigured()

    if (!isConfigured) {
      console.log("❌ EmailJS não está configurado. Detalhes:")
      console.log("- Config atual:", {
        enabled: config.ENABLED,
        serviceId: config.SERVICE_ID,
        hasPublicKey: !!config.PUBLIC_KEY,
        emailJSLoaded: typeof window.emailjs !== "undefined",
      })

      // Simular envio
      console.log("🔄 Simulando envio de email...")
      return { success: true, simulated: true, reason: "EmailJS não configurado completamente" }
    }

    // Inicializar EmailJS se necessário
    if (!initializeEmailJS()) {
      console.log("❌ Falha ao inicializar EmailJS. Simulando envio.")
      return { success: true, simulated: true, reason: "Falha na inicialização" }
    }

    // Construir parâmetros do template com MÚLTIPLOS CAMPOS DE EMAIL
    const cleanEmail = email.trim()
    const cleanName = name.trim() || "Cliente"

    const templateParams = {
      // Múltiplas variações do campo de email para compatibilidade
      to_email: cleanEmail,
      email: cleanEmail,
      recipient_email: cleanEmail,
      user_email: cleanEmail,
      destinatario_email: cleanEmail,

      // Múltiplas variações do campo de nome
      to_name: cleanName,
      name: cleanName,
      recipient_name: cleanName,
      user_name: cleanName,
      destinatario_nome: cleanName,

      // Campos padrão
      from_name: "CoachFlow",
      reply_to: "noreply@coachflow.com",
    }

    // Adicionar dados específicos baseados no tipo, garantindo que são strings
    if (data && typeof data === "object") {
      if (data.data) {
        templateParams.data = String(data.data)
        templateParams.session_date = String(data.data)
        templateParams.data_sessao = String(data.data)
      }
      if (data.hora) {
        templateParams.hora = String(data.hora)
        templateParams.session_time = String(data.hora)
        templateParams.hora_sessao = String(data.hora)
      }
      if (data.titulo) {
        templateParams.titulo = String(data.titulo)
        templateParams.session_title = String(data.titulo)
        templateParams.titulo_sessao = String(data.titulo)
      }
      if (data.feedback_link) {
        templateParams.feedback_link = String(data.feedback_link)
        templateParams.link_feedback = String(data.feedback_link)
        templateParams.url_feedback = String(data.feedback_link)
      }
    }

    const templateId = config.TEMPLATES[type] || config.TEMPLATES.padrao || "template_1835qcl"
    let subject = ""
    let message = ""

    switch (type) {
      case "nova_sessao":
        subject = "Nova sessão agendada - CoachFlow"
        message = `Olá ${templateParams.to_name}, uma nova sessão foi agendada para ${templateParams.data || "data não informada"} às ${templateParams.hora || "hora não informada"}. Título: ${templateParams.titulo || "título não informado"}`
        break
      case "sessao_atualizada":
        subject = "Sessão atualizada - CoachFlow"
        message = `Olá ${templateParams.to_name}, sua sessão foi atualizada para ${templateParams.data || "data não informada"} às ${templateParams.hora || "hora não informada"}. Título: ${templateParams.titulo || "título não informado"}`
        break
      case "sessao_cancelada":
        subject = "Sessão cancelada - CoachFlow"
        message = `Olá ${templateParams.to_name}, a sessão "${templateParams.titulo || "título não informado"}" agendada para ${templateParams.data || "data não informada"} às ${templateParams.hora || "hora não informada"} foi cancelada.`
        break
      case "solicitar_feedback":
        subject = "Solicitação de feedback - CoachFlow"
        message = `Olá ${templateParams.to_name}, gostaríamos de receber seu feedback sobre a sessão "${templateParams.titulo || "título não informado"}".`
        if (templateParams.feedback_link) {
          message += ` Acesse: ${templateParams.feedback_link}`
        }
        break
      default:
        subject = "Notificação CoachFlow"
        message = `Olá ${templateParams.to_name}, você tem uma nova notificação do CoachFlow.`
    }

    // Adicionar subject e message com múltiplas variações
    templateParams.subject = subject
    templateParams.message = message
    templateParams.assunto = subject
    templateParams.mensagem = message
    templateParams.email_subject = subject
    templateParams.email_message = message

    console.log("📧 Preparando envio real do email:")
    console.log("- Template ID:", templateId)
    console.log("- Service ID:", config.SERVICE_ID)
    console.log("- Email destinatário:", templateParams.to_email)
    console.log("- Nome destinatário:", templateParams.to_name)
    console.log("- Parâmetros completos:", templateParams)

    // Verificar novamente se o email não está vazio
    if (!templateParams.to_email || templateParams.to_email.trim() === "") {
      console.error("❌ ERRO CRÍTICO: Email ainda está vazio após processamento!")
      return {
        success: false,
        error: "Email do destinatário está vazio após processamento",
        simulated: true,
      }
    }

    // Tentar enviar o email com timeout
    console.log("🚀 Enviando email via EmailJS...")
    console.log("📋 Campos de email enviados:", {
      to_email: templateParams.to_email,
      email: templateParams.email,
      recipient_email: templateParams.recipient_email,
      user_email: templateParams.user_email,
    })

    const emailPromise = window.emailjs.send(config.SERVICE_ID, templateId, templateParams)

    // Adicionar timeout de 15 segundos
    const timeoutPromise = new Promise((_, reject) => {
      setTimeout(() => reject(new Error("Timeout: Email demorou mais de 15 segundos para enviar")), 15000)
    })

    const response = await Promise.race([emailPromise, timeoutPromise])

    console.log("✅ Email enviado com sucesso!")
    console.log("Resposta do EmailJS:", response)

    return { success: true, response, sent: true }
  } catch (error) {
    console.error("❌ Erro ao enviar email:", error)
    console.error("Stack trace:", error.stack)

    // Em caso de erro, simular para não quebrar o fluxo
    console.log("🔄 Simulando envio devido ao erro")

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
    console.log("🔄 Inicializando EmailJS após carregamento da página...")
    const initialized = initializeEmailJS()
    if (initialized) {
      console.log("✅ EmailJS pronto para uso!")
    } else {
      console.log("⚠️ EmailJS não foi inicializado corretamente")
    }
  }, 2000) // Aumentar o delay para 2 segundos
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
