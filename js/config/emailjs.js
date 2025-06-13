// Configuração do EmailJS para CoachFlow usando variáveis de ambiente

window.EMAILJS_CONFIG = {
  // Usar variáveis de ambiente se disponíveis, senão usar valores padrão
  SERVICE_ID: window.EMAILJS_SERVICE_ID || "service_ik0b5tp",
  PUBLIC_KEY: window.EMAILJS_PUBLIC_KEY || "mH4Lr2yeMa_QJpkRa",

  // IDs dos templates que você criou no EmailJS - CORRIGIDOS
  TEMPLATES: {
    nova_sessao: "template_1835qcl", // Este existe
    sessao_atualizada: "template_1835qcl", // Usar o mesmo template
    sessao_cancelada: "template_1835qcl", // Usar o mesmo template
    solicitar_feedback: "template_1835qcl", // Usar o template que existe
    padrao: "template_1835qcl", // Usar o template que existe
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

// Função para verificar se está configurado - VERSÃO MAIS PERMISSIVA
window.checkEmailJSConfiguration = () => {
  const config = window.EMAILJS_CONFIG

  // Verificar se EmailJS está disponível
  const emailJSAvailable = typeof window.emailjs !== "undefined"

  // Verificar se tem configurações básicas (mesmo que sejam as padrão para teste)
  const hasServiceId = config.SERVICE_ID && config.SERVICE_ID.length > 0
  const hasPublicKey = config.PUBLIC_KEY && config.PUBLIC_KEY.length > 0

  const isConfigured = config.ENABLED && emailJSAvailable && hasServiceId && hasPublicKey

  console.log("📧 Verificando configuração EmailJS (modo permissivo):")
  console.log("- EmailJS disponível:", emailJSAvailable)
  console.log("- Habilitado:", config.ENABLED)
  console.log("- Service ID:", config.SERVICE_ID)
  console.log("- Public Key:", hasPublicKey ? "***configurado***" : "não configurado")
  console.log("- Template padrão:", config.TEMPLATES.padrao)
  console.log("- Configuração válida:", isConfigured)

  if (!isConfigured) {
    console.log("⚠️ EmailJS não está configurado corretamente.")
    if (!emailJSAvailable) {
      console.log("- EmailJS não foi carregado")
    }
    if (!hasServiceId) {
      console.log("- Service ID não encontrado")
    }
    if (!hasPublicKey) {
      console.log("- Public Key não encontrada")
    }
  } else {
    console.log("✅ EmailJS configurado e pronto para uso!")
  }

  return isConfigured
}

// Mostrar status da configuração no console
console.log("📧 Configuração EmailJS carregada")
console.log("Status:", window.EMAILJS_CONFIG.ENABLED ? "Habilitado" : "Desabilitado")
console.log("Service ID:", window.EMAILJS_CONFIG.SERVICE_ID)
console.log("Public Key:", window.EMAILJS_CONFIG.PUBLIC_KEY ? "***configurado***" : "não configurado")
console.log("Template padrão:", window.EMAILJS_CONFIG.TEMPLATES.padrao)
