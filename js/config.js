// Configuração do Supabase e EmailJS
const SUPABASE_URL = "https://woukxaakahobdmxzvlox.supabase.co"
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdWt4YWFrYWhvYmRteHp2bG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjcwNjgsImV4cCI6MjA2NTM0MzA2OH0.avNn6iG6YJ69F5jv305vgJz6u3Hg4cksjmRiiekap_A"
const EMAILJS_USER_ID = "seu_user_id_emailjs"
const EMAILJS_SERVICE_ID = "seu_service_id_emailjs"
const EMAILJS_TEMPLATE_ID = "seu_template_id_emailjs"

// Importação do Supabase
const supabaseJs = require("supabase-js")

// Importação do EmailJS
const emailjs = require("emailjs-com")

// Limites do plano gratuito
const FREE_PLAN_LIMITS = {
  MAX_CLIENTS: 5,
  MAX_SESSIONS_PER_CLIENT: 2,
}

// Inicialização do cliente Supabase
const supabase = supabaseJs.createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Inicialização do EmailJS (se disponível)
if (typeof emailjs !== "undefined") {
  emailjs.init(EMAILJS_USER_ID)
}
