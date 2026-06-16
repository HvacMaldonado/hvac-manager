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
  const { data: clienteCreado, error: clienteError } = await supabase
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

  if (clienteError) throw clienteError;

  if (cliente.direccion) {
    const { error: direccionError } = await supabase
      .from("cliente_direcciones")
      .insert({
        cliente_id: clienteCreado.id,
        etiqueta: "Principal",
        direccion: cliente.direccion,
        apartamento: cliente.apartamento || "",
        edificio: cliente.edificio || "",
        codigo_acceso: cliente.codigoAcceso || "",
        principal: true,
        activo: true,
      });

    if (direccionError) throw direccionError;
  }

  return clienteCreado;
}


export async function crearDireccionClienteSupabase(clienteId, direccion) {
  const { data, error } = await supabase
    .from("cliente_direcciones")
    .insert({
      cliente_id: clienteId,
      etiqueta: direccion.etiqueta || "Ubicación",
      direccion: direccion.direccion || "",
      apartamento: direccion.apartamento || "",
      edificio: direccion.edificio || "",
      codigo_acceso: direccion.codigoAcceso || "",
      notas: direccion.notas || "",
      principal: Boolean(direccion.principal),
      activo: true,
    })
    .select()
    .single();

  if (error) throw error;

  return data;
}
