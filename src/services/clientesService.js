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
      tipo_cliente:
        cliente.tipoCliente ||
        cliente.tipo_cliente ||
        "residencial",
      nombre_complejo:
        cliente.nombreComplejo ||
        cliente.nombre_complejo ||
        "",
      contacto_principal:
        cliente.contactoPrincipal ||
        cliente.contacto_principal ||
        "",
      notas: cliente.notas || "",
      activo: true,
    })
    .select()
    .single();

  if (clienteError) throw clienteError;

  let direccionCreada = null;

  if (cliente.direccion) {
    const {
      data: nuevaDireccion,
      error: direccionError,
    } = await supabase
      .from("cliente_direcciones")
      .insert({
        cliente_id: clienteCreado.id,
        etiqueta:
          cliente.tipoCliente === "corporativo"
            ? "Principal"
            : "Casa principal",
        direccion: cliente.direccion,
        apartamento: cliente.apartamento || "",
        edificio: cliente.edificio || "",
        codigo_acceso: cliente.codigoAcceso || "",
        principal: true,
        activo: true,
      })
      .select()
      .single();

    if (direccionError) throw direccionError;

    direccionCreada = nuevaDireccion;
  }

  return {
    ...clienteCreado,
    cliente_direcciones: direccionCreada
      ? [direccionCreada]
      : [],
  };
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

export async function actualizarDireccionClienteSupabase(id, direccion) {
  const { data, error } = await supabase
    .from("cliente_direcciones")
    .update({
      etiqueta: direccion.etiqueta || "Ubicación",
      direccion: direccion.direccion || "",
      apartamento: direccion.apartamento || "",
      edificio: direccion.edificio || "",
      codigo_acceso: direccion.codigoAcceso || "",
      notas: direccion.notas || "",
      principal: Boolean(direccion.principal),
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function eliminarDireccionClienteSupabase(id) {
  const { error } = await supabase
    .from("cliente_direcciones")
    .delete()
    .eq("id", id);

  if (error) throw error;

  return true;
}

export async function eliminarClienteSupabase(id) {
  const clienteId = String(id);

  const { data: ordenesCliente, error: ordenesError } = await supabase
    .from("ordenes")
    .select("id")
    .eq("cliente_id", clienteId);

  if (ordenesError) throw ordenesError;

  const ordenIds = (ordenesCliente || []).map((orden) => orden.id);

  if (ordenIds.length > 0) {
    const tablasOrden = [
      "orden_materiales",
      "orden_fotos",
      "orden_firmas",
      "orden_tecnicos",
    ];

    for (const tabla of tablasOrden) {
      const { error } = await supabase
        .from(tabla)
        .delete()
        .in("orden_id", ordenIds);

      if (error) throw error;
    }

    const { error: ordenesDeleteError } = await supabase
      .from("ordenes")
      .delete()
      .in("id", ordenIds);

    if (ordenesDeleteError) throw ordenesDeleteError;
  }

  const { error: citasError } = await supabase
    .from("citas")
    .delete()
    .eq("cliente_id", clienteId);

  if (citasError) throw citasError;

  const { error: direccionesError } = await supabase
    .from("cliente_direcciones")
    .delete()
    .eq("cliente_id", clienteId);

  if (direccionesError) throw direccionesError;

  const { error: clienteError } = await supabase
    .from("clientes")
    .delete()
    .eq("id", clienteId);

  if (clienteError) throw clienteError;

  return true;
}


export async function actualizarClienteSupabase(id, cliente) {
  const { data, error } = await supabase
    .from("clientes")
    .update({
      nombre: cliente.nombre || "",
      telefono: cliente.telefono || "",
      email: cliente.email || "",
      nombre_complejo: cliente.nombreComplejo || cliente.nombre_complejo || "",
      contacto_principal: cliente.contactoPrincipal || cliente.contacto_principal || "",
      notas: cliente.notas || "",
    })
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;

  return data;
}

export async function actualizarDireccionesClienteSupabase(clienteId, cambios) {
  const payload = {};

  if ("direccion" in cambios) payload.direccion = cambios.direccion || "";

  const { data, error } = await supabase
    .from("cliente_direcciones")
    .update(payload)
    .eq("cliente_id", clienteId)
    .select();

  if (error) throw error;

  return data || [];
}
