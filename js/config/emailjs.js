// Configuração do EmailJS para CoachFlow usando variáveis de ambiente

window.EMAILJS_CONFIG = {
  // Usar variáveis de ambiente se disponíveis, senão usar valores padrão
  SERVICE_ID: window.EMAILJS_SERVICE_ID || "service_ik0b5tp",
  PUBLIC_KEY: window.EMAILJS_PUBLIC_KEY || "mH4Lr2yeMa_QJpkRa",

  // IDs dos templates que você criou no EmailJS
  TEMPLATES: {
    nova_sessao: "template_1835qcl",
    sessao_atualizada: "template_sessao_atualizada",
    sessao_cancelada: "template_sessao_cancelada",
    solicitar_feedback: "template_igrngdo",
    padrao: "template_padrao",
  },

  // Configurações adicionais
  ENABLED: true,

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

  // Verificar se as configurações são diferentes dos valores padrão
  const hasValidServiceId = config.SERVICE_ID && config.SERVICE_ID !== "service_ik0b5tp"
  const hasValidPublicKey = config.PUBLIC_KEY && config.PUBLIC_KEY !== "mH4Lr2yeMa_QJpkRa"

  const isConfigured = config.ENABLED && (hasValidServiceId || hasValidPublicKey)

  console.log("📧 Verificando configuração EmailJS:")
  console.log("- Habilitado:", config.ENABLED)
  console.log("- Service ID:", config.SERVICE_ID)
  console.log("- Service ID válido:", hasValidServiceId ? "✅ Personalizado" : "⚠️ Padrão")
  console.log("- Public Key válida:", hasValidPublicKey ? "✅ Personalizada" : "⚠️ Padrão")

  if (!isConfigured) {
    console.log("⚠️ EmailJS usando configurações padrão.")
    console.log("Para usar suas configurações reais:")
    console.log("1. Configure as variáveis de ambiente no Vercel:")
    console.log("   - EMAILJS_SERVICE_ID")
    console.log("   - EMAILJS_PUBLIC_KEY")
    console.log("2. Faça um novo deploy")
  } else {
    console.log("✅ EmailJS configurado com suas credenciais!")
  }

  return isConfigured
}

// Mostrar status da configuração no console
console.log("📧 Configuração EmailJS carregada")
console.log("Status:", window.EMAILJS_CONFIG.ENABLED ? "Habilitado" : "Desabilitado")
console.log("Service ID:", window.EMAILJS_CONFIG.SERVICE_ID)
console.log("Public Key:", window.EMAILJS_CONFIG.PUBLIC_KEY ? "***configurado***" : "não configurado")
