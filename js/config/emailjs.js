// Configuração do EmailJS para CoachFlow usando variáveis de ambiente

window.EMAILJS_CONFIG = {
  // Usar variáveis de ambiente para as configurações do EmailJS
  SERVICE_ID: window.EMAILJS_SERVICE_ID || "service_ik0b5tp",
  PUBLIC_KEY: window.EMAILJS_PUBLIC_KEY || "mH4Lr2yeMa_QJpkRa",

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

  const hasValidServiceId = config.SERVICE_ID && config.SERVICE_ID !== "service_ik0b5tp"
  const hasValidPublicKey = config.PUBLIC_KEY && config.PUBLIC_KEY !== "mH4Lr2yeMa_QJpkRa"

  const isConfigured = config.ENABLED && hasValidServiceId && hasValidPublicKey

  console.log("📧 Verificando configuração EmailJS:")
  console.log("- Habilitado:", config.ENABLED)
  console.log("- Service ID válido:", hasValidServiceId)
  console.log("- Public Key válida:", hasValidPublicKey)
  console.log("- Service ID atual:", config.SERVICE_ID)
  console.log("- Public Key atual:", config.PUBLIC_KEY ? "***configurado***" : "não configurado")

  if (!isConfigured) {
    console.log("⚠️ EmailJS não está totalmente configurado.")
    console.log("Certifique-se de que as variáveis de ambiente estão definidas:")
    console.log("- EMAILJS_SERVICE_ID")
    console.log("- EMAILJS_PUBLIC_KEY")
  } else {
    console.log("✅ EmailJS totalmente configurado e habilitado")
  }

  return isConfigured
}

// Mostrar status da configuração no console
console.log("📧 Configuração EmailJS carregada")
console.log("Status:", window.EMAILJS_CONFIG.ENABLED ? "Habilitado" : "Desabilitado")
console.log("Service ID:", window.EMAILJS_CONFIG.SERVICE_ID)
console.log(
  "Public Key:",
  window.EMAILJS_CONFIG.PUBLIC_KEY && window.EMAILJS_CONFIG.PUBLIC_KEY !== "mH4Lr2yeMa_QJpkRa"
    ? "Configurado via variável de ambiente"
    : "Usando valor padrão",
)
