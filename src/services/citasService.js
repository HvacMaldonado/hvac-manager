import { supabase } from "../lib/supabase";

function mapCita(row) {
  return {
    id: row.id,
    clienteId: row.cliente_id || "",
    direccionId: row.direccion_id || "",
    tecnicoId: row.tecnico_id || "",
    fecha: row.fecha || "",
    hora: row.hora ? String(row.hora).slice(0, 5) : "",
    motivo: row.motivo || "",
    notas: "",
    estado: row.estado || "Programada",
    historialReprogramaciones: row.historial_reprogramaciones || [],
    fechaCreacion: row.created_at || "",
  };
}

export async function obtenerCitasSupabase() {
  const { data, error } = await supabase
    .from("citas")
    .select("*")
    .order("fecha", { ascending: true })
    .order("hora", { ascending: true });

  if (error) throw error;
  return (data || []).map(mapCita);
}

export async function crearCitaSupabase(cita) {
  const { data, error } = await supabase
    .from("citas")
    .insert({
      cliente_id: cita.clienteId || null,
      direccion_id: cita.direccionId || null,
      tecnico_id: cita.tecnicoId || null,
      fecha: cita.fecha || null,
      hora: cita.hora || null,
      motivo: cita.motivo || "",
      estado: cita.estado || "Programada",
      historial_reprogramaciones: cita.historialReprogramaciones || [],
    })
    .select()
    .single();

  if (error) throw error;
  return mapCita(data);
}

export async function actualizarCitaSupabase(id, cambios) {
  const payload = {};

  if ("clienteId" in cambios) payload.cliente_id = cambios.clienteId || null;
  if ("direccionId" in cambios) payload.direccion_id = cambios.direccionId || null;
  if ("tecnicoId" in cambios) payload.tecnico_id = cambios.tecnicoId || null;
  if ("fecha" in cambios) payload.fecha = cambios.fecha || null;
  if ("hora" in cambios) payload.hora = cambios.hora || null;
  if ("motivo" in cambios) payload.motivo = cambios.motivo || "";
  if ("estado" in cambios) payload.estado = cambios.estado || "Programada";
  if ("historialReprogramaciones" in cambios) {
    payload.historial_reprogramaciones = cambios.historialReprogramaciones || [];
  }

  const { data, error } = await supabase
    .from("citas")
    .update(payload)
    .eq("id", id)
    .select()
    .single();

  if (error) throw error;
  return mapCita(data);
}

export async function eliminarCitaSupabase(id) {
  const { error } = await supabase
    .from("citas")
    .delete()
    .eq("id", id);

  if (error) throw error;
  return true;
}
