// Configuração do Supabase e EmailJS
const SUPABASE_URL = "SUA_URL_SUPABASE"
const SUPABASE_ANON_KEY = "SUA_CHAVE_ANONIMA_SUPABASE"
const EMAILJS_USER_ID = "SEU_USER_ID_EMAILJS"
const EMAILJS_SERVICE_ID = "SEU_SERVICE_ID_EMAILJS"
const EMAILJS_TEMPLATE_ID = "SEU_TEMPLATE_ID_EMAILJS"

// Importação do EmailJS
const emailjs = require("emailjs")

// Limites do plano gratuito
const FREE_PLAN_LIMITS = {
  MAX_CLIENTS: 5,
  MAX_SESSIONS_PER_CLIENT: 2,
}

// Inicialização do cliente Supabase
const supabase = require("supabase").createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Inicialização do EmailJS
emailjs.init(EMAILJS_USER_ID)
