// Script de build para substituir variáveis de ambiente

const fs = require("fs")
const path = require("path")

function replaceEnvironmentVariables() {
  const indexPath = path.join(__dirname, "../index.html")
  let indexContent = fs.readFileSync(indexPath, "utf8")

  // Substituir variáveis de ambiente
  const replacements = {
    service_ik0b5tp: process.env.EMAILJS_SERVICE_ID || "service_ik0b5tp",
    mH4Lr2yeMa_QJpkRa: process.env.EMAILJS_PUBLIC_KEY || "mH4Lr2yeMa_QJpkRa",
  }

  Object.entries(replacements).forEach(([placeholder, value]) => {
    indexContent = indexContent.replace(new RegExp(placeholder, "g"), value)
  })

  // Escrever arquivo atualizado
  fs.writeFileSync(indexPath, indexContent)

  console.log("✅ Variáveis de ambiente substituídas com sucesso!")
  console.log("📧 EmailJS Service ID:", process.env.EMAILJS_SERVICE_ID ? "***configurado***" : "usando padrão")
  console.log("🔑 EmailJS Public Key:", process.env.EMAILJS_PUBLIC_KEY ? "***configurado***" : "usando padrão")
}

// Executar apenas se chamado diretamente
if (require.main === module) {
  replaceEnvironmentVariables()
}

module.exports = { replaceEnvironmentVariables }
