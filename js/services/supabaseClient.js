// js/services/supabaseClient.js
import { createClient } from "@supabase/supabase-js"

const SUPABASE_URL = "https://woukxaakahobdmxzvlox.supabase.co" // Replace with your Supabase URL
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6IndvdWt4YWFrYWhvYmRteHp2bG94Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDk3NjcwNjgsImV4cCI6MjA2NTM0MzA2OH0.avNn6iG6YJ69F5jv305vgJz6u3Hg4cksjmRiiekap_A" // Replace with your Supabase Anon Key

export const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)

// Este arquivo não é mais necessário, pois estamos usando o supabase global
// Mantido apenas para referência
