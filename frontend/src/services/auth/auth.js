import { supabase } from './supabaseClient'

export async function login(email, password) {
    const { error, data } = await supabase.auth.signInWithPassword({ email, password })
    if (error) throw error
    return data
}

export async function signup(email, password) {
    const { error, data } = await supabase.auth.signUp({ email, password })
    if (error) throw error
    return data
}
export async function logout() {
    const { error } = await supabase.auth.signOut()
    if (error) throw error
}

export async function getCurrentUser() {
    const { data, error } = await supabase.auth.getUser()
    if (error) throw error
    return data.user
}