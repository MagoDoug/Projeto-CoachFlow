// Serviço para gerenciamento de notificações

// Importar emailjs e supabase
import emailjs from "emailjs-com"
import { supabase } from "./supabaseClient"
const EMAILJS_SERVICE_ID = "your_service_id"

// Enviar notificação por email
async function sendSessionNotification(email, name, type, data) {
  try {
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

    await emailjs.send(EMAILJS_SERVICE_ID, templateId, templateParams)

    return { success: true }
  } catch (error) {
    console.error("Erro ao enviar notificação por email:", error)
    return { success: false, error: error.message }
  }
}

// Obter notificações não lidas
async function getUnreadNotifications(userId, userType) {
  try {
    const { data, error } = await supabase
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
    const { data, error } = await supabase
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
    const { error } = await supabase.from("notificacoes").update({ lida: true }).eq("id", notificationId)

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
    const { error } = await supabase
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
