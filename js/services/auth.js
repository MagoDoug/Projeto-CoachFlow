// Import Supabase client
import { createClient } from "@supabase/supabase-js"

const supabaseUrl = "https://woukxaakahobdmxzvlox.supabase.co"
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdWt4YWFrYWhvYmRteHp2bG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjcwNjgsImV4cCI6MjA2NTM0MzA2OH0.avNn6iG6YJ69F5jv305vgJz6u3Hg4cksjmRiiekap_A"
const supabase = createClient(supabaseUrl, supabaseKey)

// Serviço de autenticação

// Registrar novo coach
async function registerCoach(email, password, name) {
  try {
    // Registrar usuário no Supabase Auth
    const { data: authData, error: authError } = await supabase.auth.signUp({
      email,
      password,
    })

    if (authError) throw authError

    // Criar perfil do coach
    const { data: coachData, error: coachError } = await supabase.from("coaches").insert([
      {
        id: authData.user.id,
        name,
        email,
        created_at: new Date(),
      },
    ])

    if (coachError) throw coachError

    return { success: true, user: authData.user }
  } catch (error) {
    console.error("Erro ao registrar coach:", error)
    return { success: false, error: error.message }
  }
}

// Login
async function loginCoach(email, password) {
  try {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })

    if (error) throw error

    return { success: true, user: data.user }
  } catch (error) {
    console.error("Erro ao fazer login:", error)
    return { success: false, error: error.message }
  }
}

// Logout
async function logoutCoach() {
  try {
    const { error } = await supabase.auth.signOut()

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao fazer logout:", error)
    return { success: false, error: error.message }
  }
}

// Verificar sessão atual
async function getCurrentSession() {
  try {
    const { data, error } = await supabase.auth.getSession()

    if (error) throw error

    return {
      success: true,
      session: data.session,
      user: data.session?.user || null,
    }
  } catch (error) {
    console.error("Erro ao verificar sessão:", error)
    return { success: false, error: error.message }
  }
}

// Recuperar senha
async function resetPassword(email) {
  try {
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao solicitar redefinição de senha:", error)
    return { success: false, error: error.message }
  }
}

// Atualizar senha
async function updatePassword(newPassword) {
  try {
    const { error } = await supabase.auth.updateUser({
      password: newPassword,
    })

    if (error) throw error

    return { success: true }
  } catch (error) {
    console.error("Erro ao atualizar senha:", error)
    return { success: false, error: error.message }
  }
}
