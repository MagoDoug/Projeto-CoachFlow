// Configuração do EmailJS para CoachFlow

window.EMAILJS_CONFIG = {
  // Suas configurações reais do EmailJS
  SERVICE_ID: "service_ik0b5tp", // Seu service ID real
  PUBLIC_KEY: "YOUR_ACTUAL_PUBLIC_KEY_HERE", // Substitua pela sua chave pública real do EmailJS

  // IDs dos templates que você criou no EmailJS
  TEMPLATES: {
    nova_sessao: "template_nova_sessao",
    sessao_atualizada: "template_sessao_atualizada",
    sessao_cancelada: "template_sessao_cancelada",
    solicitar_feedback: "template_solicitar_feedback",
    padrao: "template_padrao",
  },

  // Configurações adicionais
  ENABLED: true, // Habilitado para usar suas configurações

  // Templates de exemplo para referência
  TEMPLATE_EXAMPLES: {
    nova_sessao: {
      subject: "Nova sessão agendada - {{from_name}}",
      html: `
        <h2>Nova Sessão Agendada</h2>
        <p>Olá {{to_name}},</p>
        <p>Uma nova sessão foi agendada:</p>
        <ul>
          <li><strong>Título:</strong> {{titulo}}</li>
          <li><strong>Data:</strong> {{data}}</li>
          <li><strong>Hora:</strong> {{hora}}</li>
        </ul>
        <p>Atenciosamente,<br>{{from_name}}</p>
      `,
    },
    solicitar_feedback: {
      subject: "Solicitação de feedback - {{from_name}}",
      html: `
        <h2>Solicitação de Feedback</h2>
        <p>Olá {{to_name}},</p>
        <p>Gostaríamos de receber seu feedback sobre a sessão "{{titulo}}".</p>
        <p><a href="{{feedback_link}}" style="background-color: #4F46E5; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">Deixar Feedback</a></p>
        <p>Atenciosamente,<br>{{from_name}}</p>
      `,
    },
  },
}

// Função para verificar se está configurado
window.checkEmailJSConfiguration = () => {
  const config = window.EMAILJS_CONFIG

  const isConfigured =
    config.ENABLED &&
    config.SERVICE_ID &&
    config.SERVICE_ID !== "service_coachflow" &&
    config.PUBLIC_KEY &&
    config.PUBLIC_KEY !== "YOUR_ACTUAL_PUBLIC_KEY_HERE" &&
    config.PUBLIC_KEY !== "mH4Lr2yeMa_QJpkRa"

  if (!isConfigured) {
    console.log("📧 EmailJS não está totalmente configurado.")
    console.log("Para configurar completamente:")
    console.log("1. Acesse https://dashboard.emailjs.com/")
    console.log("2. Vá em Account > General e copie sua Public Key")
    console.log("3. Substitua 'YOUR_ACTUAL_PUBLIC_KEY_HERE' pela sua chave real")
    console.log("4. Crie os templates de email necessários")
    console.log("Configuração atual:", {
      enabled: config.ENABLED,
      serviceId: config.SERVICE_ID,
      publicKey: config.PUBLIC_KEY === "YOUR_ACTUAL_PUBLIC_KEY_HERE" ? "Precisa ser configurado" : "Configurado",
    })
  } else {
    console.log("📧 EmailJS totalmente configurado e habilitado")
  }

  return isConfigured
}

// Mostrar status da configuração no console
console.log("📧 Configuração EmailJS carregada")
console.log("Status:", window.EMAILJS_CONFIG.ENABLED ? "Habilitado" : "Desabilitado")
console.log("Service ID:", window.EMAILJS_CONFIG.SERVICE_ID)
console.log(
  "Public Key:",
  window.EMAILJS_CONFIG.PUBLIC_KEY === "YOUR_ACTUAL_PUBLIC_KEY_HERE" ? "Precisa ser configurado" : "Configurado",
)
