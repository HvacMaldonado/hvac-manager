import { supabase } from "../lib/supabase";

export async function obtenerClientesSupabase() {
  const { data, error } = await supabase
    .from("clientes")
    .select(`
      *,
      cliente_direcciones (*)
    `)
    .order("created_at", { ascending: false });

  if (error) throw error;

  return data || [];
}

export async function crearClienteSupabase(cliente) {
  const { data, error } = await supabase
    .from("clientes")
    .insert({
      nombre: cliente.nombre,
      telefono: cliente.telefono || "",
      email: cliente.email || "",
      notas: cliente.notas || "",
      activo: true,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}