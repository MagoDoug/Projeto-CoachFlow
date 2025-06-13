// Configuração do EmailJS para CoachFlow

// INSTRUÇÕES PARA CONFIGURAR O EMAILJS:
// 1. Acesse https://dashboard.emailjs.com/
// 2. Crie uma conta ou faça login
// 3. Crie um novo serviço de email
// 4. Obtenha sua chave pública em Account > General
// 5. Crie templates de email para cada tipo de notificação
// 6. Substitua os valores abaixo pelas suas configurações reais

window.EMAILJS_CONFIG = {
  // Substitua pelos seus valores reais do EmailJS
  SERVICE_ID: "service_ik0b5tp", // Ex: "service_abc123"
  PUBLIC_KEY: "mH4Lr2yeMa_QJpkRa", // Ex: "user_xyz789"

  // IDs dos templates que você criou no EmailJS
  TEMPLATES: {
    nova_sessao: "template_nova_sessao",
    sessao_atualizada: "template_sessao_atualizada",
    sessao_cancelada: "template_sessao_cancelada",
    solicitar_feedback: "template_solicitar_feedback",
    padrao: "template_padrao",
  },

  // Configurações adicionais
  ENABLED: true, // Mude para true quando configurar corretamente

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
    config.ENABLED && config.SERVICE_ID !== "seu_service_id_aqui" && config.PUBLIC_KEY !== "sua_chave_publica_aqui"

  if (!isConfigured) {
    console.log("📧 EmailJS não está configurado.")
    console.log("Para configurar:")
    console.log("1. Acesse https://dashboard.emailjs.com/")
    console.log("2. Configure seu serviço de email")
    console.log("3. Atualize o arquivo js/config/emailjs.js")
    console.log("4. Mude ENABLED para true")
  }

  return isConfigured
}

// Mostrar status da configuração no console
console.log("📧 Configuração EmailJS carregada")
console.log("Status:", window.EMAILJS_CONFIG.ENABLED ? "Habilitado" : "Desabilitado")
